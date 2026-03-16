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
      <h2>Perawatan Kulit Alami</h2>
      <h1>Kulit Sehat Berseri Bersama Tallownara</h1>
      <p>Temukan rangkaian produk skincare terbaik kami</p>
      <button>Belanja Sekarang</button>
    </section>
  );
}

export default Hero;