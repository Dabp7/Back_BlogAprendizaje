export function fail(status, message) { throw Object.assign(new Error(message), {status}); }
export function errorResponse(res, error) {
    const status = error.status ?? (error.code === 11000 ? 409 : ['CastError', 'ValidationError'].includes(error.name) ? 400 : 500);
    return res.status(status).json({success: false, message: status === 500 ? 'Error interno del servidor' : error.code === 11000 ? 'El recurso ya existe' : error.message});
}
export function pagination(query) {
    function number(value, fallback, min, max) {
        if (value === undefined) return fallback;
        if (typeof value !== 'string' || !/^\d+$/.test(value)) fail(400, 'Paginación inválida');
        const parsed = Number(value);
        if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) fail(400, 'Paginación fuera de rango');
        return parsed;
    }
    return {limit: number(query.limit ?? query.limite, 100, 1, 100), offset: number(query.offset ?? query.desde, 0, 0, 1000000)};
}
