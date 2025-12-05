# 🧭 Brújula Digital - OSINT Intelligence Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success)
![Python](https://img.shields.io/badge/Built%20With-Python%20%26%20JS-yellow)

Brújula Digital: es un framework de inteligencia de fuentes abiertas (OSINT) de alto rendimiento. Diseñado para analistas de ciberseguridad y Red Teams, ofrece un acceso centralizado y categorizado a más de 1,000 herramientas de investigación.

![Dashboard Preview](public/img/screenshots/dashboard.jpg)

## 🚀 Características
* Arquitectura Híbrida: Backend de curación en Python + Frontend estático ultrarrápido.

* Clasificación Inteligente: Algoritmo en Python (`curate_data.py`) que categoriza automáticamente las herramientas basándose en heurística de dominios y palabras clave.
* Búsqueda Fuzzy: Integración con Fuse.js para búsquedas instantáneas y tolerantes a fallos tipográficos.
* Interfaz Reactiva: Diseño moderno Dark Mode optimizado para largas sesiones de investigación.
* 100% Client-Side: Máxima privacidad; ninguna búsqueda sale de tu navegador hacia servidores de terceros.

 🛠️ Instalación y Uso Local

Este proyecto no requiere servidores complejos. Puedes ejecutarlo localmente en segundos.

1.  Clonar el repositorio:
    ```bash
    git clone [https://github.com/tu-usuario/brujula-osint.git](https://github.com/tu-usuario/brujula-osint.git)
    cd brujula-osint
    ```

2.  Actualizar la Base de Datos (Opcional):
    Si deseas añadir tus propias herramientas, edita `builder/urls.txt` y regenera el dataset:
    ```bash
    cd builder
    python curate_data.py
    # Esto actualizará automáticamente public/data.js
    ```

3.  Ejecutar:
    Simplemente abre el archivo `public/index.html` en tu navegador favorito.

 🗂️ Estructura del Proyecto

* `/builder`: Contiene la lógica de inteligencia (Python) que procesa las URLs crudas, asigna categorías, etiquetas y descripciones, y compila el archivo de datos.
* `/public`: El aplicativo web final optimizado para despliegue en bordes (Vercel/Netlify).

 🛡️ Disclaimer
Esta herramienta ha sido creada con fines estrictamente educativos y de investigación defensiva. El autor no se hace responsable del mal uso de la información proporcionada.

---
Desarrollado por John SebastianCamargo
