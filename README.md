# Backend del Blog de Aprendizaje
API académica Node.js, Express y MongoDB para publicaciones, categorías y comentarios. Contrato conservado para [Front_BlogAprendizaje](https://github.com/Dabp7/Front_BlogAprendizaje). El contenido del seed es sintético.

## Inicio reproducible
Requisitos: Node.js22.15+ o24, npm y MongoDB8 en replica set. Docker Compose puede proveer la base.
```sh
git clone https://github.com/Dabp7/Back_BlogAprendizaje.git
cd Back_BlogAprendizaje
npm ci
docker compose up -d --wait
cp .env.example .env
npm run seed
npm start
```
En PowerShell usar Copy-Item .env.example .env. El servicio escucha solo http://127.0.0.1:3000.
MongoDB replica set es necesario para guardar comentario/asociación y retirar comentarios con el post en una transacción. No usar una instancia standalone.
También se puede usar una base local existente ajustando URI_MONGO; el seed solo acepta el nombre blog_demo.

Alternativa sin Docker: npm run demo levanta MongoDB real temporal, carga los datos ficticios e inicia la API. La primera ejecución descarga el binario oficial; los datos temporales se descartan al detener el proceso. Un binario ya instalado puede seleccionarse con MONGOMS_SYSTEM_BINARY. Este comando es una herramienta de desarrollo y necesita devDependencies.

## Conectar frontend
En Front_BlogAprendizaje configurar VITE_API_BASE_URL=http://127.0.0.1:3000/kinaloop/v1, instalar con npm ci e iniciar npm run dev. La API permite CORS para el recorrido local; no se requiere login para leer ni comentar.
La clave BLOG_ADMIN_KEY es solo del servidor: nunca ponerla en el frontend.
Seed idempotente:2categorías,3publicaciones y1comentario inicial. Post de referencia670000000000000000000001. Repetirlo no borra comentarios de lectores ni reactiva publicaciones desactivadas.

## Endpoints
Base /kinaloop/v1.
- GET /post/: lista publicaciones activas como {success,posts,total,limit,offset}, con category expandida en name/description.
- POST /comment/addComment: JSON {author,text,post}; devuelve201 {success,comment,message}.
- GET /comment/getCommentsByPost/:idPost: devuelve {success,comments,total,limit,offset}; ID desconocido o post inactivo404.
- POST /post/addPost, PUT /post/editPost/:idPost y DELETE /post/deletePost/:idPost: requieren X-Admin-Key. Crear/editar admite title3..60, text3..255, author2..80, date ISO8601, category y urlImage HTTPS opcional. La baja es lógica y retira los comentarios asociados.
- GET /health, GET /openapi.json y GET /api-docs: salud y contratos OpenAPI.

Los listados admiten limit1..100 y offset0..1000000 (también limite/desde), con orden por fecha y desempate por id. GET /post/ acepta category como ObjectId.
Comentarios: author recortado2..80 caracteres y text recortado3..1000. Las etiquetas HTML se guardan como texto; React las presenta escapadas.
Errores:400 validación/JSON,401 administración sin clave válida,404 recurso inexistente/inactivo,413 cuerpo grande,429 demasiados comentarios y500 genérico. Siempre incluyen message, sin stacks ni conexiones.

## Modelo
Category contiene name único y description.
Post contiene title, text, author, date, category, urlImage, status y referencias comments.
Comments contiene author, text, post y timestamps. Transacciones conservan la relación incluso ante altas simultáneas y bajas de posts.
El autor del comentario es autodeclarado; esta demo no ofrece cuentas ni moderación productiva.

## Verificar
```sh
npm run verify
```
La suite HTTP usa MongoDB real temporal con replica set. Verifica límites, trim, campos ignorados, post inexistente/inactivo, paginación estable, altas concurrentes, carrera alta/baja, administración y seed repetido. La primera ejecución requiere red para el binario oficial. GitHub Actions ejecuta instalación limpia, la misma suite y auditoría de dependencias de producción.
Evidencia en docs/evidence.md.

.env, dumps y colecciones históricas no se versionan. Si una credencial histórica fue real, retirarla del árbol no la revoca: su propietario debe rotarla. El ejemplo nuevo no contiene datos de personas reales.
