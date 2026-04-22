import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        }}
      >
        {/* GDG dots */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#4285F4' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EA4335' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#FBBC04' }} />
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#34A853' }} />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          DevMap Ecuador
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 30,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 24,
            fontWeight: 400,
          }}
        >
          El directorio del talento tech ecuatoriano
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
