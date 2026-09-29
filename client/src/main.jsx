import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles.css';

class AppErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error) { console.error('Portfolio failed to render:', error); }
  render() {
    if (this.state.error) return <main style={{minHeight:'100vh',display:'grid',placeContent:'center',padding:24,background:'#0b0c0d',color:'#f1f2ec',fontFamily:'system-ui',textAlign:'center'}}>
      <h1 style={{fontSize:28,marginBottom:8}}>The portfolio couldn’t load</h1>
      <p style={{maxWidth:560,color:'#b6b9b0',lineHeight:1.6}}>A page component hit an error. Refresh to try again, or check the browser console for details.</p>
      <pre style={{maxWidth:720,overflow:'auto',padding:16,border:'1px solid #343832',borderRadius:8,color:'#caff49',textAlign:'left',whiteSpace:'pre-wrap'}}>{String(this.state.error?.message||this.state.error)}</pre>
      <button onClick={()=>location.reload()} style={{justifySelf:'center',padding:'12px 20px',border:0,borderRadius:6,background:'#caff49',color:'#10120e',cursor:'pointer'}}>Refresh page</button>
    </main>;
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode></AppErrorBoundary>);
