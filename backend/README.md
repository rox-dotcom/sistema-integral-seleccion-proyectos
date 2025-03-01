# Servicio-Becario-Algoritmos Backend

Contiene el codigo de la API del backend, expone una interfaz para la
comunicacion entre el ejecutable de algoritmos, y la logica de la interfaz.

### Dependencias

La app usa gestionador de paquetes uv, por medio de este se instalan todas las
dependencias de python, y opcionalmente un runtime de python. Tambien se
require un runtime de java. La API usa el framework FastAPI (instalado por uv).

Instalar las dependencias:

#### UV
[Guia para instalar uv](https://docs.astral.sh/uv/getting-started/installation/)

#### Python
[Guia para instalar python con uv](https://docs.astral.sh/uv/guides/install-python/),
opcionalmente se puede instalar por otro metodo dependiente de la plataforma.
la version de python a utilizar esta en `backend/.python-version`

#### Java runtime
[Guia para instalar java](https://www.java.com/en/download/help/download_options.html),
la version de java a utilizar esta en `backend/.java-version`

### Ejecucion del Backend

```bash
cd backend

# instala las dependencias en el entorno de python
uv sync

# activa el entorno virtual

# windows
.\.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

# Ejecutar backend
py src/main.py

# opcionalmente utilizando uvicorn directamente
cd src
uvicorn main:app --reload
```

### Analizador estatico y Formatter de codigo

El proyecto usa ruff como linter (analizador de codigo estatico) y formatter,
para filtrar errores comunes y mantener un alto estandar de codigo. Este es
instalado por medio de uv, se instala conjunto a las demas dependencias.

Se puede utilizar ruff por medio de `uvx ruff` o despues de activar el entorno
virtual con solo `ruff`.

Para formatear usar: `$ruff format <target-file-or-dir>`

y para analizar el codigo: `$ruff format<target-file-or-dir>`
