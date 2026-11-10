# Python Escape Room — TC1038

Sitio estático listo para GitHub Pages. No requiere servidor, base de datos, API key ni cuenta de ChatGPT para estudiantes.

## Publicar en GitHub Pages
1. Crea un repositorio público en GitHub, por ejemplo `python-escape-room-tc1038`.
2. Sube a la raíz los archivos `index.html`, `styles.css`, `app.js` y `python-worker.js`.
3. En el repositorio, abre **Settings → Pages**. En **Build and deployment**, selecciona **Deploy from a branch**, rama `main`, carpeta `/ (root)` y guarda.
4. Espera a que GitHub publique el sitio. La URL será similar a `https://TU-USUARIO.github.io/python-escape-room-tc1038/` (reemplaza TU-USUARIO).
5. Prueba la actividad completa antes de distribuirla.

## Integración con Canvas
En una página de Canvas usa un enlace a la URL pública, o un iframe si la política de seguridad de Canvas permite ese dominio:

```html
<iframe title="Python Escape Room TC1038" src="https://TU-USUARIO.github.io/python-escape-room-tc1038/" width="100%" height="850" loading="lazy" allowfullscreen></iframe>
```

Se recomienda el enlace en una nueva pestaña para que el estudiante tenga suficiente espacio para el editor de código.

## Operación
- Se guardan alias, código, respuestas, pistas y puntuación en `localStorage` del navegador. No hay sincronización entre dispositivos ni recuperación si se borra el almacenamiento.
- Python se carga desde CDN usando Pyodide 0.27.7 y se ejecuta en un Web Worker; **se necesita Internet** y el CDN debe estar accesible. Si el navegador bloquea el CDN, no se podrán verificar los retos de código.
- Cada intento de código tiene límite de 15 segundos; el Worker se destruye después de cada verificación.
- Las pruebas de código son automáticas, pero no constituyen un entorno de ejecución aislado con garantías de seguridad para código malicioso. Usar solo con estudiantes y ejercicios de confianza.
- Los XP son formativos; el archivo de evidencia no acredita identidad ni impide que se modifique. Para una evaluación sumativa, revisar el código en Canvas.
- El sitio no usa IA generativa ni envía datos a una base de datos. La descarga del reporte se genera localmente.

## Archivos
- `index.html`: interfaz y estructura de la actividad.
- `styles.css`: diseño adaptable a móviles y computadoras.
- `app.js`: narrativa, preguntas, lógica de progreso, evaluación y reporte.
- `python-worker.js`: intérprete Python y pruebas automatizadas.
