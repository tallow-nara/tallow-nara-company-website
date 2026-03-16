function RitualGuide() {
  return (
    <section id="ritual-guide" className="section-p1">
      <div className="ritual-img-container">
        <img src="/img/products/product1.jpg" alt="Ritual Skincare" />
        <div className="glass-card">
          <i className="fas fa-sparkles"></i>
          <h5>Penggunaan Multifungsi</h5>
          <p>Satu balm untuk bibir, tangan, wajah, dan persiapan kulit sebelum ibadah.</p>
        </div>
      </div>

      <div className="ritual-text">
        <h2>Panduan Ritualmu</h2>
        <p>
          Menciptakan momen kedamaian. Tallownara bukan sekadar skincare; ini adalah 
          persiapan untuk jiwa. Ikuti panduan kami untuk mengintegrasikan perlindungan murni 
          ke dalam rutinitas harianmu.
        </p>

        <div className="ritual-list">
          <div className="ritual-item">
            <div className="step-number">1</div>
            <div className="item-text">
              <h5>Hidrasi Sebelum Ibadah</h5>
              <p>Oleskan lapisan tipis pada wajah dan tangan untuk perlindungan yang murni dan tetap bernapas.</p>
            </div>
          </div>

          <div className="ritual-item">
            <div className="step-number">2</div>
            <div className="item-text">
              <h5>Pemulihan Saat Bepergian</h5>
              <p>Tenangkan kulit kering akibat perjalanan dan perubahan iklim secara instan.</p>
            </div>
          </div>

          <div className="ritual-item">
            <div className="step-number">3</div>
            <div className="item-text">
              <h5>Pembaruan Malam Hari</h5>
              <p>Biarkan nutrisi mendalam dari tallow memulihkan kulitmu saat kamu beristirahat.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RitualGuide;