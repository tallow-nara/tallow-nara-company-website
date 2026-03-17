import Link from 'next/link';

function Hero() {
  return (
    <section 
      id="hero" 
      style={{ 
        backgroundImage: "url('/img/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div style={{ paddingLeft: '20px' }}>
        <h2>Perawatan Kulit Alami</h2>
        <h1 style={{ color: '#ffffff' }}>Kulit Sehat Berseri Bersama Tallownara</h1>
        <p style={{ color: '#ffffff' }}>Temukan rangkaian produk skincare terbaik kami</p>
        
        <Link href="/shop">
          <button className="normal">Belanja Sekarang</button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;