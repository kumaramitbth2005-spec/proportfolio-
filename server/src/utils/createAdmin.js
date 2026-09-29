import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import {Admin} from '../models/index.js';
if(!process.env.ADMIN_EMAIL||!process.env.ADMIN_PASSWORD||!process.env.JWT_SECRET)throw new Error('Set ADMIN_EMAIL, ADMIN_PASSWORD and JWT_SECRET first.');
await connectDB();const passwordHash=await bcrypt.hash(process.env.ADMIN_PASSWORD,12);await Admin.findOneAndUpdate({email:process.env.ADMIN_EMAIL.toLowerCase()},{name:process.env.ADMIN_NAME||'Portfolio Admin',email:process.env.ADMIN_EMAIL.toLowerCase(),passwordHash},{upsert:true,new:true});console.log('Admin account created or updated.');await import('mongoose').then(m=>m.default.disconnect());
