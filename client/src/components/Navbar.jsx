import { useEffect, useState } from 'react';
import { Menu, Moon, Sun, X } from 'lucide-react';
const links=[['Home','home'],['About','about'],['Education','education'],['Skills','skills'],['Projects','projects'],['Resume','resume'],['Socials','social'],['Certificates','certificate'],['Contact','hire']];
const readTheme=()=>{try{return localStorage.getItem('theme')!=='light'}catch{return true}};
const saveTheme=value=>{try{localStorage.setItem('theme',value?'dark':'light')}catch{/* Theme remains usable for this visit if storage is blocked. */}};
export default function Navbar(){
 const [open,setOpen]=useState(false),[active,setActive]=useState('home'),[scrolled,setScrolled]=useState(false),[dark,setDark]=useState(readTheme);
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';saveTheme(dark)},[dark]);
 useEffect(()=>{const onScroll=()=>{setScrolled(window.scrollY>16);let current='home';for(const [,id] of links){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<180)current=id;}setActive(current)};window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll)},[]);
 return <header className={`nav ${scrolled?'nav-scrolled':''}`}>
  <a className="brand nav-brand" href="#home" aria-label="Amit Kumar home"><span className="brand-mark">A</span><span>Amit Kumar</span></a>
  <nav className={`nav-links ${open?'show':''}`} aria-label="Main navigation">{links.map(([label,id])=><a key={id} className={active===id?'active':''} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}</nav>
  <div className="nav-actions"><button className="icon-button theme-toggle" aria-label={`Switch to ${dark?'light':'dark'} theme`} onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button><a className="nav-cta" href="#hire">Hire Me</a><button className="menu-button" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
 </header>
}
