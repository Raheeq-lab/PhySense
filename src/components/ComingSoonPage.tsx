import Link from 'next/link';

export default function ComingSoonPage({ title }: { title: string }) {
  return <main style={{minHeight:'100dvh',display:'grid',placeItems:'center',padding:'24px',background:'#f4f2ec',color:'#14161a',fontFamily:'var(--font-nunito-sans), sans-serif'}}>
    <section style={{width:'min(100%,560px)',padding:'32px',border:'1px solid #e3dfd2',borderRadius:'12px',background:'#fbfaf6',textAlign:'center'}}>
      <p style={{margin:'0 0 8px',color:'#3a5bdb',fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase'}}>PhySense</p>
      <h1 style={{margin:'0 0 12px',fontFamily:'var(--font-newsreader), serif',fontSize:'clamp(36px,8vw,56px)',fontWeight:500}}>{title}</h1>
      <p style={{margin:'0 0 24px',color:'#6a6d75',fontSize:'18px'}}>Coming soon</p>
      <Link href="/" style={{display:'inline-block',padding:'12px 16px',borderRadius:'8px',background:'#3a5bdb',color:'#fff',fontWeight:700,textDecoration:'none',cursor:'pointer'}}>← Back to Home</Link>
    </section>
  </main>;
}
