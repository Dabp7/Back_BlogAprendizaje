import {timingSafeEqual} from 'node:crypto';
export function requireAdmin(req,res,next) {
    const expected = process.env.BLOG_ADMIN_KEY;
    const actual = req.headers['x-admin-key'];
    if (!expected || expected.length < 32) return res.status(503).json({success:false,message:'Administración no configurada'});
    if (typeof actual !== 'string' || Buffer.byteLength(actual) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(actual),Buffer.from(expected))) return res.status(401).json({success:false,message:'Clave administrativa inválida'});
    next();
}
