import {Component,lazy,Suspense,useEffect,useState} from 'react';
import {ArrowDown,ArrowUpRight,Github,Linkedin,Mail} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import {About,Certificates,Contact,Education,Projects,Resume,Skills,Socials,WhatsAppContact} from '../components/Sections.jsx';
import ChatWidget from '../components/ChatWidget.jsx';
import {getContent} from '../services/api.js';

const Hero3D=lazy(()=>import('../components/Hero3D.jsx'));
const LeetCodeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.816 3.655 5.99 5.99 0 0 0 2.936-.343 5.955 5.955 0 0 0 1.954-1.248l4.475-4.484a1.371 1.371 0 0 0 .041-1.938 1.376 1.376 0 0 0-1.942-.04l-4.47 4.482a3.212 3.212 0 0 1-1.055.673 3.253 3.253 0 0 1-1.595.186 3.219 3.219 0 0 1-2.614-1.983 3.167 3.167 0 0 1-.189-.553 3.22 3.22 0 0 1-.034-1.282 3.15 3.15 0 0 1 .658-1.144L8.746 8.52l4.737-5.076a1.374 1.374 0 0 0-1-2.444zM16.48 7.35a1.37 1.37 0 0 0-1.37 1.372v6.556a1.37 1.37 0 0 0 2.74 0V8.722a1.37 1.37 0 0 0-1.37-1.372zm3.85 3.51a1.37 1.37 0 0 0-1.37 1.372v3.044a1.37 1.37 0 0 0 2.74 0v-3.044a1.37 1.37 0 0 0-1.37-1.372z"/>
  </svg>
);

const getSocialIcon = (platform) => {
  const p = (platform || '').toLowerCase();
  if (p.includes('github')) return Github;
  if (p.includes('linkedin')) return Linkedin;
  if (p.includes('leetcode')) return LeetCodeIcon;
  if (p.includes('mail') || p.includes('email')) return Mail;
  return ArrowUpRight;
};

const defaultHeroSocials = [
  { platform: 'GitHub', url: 'https://github.com/kumaramitbth2005-spec' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/amit-kumar-814263335' },
  { platform: 'LeetCode', url: 'https://leetcode.com/u/AmitKumar_83/' },
  { platform: 'Instagram', url: 'https://instagram.com/' },
  { platform: 'Twitter', url: 'https://x.com/' },
  { platform: 'Facebook', url: 'https://facebook.com/' },
  { platform: 'Email', url: 'mailto:amitkumar.dev.cs@gmail.com' }
];

const list=value=>Array.isArray(value)?value:Array.isArray(value?.items)?value.items:[];
class SceneBoundary extends Component{
 constructor(props){super(props);this.state={failed:false}}
 static getDerivedStateFromError(){return{failed:true}}
 render(){return this.state.failed?<div className="scene-wrap scene-fallback" aria-label="Decorative 3D illustration"/>:this.props.children}
}

export default function Home(){
 const [content,setContent]=useState({}),[failed,setFailed]=useState(false),[chatOpen,setChatOpen]=useState(false);
 useEffect(()=>{getContent().then(data=>{setContent(data);setFailed(!data.profile&&!data.projects)}).catch(()=>setFailed(true))},[]);
 const profile=content.profile?.profile||content.profile||{};
 const projects=list(content.projects?.projects||content.projects),education=list(content.education?.education||content.education);
 const skills=list(content.skills?.skills||content.skills),certificates=list(content.certificates?.certificates||content.certificates);
 const rawSocials=list(content.socials?.socials||content.socials);
 const socials=rawSocials.filter(s=>s.url).length ? rawSocials.filter(s=>s.url) : defaultHeroSocials;
 const resume=content.resume?.resume||content.resume||{};
 const displayName=(profile.name||'Amit Kumar').replace(/\s+Sharma\b/i,'').replace(/[.\s]+$/,'');
 const formattedName = displayName.replace(/\s+/g, '\u00A0\u00A0');
 return <>
  <Navbar/>
  <main>
   <section className="hero" id="home">
    <div className="hero-copy">
     <div className="availability"><span className="pulse-dot"/>{profile.availabilityStatus||'AVAILABLE FOR OPPORTUNITIES'}</div>
     <div className="hero-eyebrow">COMPUTER SCIENCE · SOFTWARE DEVELOPMENT</div>
     <h1>Hi, I’m<br/><span>{formattedName}</span></h1>
     <p className="hero-role">{profile.role||<>Computer Science Engineering Student<br/>&amp; Software Developer</>}</p>
     <p className="hero-description">{profile.tagline||'I build modern web applications, AI-powered solutions and scalable software projects using clean code and practical engineering.'}</p>
     <div className="hero-actions"><a className="button button-primary" href="#projects">View my projects <ArrowUpRight size={16}/></a><a className="button button-secondary" href={resume.resumeUrl||'#resume'} target={resume.resumeUrl?'_blank':undefined} rel="noreferrer">Download resume <ArrowDown size={15}/></a></div>
     <div className="hero-socials">{socials.filter(s=>s.url).map(s=>{const Icon=getSocialIcon(s.platform);return <a key={s._id||s.platform} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform} title={s.platform}><Icon size={17}/></a>})}<span className="social-divider"/><span>BASED IN {profile.location||'BIHAR, INDIA'}</span></div>
     {Array.isArray(profile.stats)&&profile.stats.length>0&&<div className="hero-stats">{profile.stats.slice(0,3).map((stat,i)=><div key={stat.label||i}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div>}
    </div>
    <SceneBoundary><Suspense fallback={<div className="scene-wrap scene-fallback" aria-hidden="true"/>}><Hero3D/></Suspense></SceneBoundary>
    <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14}/></a><div className="hero-index">01 — 08</div>
   </section>
   <About profile={profile}/><Education items={education}/><Skills items={skills}/><Projects items={projects}/><Resume resume={resume}/><Socials items={socials}/><Certificates items={certificates}/><Contact profile={profile} onChat={()=>setChatOpen(true)}/><WhatsAppContact profile={profile}/>
  </main>
  <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">A</span><span>Amit Kumar</span></a><p>Building software, learning continuously,<br/>and solving real-world problems.</p><span className="copyright">© {new Date().getFullYear()} AMIT KUMAR</span></footer>
  <ChatWidget open={chatOpen} setOpen={setChatOpen}/>
 </>;
}
