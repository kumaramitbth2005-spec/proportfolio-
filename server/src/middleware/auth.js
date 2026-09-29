import jwt from 'jsonwebtoken';
export function requireAuth(req,res,next){const token=req.cookies?.adminToken;if(!token)return res.status(401).json({success:false,message:'Authentication required.'});try{req.admin=jwt.verify(token,process.env.JWT_SECRET);next()}catch{return res.status(401).json({success:false,message:'Session expired. Please sign in again.'})}}
