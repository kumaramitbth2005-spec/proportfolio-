import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
const Home=lazy(()=>import('./pages/Home.jsx'));
const Admin=lazy(()=>import('./pages/Admin/Admin.jsx'));
const ProjectPage=lazy(()=>import('./pages/ProjectPage.jsx'));
export default function App(){return <Suspense fallback={<div className="page-loader">Loading portfolio<span>.</span></div>}><Routes><Route path="/" element={<Home/>}/><Route path="/admin" element={<Admin/>}/><Route path="/projects/:slug" element={<ProjectPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense>}
