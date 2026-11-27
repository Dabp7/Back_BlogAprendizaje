# Contrato de comentarios
Las rutas públicas permanecen /kinaloop/v1/post/ y /kinaloop/v1/comment.
Comentario: author string recortado2..80, text string recortado3..1000, post ObjectId de publicación activa.
Solo se guardan esos campos; el cliente no impone id, fecha, estado ni asociaciones adicionales.
Entrada inválida400 con message; ID válido inexistente o publicación desactivada404.
Alta201 con comment. GET200 con comments, total, limit y offset; orden createdAt descendente con desempate por _id.
limit1..100, offset0..1000000; también se admiten limite/desde.
Guardar comentario y asociarlo al post es una transacción. La baja administrativa y el alta compiten por la misma fila de post; no se crean comentarios huérfanos.
Desactivar un post retira sus comentarios y limpia su asociación en la misma transacción.
Las mutaciones de posts requieren X-Admin-Key contra BLOG_ADMIN_KEY configurada en el servidor. La clave nunca va en variables VITE.
Los comentarios son participaciones públicas con autor autodeclarado, no identidades autenticadas.
Demo local loopback, límite30comentarios/minuto/IP y cuerpo32KiB. No es una plataforma de moderación productiva.
