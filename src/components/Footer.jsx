function Footer() {
  return (
    <footer className="section-p1">
      <div className="col">
        <a href="#" style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
          Tallow<span style={{ color: '#8c9c8a' }}>nara</span>
        </a>
        <h4>Kontak</h4>
        <p><strong>Alamat:</strong> Jl. Raya Bogor, Cibinong, Jawa Barat</p>
        <p><strong>Telepon:</strong> +62 812 3456 7890</p>
        <p><strong>Jam Operasional:</strong> 09:00 - 17:00, Sen - Sab</p>
        <div className="follow">
          <h4>Ikuti Kami</h4>
          <div className="icon">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>

      <div className="col">
        <h4>Tentang</h4>
        <a href="#">Tentang Kami</a>
        <a href="#">Kebijakan Privasi</a>
        <a href="#">Syarat & Ketentuan</a>
        <a href="#">Hubungi Kami</a>
      </div>

      <div className="copyright">
        <p>Dikembangkan oleh Tallownara © 2026 - Tallownara Skincare</p>
      </div>
    </footer>
  );
}

export default Footer;