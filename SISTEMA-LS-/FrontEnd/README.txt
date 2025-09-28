# README.txt

## 1. Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js (versión recomendada: >=18.0.0)
  node --version

- npm (gestor de paquetes de Node, viene con Node.js)
  npm --version

- Python (versión recomendada: >=3.10)
  python --version

- pip (gestor de paquetes de Python)
  pip --version

- Django en el backend (>=5.0.0)
  python -m django --version

Nota: El backend Django debe estar corriendo en http://localhost:8000/api con los endpoints /lista/vocales/ y /guardar/letras/.
Si no lo tienes, el frontend usará datos de respaldo (FALLBACK_VOWELS).

------------------------------------------------------------

## 2. Instalación del frontend (React)

1. Clona el repositorio:
   git clone <URL_DEL_REPO>
   cd <NOMBRE_DEL_PROYECTO>

2. Instala dependencias del frontend:
   npm install

3. Dependencias necesarias (ya incluidas en React, pero por si acaso):
   - react
   - react-dom
   - react-scripts (si usas Create React App)

   Verifica con:
   npm list react react-dom

------------------------------------------------------------

## 3. Ejecución del proyecto

Frontend (React):
   npm start
   Se abrirá en: http://localhost:3000

Backend (Django):
   python manage.py runserver
   Se abrirá en: http://localhost:8000/api

------------------------------------------------------------

## 4. Configuración de API

En el archivo principal (AdminPageVowels.jsx), se usa la siguiente configuración:

const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  ENDPOINTS: {
    VOWELS_LIST: '/lista/vocales/',   // GET
    SAVE_VOWEL: '/guardar/letras/'    // POST
  },
  TIMEOUT: 10000
};

Asegúrate de que tu backend Django exponga esos endpoints.

------------------------------------------------------------

## 5. Notas adicionales

- El frontend tiene estilos integrados en JS, no requiere CSS externo.
- Si deseas personalizar, puedes mover los estilos a un archivo App.css.
- El hook useVowels carga datos de la API; si falla, usa los datos de respaldo (FALLBACK_VOWELS).

------------------------------------------------------------

Con esto, tu proyecto quedará 100% funcional en cualquier entorno.
