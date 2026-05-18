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
        
        <div className="hero-actions">
          <Link href="/shop" className="hero-link primary">
            Belanja Sekarang
          </Link>
          <a href="/brochure.pdf" download className="hero-link secondary">
            Unduh Brosur
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
