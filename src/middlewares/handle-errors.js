import {errorResponse} from '../helpers/http.js';
export const handleErrors=(error,_req,res,_next)=>errorResponse(res,error);
