function About() {
  // --- Gaya CSS Sesuai Referensi Gambar (image_f15b26.png) ---
  
  // Gaya Latar Belakang Seksi
  const sectionBgColor = "#faf9f6"; // Warna off-white yang lembut
  const darkGreenText = "#2c3e2e";

  // Base Style untuk Kartu (Sesuai image_f15b26.png)
  const cardStyle = {
    backgroundColor: '#ffffff', // Putih bersih
    borderRadius: '16px', // Sudut membulat yang halus
    padding: '30px 25px', // Ruang di dalam kartu
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)', // Bayangan sangat halus agar kartu sedikit mengambang
    border: '1px solid #f0f2f0', // Garis tepi sangat tipis
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  };

  // Gaya Grid untuk 4 Kartu Sejajar
  // Menggunakan grid layout. minmax(220px, 1fr) memastikan 4 kolom di layar lebar,
  // dan akan otomatis menjadi 2 baris (2x2) atau 1 baris jika layar mengecil.
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    maxWidth: '1100px', // Lebar maksimal container
    margin: '40px auto 0',
  };

  return (
    <main style={{ backgroundColor: '#fff' }}>
      {/* 1. HEADER */}
      <section 
        id="page-header" 
        className="about-header" 
        style={{ backgroundImage: "url('/img/backgroundpage.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div style={{ marginTop: '220px' }}>
          <h2>#CeritaTallownara</h2>
          <p>Kenali lebih dekat perjalanan kami menghadirkan perawatan kulit murni.</p>
        </div>
      </section>

      {/* 2. ORIGIN STORY */}
      <section id="about-head" className="section-p1">
        <img src="/img/about.jpg" alt="Tentang Tallownara" />
        <div>
          <h2>Origin Story: Kisah di Balik Tallownara</h2>
          <p>
            Di kota hujan Bogor, seorang ibu mencari jawaban untuk kulit bayi yang sensitif. 
            Setiap tetes hujan menjadi doa agar ditemukan perawatan yang aman dan menenangkan.
          </p>
          <p>
            Perjalanan itu menuntunnya ke Tuban, dan Kalimantan untuk bertemu petani, 
            peternak, serta peracik minyak aromatik yang setia menjaga alam.
          </p>
          <p>
            Tallownara bukan sekadar produk, ia adalah cerita tentang cinta seorang ibu 
            yang menjahit harapan melalui bahan-bahan terbaik Nusantara.
          </p>
          <marquee bgcolor="#eaeaea" loop="-1" scrollamount="5" width="100%">
            Perawatan kulit murni, dari alam untuk keindahan sejatimu.
          </marquee>
        </div>
      </section>

      {/* 3. TIMELINE PERJALANAN (Desain Kartu Baru) */}
      <section id="timeline" className="section-p1" style={{ textAlign: 'center', background: sectionBgColor, padding: '80px 20px' }}>
        <p style={{ color: '#8c9c8a', fontWeight: 'bold', letterSpacing: '2px', fontSize: '12px' }}>JEJAK KAMI</p>
        <h2 style={{ color: darkGreenText, marginTop: '10px' }}>Setiap Kota Menjadi Penanda</h2>
        <p style={{ color: '#666', maxWidth: '600px', margin: '10px auto' }}>Menjahit pengalaman alam menjadi perawatan hangat untuk keluarga lain.</p>
        
        <div style={gridStyle}>
          {/* Kartu 2015 */}
          <div style={cardStyle}>
            <span style={{ fontSize: '13px', color: '#8c9c8a', letterSpacing: '1px', marginBottom: '8px' }}>2015</span>
            <h3 style={{ color: darkGreenText, fontSize: '18px', marginBottom: '4px' }}>Kab. Bogor</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Jawa Barat</p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>Awal kegelisahan seorang ibu untuk menemukan perawatan paling lembut bagi kulit bayi.</p>
          </div>

          {/* Kartu 2016 */}
          <div style={cardStyle}>
            <span style={{ fontSize: '13px', color: '#8c9c8a', letterSpacing: '1px', marginBottom: '8px' }}>2016</span>
            <h3 style={{ color: darkGreenText, fontSize: '18px', marginBottom: '4px' }}>Tuban</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Jawa Timur</p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>Bertemu pengrajin tallow rumahan yang tekun memurnikan bahan kaya vitamin.</p>
          </div>

          {/* Kartu 2017 */}
          <div style={cardStyle}>
            <span style={{ fontSize: '13px', color: '#8c9c8a', letterSpacing: '1px', marginBottom: '8px' }}>2017</span>
            <h3 style={{ color: darkGreenText, fontSize: '18px', marginBottom: '4px' }}>Kalimantan</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Tengah & Barat</p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>Para penjaga hutan mengenalkan mentega tengkawang dan makna keberlanjutan.</p>
          </div>

          {/* Kartu 2018 */}
          <div style={cardStyle}>
            <span style={{ fontSize: '13px', color: '#8c9c8a', letterSpacing: '1px', marginBottom: '8px' }}>2018</span>
            <h3 style={{ color: darkGreenText, fontSize: '18px', marginBottom: '4px' }}>Bogor</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>Jawa Barat</p>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', margin: 0 }}>Penyuling lavender perempuan mengajarkan pendekatan aroma yang menenangkan kulit dan batin.</p>
          </div>
        </div>
      </section>

      {/* 4. EMPAT PILAR FILOSOFI (Desain Kartu Baru) */}
      <section id="philosophy" className="section-p1" style={{ textAlign: 'center', background: '#fff', padding: '80px 20px' }}>
        <p style={{ color: '#8c9c8a', fontWeight: 'bold', letterSpacing: '2px', fontSize: '12px' }}>PHILOSOPHY</p>
        <h2 style={{ color: darkGreenText, marginTop: '10px' }}>Mengapa Tallownara Hadir</h2>
        
        <div style={gridStyle}>
          {/* Pilar 1 */}
          <div style={cardStyle}>
            <div>
              <i className="fas fa-leaf" style={{ fontSize: '20px', color: darkGreenText, marginBottom: '15px' }}></i>
              <h4 style={{ color: darkGreenText, fontSize: '16px', marginBottom: '10px' }}>Alam sebagai sumber penyembuhan</h4>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '15px' }}>
                Formula Tallownara hanya menggunakan bahan alami yang menutrisi dan menyembuhkan.
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#8c9c8a', fontStyle: 'italic', lineHeight: '1.5', margin: 'auto 0 0 0' }}>
              Bahan diproses minimal.
            </p>
          </div>

          {/* Pilar 2 */}
          <div style={cardStyle}>
            <div>
              <i className="fas fa-globe-asia" style={{ fontSize: '20px', color: darkGreenText, marginBottom: '15px' }}></i>
              <h4 style={{ color: darkGreenText, fontSize: '16px', marginBottom: '10px' }}>Keberlanjutan & Ekosistem</h4>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '15px' }}>
                Kami menjaga harmoni dengan alam dengan memastikan setiap bahan membawa manfaat.
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#8c9c8a', fontStyle: 'italic', lineHeight: '1.5', margin: 'auto 0 0 0' }}>
              Menjaga rantai pasok adil.
            </p>
          </div>

          {/* Pilar 3 */}
          <div style={cardStyle}>
            <div>
              <i className="fas fa-tint" style={{ fontSize: '20px', color: darkGreenText, marginBottom: '15px' }}></i>
              <h4 style={{ color: darkGreenText, fontSize: '16px', marginBottom: '10px' }}>Kelembutan untuk Kulit Sensitif</h4>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '15px' }}>
                Formula Tallownara meresap seperti pelukan hangat agar kulit sensitif merasa aman.
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#8c9c8a', fontStyle: 'italic', lineHeight: '1.5', margin: 'auto 0 0 0' }}>
              Diuji pada kulit sensitif.
            </p>
          </div>

          {/* Pilar 4 */}
          <div style={cardStyle}>
            <div>
              <i className="fas fa-heart" style={{ fontSize: '20px', color: darkGreenText, marginBottom: '15px' }}></i>
              <h4 style={{ color: darkGreenText, fontSize: '16px', marginBottom: '10px' }}>Cinta & Tanggung Jawab Sosial</h4>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '15px' }}>
                Kecantikan lahir saat komunitas ikut tumbuh melalui dukungan dan upah adil.
              </p>
            </div>
            <p style={{ fontSize: '12px', color: '#8c9c8a', fontStyle: 'italic', lineHeight: '1.5', margin: 'auto 0 0 0' }}>
              Sebagian laba untuk literasi.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}

export default About;