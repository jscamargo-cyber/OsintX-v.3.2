# 🛡️ Reporte de Auditoría de Seguridad - Brújula Digital

**Fecha:** 5 de Diciembre, 2025
**Auditor:** Antigravity (Senior Security Researcher)
**Objetivo:** Análisis SAST y Red Teaming del OSINT Framework.

---

## 💀 Fase 1: Reconocimiento y Superficie de Ataque

### 1. Frontend (`assets/script.js` & `index.html`)
*   **DOM-based XSS Potencial:** Se detectó el uso de `innerHTML` en la línea 349:
    ```javascript
    modalDesc.innerHTML = DOMPurify.sanitize(tool.description || tool.desc);
    ```
    *Análisis:* Aunque el uso de `DOMPurify` es una excelente práctica de mitigación, el uso de `innerHTML` siempre abre una puerta si la librería de sanitización falla o se configura incorrectamente. Dado que las descripciones en `curate_data.py` son texto plano genérico, el uso de `innerHTML` es innecesario y aumenta la superficie de ataque.
*   **Dependencias:** Se carga `DOMPurify` desde un CDN (`cdnjs.cloudflare.com`). Si este CDN fuera comprometido, el atacante tendría ejecución arbitraria de código (Supply Chain Attack).

### 2. Backend/Build (`scripts/curate_data.py`)
*   **Validación de Entrada:** El script verifica `if not url.startswith("http"): continue`.
    *   *Fortaleza:* Esto bloquea efectivamente esquemas peligrosos como `javascript:`, `data:`, o `vbscript:`.
    *   *Debilidad:* No sanitiza la URL de caracteres peligrosos (`<`, `>`, `"`, `'`). Si bien `json.dumps` escapa comillas, la persistencia de caracteres HTML en la base de datos es una mala práctica ("Data Poisoning").

### 3. Infraestructura (`vercel.json` y Headers)
*   **Cabeceras Presentes:** `X-Frame-Options`, `X-Content-Type-Options`, `HSTS`.
*   **Cabeceras Faltantes:** `Content-Security-Policy` (CSP) no está definida a nivel de servidor (solo meta tag en HTML, que es más débil y no soporta reportes).
*   **Exposición de Archivos:** La carpeta `scripts/` y el archivo `urls.txt` son accesibles públicamente si no se bloquean, revelando la lógica de negocio y la fuente de datos cruda.

---

## ⚔️ Fase 2: Simulación de Ataques (Red Team)

### Vector 1: Inyección de Carga Útil en `urls.txt` (Stored XSS)
*   **Concepto:** Un atacante logra hacer commit de una línea maliciosa en `urls.txt`:
    `http://example.com/tool?q="><img src=x onerror=alert(document.domain)>`
*   **Resultado:** `curate_data.py` la procesa como válida (empieza por http). Se guarda en `data.js`. Cuando `script.js` renderiza el botón "Visitar Sitio", inyecta el atributo `href`. Si no se sanitiza, podría romper el atributo HTML, aunque React/DOM moderno suele proteger atributos, el riesgo de "Attribute Injection" existe si se construye el HTML manualmente.

### Vector 2: Logic Bomb / DoS en Build
*   **Concepto:** Inyectar una URL extremadamente larga (10MB de caracteres) en `urls.txt`.
*   **Resultado:** `curate_data.py` podría quedarse colgado o consumir toda la RAM del CI/CD de Vercel, causando una denegación de servicio en el despliegue.

### Vector 3: Prototype Pollution via Fuse.js
*   **Concepto:** Si las claves de búsqueda en Fuse.js fueran controlables por el usuario final (ej: vía parámetros URL modificados) y Fuse tuviera una vuln antigua, se podría contaminar `Object.prototype`.
*   **Estado:** En tu implementación actual, las claves están harcodeadas (`keys: ['name', ...]`), mitigando este riesgo.

---

## 🛡️ Fase 3: Hardening y Reparación (Blue Team)

### 1. Hardening de Código (`assets/script.js`)
**Acción:** Reemplazar `innerHTML` por `textContent` para eliminar la necesidad de `DOMPurify` y cerrar el vector XSS.

**Código Vulnerable:**
```javascript
modalDesc.innerHTML = DOMPurify.sanitize(tool.description || tool.desc);
```

**Código Blindado (Recomendado):**
```javascript
// Más rápido y 100% seguro contra XSS
modalDesc.textContent = tool.description || tool.desc;
```

### 2. Sanitización en Build (`scripts/curate_data.py`)
**Acción:** Limpiar URLs de caracteres que no pertenecen a una URL estándar.

```python
def sanitize_url(url):
    # Eliminar caracteres peligrosos comunes en inyecciones
    return re.sub(r'[<>"\'\s]', '', url)
```

### 3. Configuración de Infraestructura (`vercel.json`)
**Acción:** Implementar CSP estricta y bloquear acceso a archivos sensibles.

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:;"
        },
        ...
      ]
    }
  ],
  "rewrites": [
    { "source": "/scripts/:match*", "destination": "/404" },
    { "source": "/urls.txt", "destination": "/404" }
  ]
}
```

---

## 📂 Fase 4: Mejora de Estructura Interna

La reorganización que realizamos (`assets/`, `scripts/`) es sólida. Para mitigar el riesgo de *source disclosure*, implementaremos las reglas de bloqueo en `vercel.json` mencionadas arriba.

**Veredicto Final:** El proyecto tiene una base de seguridad aceptable, pero la exposición de archivos de configuración y la dependencia de librerías de sanitización en el cliente son puntos débiles que corregiremos a continuación.
