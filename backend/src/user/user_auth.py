"""
Módulo de autenticación y gestión de usuarios.

Contiene funciones para inicializar la base de datos, registrar, eliminar y autenticar usuarios.
También define el modelo de datos para el registro de usuarios (UserRegistry).
"""

import hashlib
import os
import sqlite3
from uuid import UUID, uuid4

from fastapi import HTTPException
from pydantic import BaseModel

from user.user_storage import del_user_storage, reset_user_storage

DB_FILE = os.getenv("DB_FILE")

# Validar que la variable de entorno DB_FILE este definida
if not DB_FILE:
    raise ValueError("DB_FILE environment variable is not set or is empty.")


def _init_db():
    """Inicializa la base de datos si no existe."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                username TEXT PRIMARY KEY,
                user_id TEXT UNIQUE,
                password_hash TEXT
            )
        """
        )
        conn.commit()


def hash_password(password: str) -> str:
    """Genera el hash de una contraseña."""
    return hashlib.sha256(password.encode()).hexdigest()


def register_user(user: str, password: str) -> None:
    """Registra un nuevo usuario en la base de datos."""
    if not user or not password:
        raise HTTPException(400, detail="Nombre o contraseña inválidos")

    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        # Verificar que el usuario no exista
        cursor.execute("SELECT user_id FROM users WHERE username = ?", (user,))
        if cursor.fetchone():
            raise HTTPException(400, detail="Usuario ya existe")

        # Generar user_id y validar que no colisione
        user_id = str(uuid4())
        cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))
        while cursor.fetchone():
            user_id = str(uuid4())
            cursor.execute("SELECT user_id FROM users WHERE user_id = ?", (user_id,))

        password_hash = hash_password(password)
        cursor.execute(
            "INSERT INTO users (username, user_id, password_hash) VALUES (?, ?, ?)",
            (user, user_id, password_hash),
        )
        conn.commit()

        reset_user_storage(UUID(user_id))


def delete_user(user: str) -> None:
    """Elimina un usuario de la base de datos."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user_id FROM users WHERE username = ?", (user,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(404, detail="Usuario no existe")

        user_id = result[0]
        del_user_storage(user_id)
        cursor.execute("DELETE FROM users WHERE username = ?", (user,))
        conn.commit()


def is_user(user: str) -> bool:
    """Verifica si un usuario existe en la base de datos."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM users WHERE username = ?", (user,))
        return cursor.fetchone() is not None


def get_user_id(user: str) -> UUID:
    """Recupera el UUID de un usuario."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT user_id FROM users WHERE username = ?", (user,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(404, detail=f"Usuario '{user}' no existe")
        return UUID(result[0])


def authenticate_user(username: str, password: str) -> bool:
    """Autentica a un usuario comparando la contraseña ingresada con el hash almacenado."""
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT password_hash FROM users WHERE username = ?", (username,)
        )
        result = cursor.fetchone()
        if not result:
            return False
        return hash_password(password) == result[0]


# Mover el modelo UserRegistration al módulo de autenticación y renombrarlo a UserRegistry
class UserRegistry(BaseModel):
    """
    Modelo de datos para el registro de usuarios.

    Atributos:
        username (str): Nombre de usuario.
        password (str): Contraseña del usuario.
    """

    username: str
    password: str
