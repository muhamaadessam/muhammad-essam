import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Muhammad Essam Portfolio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const LogoPatternBackground = ({ logoSrc }: { logoSrc: string }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexWrap: 'wrap', opacity: 0.1, justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
    {Array.from({ length: 45 }).map((_, i) => (
      <div key={i} style={{ width: '130px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logoSrc} width={70} height={70} style={{ objectFit: 'contain' }} />
      </div>
    ))}
  </div>
);

export default async function Image() {
  const profilePicBuffer = await fetch(
    new URL('../../public/profile_picture.jpg', import.meta.url)
  ).then((res) => res.arrayBuffer());

  const logoBuffer = await fetch(
    new URL('../../public/logos/essamLogo.png', import.meta.url)
  ).then((res) => res.arrayBuffer());

  // Edge-compatible Buffer import
  const { Buffer } = require('node:buffer');

  const logoBase64 = Buffer.from(logoBuffer).toString('base64');
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const base64Image = Buffer.from(profilePicBuffer).toString('base64');
  const imgSrc = `data:image/jpeg;base64,${base64Image}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e2126 0%, #282C33 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <LogoPatternBackground logoSrc={logoSrc} />

        {/* Glow Effects using Primary Color #42A5F5 */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: '#42A5F5', opacity: 0.15, borderRadius: '250px', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '500px', height: '500px', background: '#42A5F5', opacity: 0.1, borderRadius: '250px', filter: 'blur(80px)' }} />

        {/* Profile Picture */}
        <div style={{ display: 'flex', width: '280px', height: '280px', borderRadius: '140px', overflow: 'hidden', border: '6px solid #42A5F5', boxShadow: '0 0 40px rgba(66, 165, 245, 0.4)', marginBottom: '30px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imgSrc} 
            width={280} 
            height={280} 
            style={{ objectFit: 'cover' }} 
          />
        </div>

        {/* Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '72px', fontWeight: '900', marginBottom: '15px', color: 'white', letterSpacing: '-1px' }}>
            Muhammad Essam
          </div>
          
          <div style={{ fontSize: '36px', color: '#42A5F5', fontWeight: '600', letterSpacing: '1px' }}>
            Flutter Developer & Software Engineer
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
