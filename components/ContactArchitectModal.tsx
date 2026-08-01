"use client";

export default function ContactArchitectModal() {
  return (
    <>
      <button onClick={() => { const el = document.getElementById('ca-modal-bm'); if (el) el.style.display = 'flex'; }} style={{position:'fixed',bottom:'1.5rem',right:'1.5rem',zIndex:9999,fontSize:'.65rem',textTransform:'uppercase',letterSpacing:'.08em',background:'#B8842A',color:'#fff',border:'none',padding:'.55rem 1.1rem',borderRadius:'2rem',cursor:'pointer',boxShadow:'0 2px 12px rgba(0,0,0,.35)'}}>Contact the Architect</button>
      <div id="ca-modal-bm" role="dialog" aria-modal="true" style={{display:'none',position:'fixed',inset:0,zIndex:10000,background:'rgba(0,0,0,.8)',alignItems:'center',justifyContent:'center'}} onClick={(e) => { if (e.target === e.currentTarget) { const el = document.getElementById('ca-modal-bm'); if (el) el.style.display = 'none'; } }}>
        <div style={{background:'#fff',maxWidth:420,width:'90%',padding:'2rem',borderRadius:4}}>
          <h2 style={{margin:'0 0 1rem',fontFamily:'sans-serif',fontSize:'1.25rem'}}>Contact the Architect</h2>
          <input id="ca-name-bm" placeholder="Name" style={{width:'100%',padding:'.6rem',marginBottom:'.75rem',border:'1px solid #ccc',boxSizing:'border-box',fontFamily:'sans-serif'}}/>
          <input id="ca-email-bm" type="email" placeholder="Email (required)" style={{width:'100%',padding:'.6rem',marginBottom:'.75rem',border:'1px solid #ccc',boxSizing:'border-box',fontFamily:'sans-serif'}}/>
          <textarea id="ca-msg-bm" rows={3} placeholder="Message" style={{width:'100%',padding:'.6rem',marginBottom:'.75rem',border:'1px solid #ccc',boxSizing:'border-box',fontFamily:'sans-serif',resize:'vertical'}}></textarea>
          <div style={{display:'flex',gap:'.75rem',justifyContent:'flex-end'}}>
            <button onClick={() => { const el = document.getElementById('ca-modal-bm'); if (el) el.style.display = 'none'; }} style={{background:'none',border:'1px solid #ccc',padding:'.5rem 1rem',cursor:'pointer',fontFamily:'sans-serif'}}>Cancel</button>
            <button onClick={() => { const em = (document.getElementById('ca-email-bm') as HTMLInputElement)?.value; if (!em) { alert('Email required'); return; } fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:(document.getElementById('ca-name-bm') as HTMLInputElement)?.value,email:em,message:(document.getElementById('ca-msg-bm') as HTMLTextAreaElement)?.value,source:'bm-intel'})}).then(()=>{const el=document.getElementById('ca-modal-bm');if(el)el.style.display='none';}).catch(()=>{}); }} style={{background:'#B8842A',color:'#fff',border:'none',padding:'.5rem 1rem',cursor:'pointer',fontFamily:'sans-serif'}}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
