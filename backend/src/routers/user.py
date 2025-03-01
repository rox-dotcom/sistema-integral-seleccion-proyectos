"""
Contiene los endpoint relacionados a los usuarios
"""

from fastapi import APIRouter

from user.user_auth import (
    UserRegistry,
    _init_db,
    delete_user,
    get_user_id,
    is_user,
    register_user,
)
from user.user_storage import assert_user_storage, reset_user_storage

router = APIRouter(
    prefix="/user",
    tags=["user"],
)

_init_db()
assert_user_storage()


@router.get("/{user}")
async def exists_user(user: str) -> dict[str, bool]:
    """Verifica si un usuario existe"""
    exists = is_user(user)
    return {"exists": exists}


@router.post("/")
async def reg_user(user_data: UserRegistry) -> dict[str, str]:
    """Registra un nuevo usuario"""
    register_user(user_data.username, user_data.password)
    return {"response": f"Usuario '{user_data.username}' registrado"}


@router.delete("/{user}")
async def del_user(user: str) -> dict[str, str]:
    """Elimina un usuario"""
    delete_user(user)
    return {"response": f"Usuario '{user}' eliminado"}


@router.post("/reset/{user}")
async def reset_user(user: str) -> dict[str, str]:
    """Resetea los archivos de un usuario"""
    reset_user_storage(get_user_id(user))
    return {"response": f"Usuario '{user}' reseteado"}
