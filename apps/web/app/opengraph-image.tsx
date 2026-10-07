import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Argyros | Sculptural 925 Sterling Silver';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0d1e38 50%, #07101e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          border: '12px solid #C5A050',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '140px',
            height: '140px',
            borderRadius: '70px',
            border: '2px solid #C5A050',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            background: 'rgba(10, 22, 40, 0.8)',
          }}
        >
          <span
            style={{
              fontSize: '84px',
              color: '#C5A050',
              fontFamily: 'serif',
            }}
          >
            A
          </span>
        </div>

        <div
          style={{
            fontSize: '56px',
            color: '#FFFFFF',
            fontFamily: 'serif',
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}
        >
          Argyros.
        </div>

        <div
          style={{
            fontSize: '16px',
            color: '#C5A050',
            textTransform: 'uppercase',
            letterSpacing: '0.24em',
            fontWeight: 700,
          }}
        >
          Master Karigar Heritage · House of Siddhi Jewellers
        </div>

        <div
          style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.75)',
            marginTop: '20px',
          }}
        >
          Sculptural 925 Sterling Silver, Made to Order
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
