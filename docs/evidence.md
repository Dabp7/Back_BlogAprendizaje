# Evidencia de verificación — 2026-11-27

Entorno: Windows10 x64, Node22.15.0, npm10.9.2 y MongoDB8.0.8 real en replica set temporal. Se reutilizó el binario local con MONGOMS_SYSTEM_BINARY y MONGOMS_SYSTEM_BINARY_VERSION_CHECK=false; no se utilizó la base personal.

- npm install --package-lock-only --no-audit --no-fund: lockfile sincronizado.
- npm run verify: sintaxis de entrada y10 pruebas HTTP aprobadas, cero fallos.
- npm audit --json: cero vulnerabilidades reportadas, incluidas dependencias de desarrollo.
- npm run demo: inició un replica set independiente, cargó2categorías,3posts y1comentario ficticios y sirvió API en127.0.0.1:3000.
- GET /health y GET /kinaloop/v1/post/:200, tres publicaciones con categorías pobladas. El frontend puede conectarse sin mocks.

La suite cubre límites/trim y campos ignorados, publicación inválida/inexistente/inactiva, vacío/paginación estable,10altas simultáneas, carrera alta/baja sin huérfanos, clave administrativa y campos protegidos, seed repetido sin borrar comentarios, errores seguros de JSON/cuerpo y rate limit.

Los dumps, .env y colección histórica se retiraron del árbol versionado sin reescribir el historial. La colección nueva usa contenido sintético y variables vacías para claves. Docker Compose está configurado como alternativa de base; no se ejecutó Docker en esta máquina. CI ejecuta instalación limpia, la suite real y auditoría.
