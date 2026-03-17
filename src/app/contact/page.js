function Contact() {
  return (
    <main>
      <section 
        id="page-header" 
        className="contact-header" 
        style={{ backgroundImage: "url('/img/backgroundpage.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Jarak dinaikkan menjadi 220px agar lebih bawah */}
        <div style={{ marginTop: '220px' }}>
          <h2>#SapaTallownara</h2>
          <p>Kami selalu senang mendengar cerita dan pertanyaan dari Anda.</p>
        </div>
      </section>

      <section id="contact-details" className="section-p1">
        <div className="details">
          <span>TETAP TERHUBUNG</span>
          <h2>Kunjungi lokasi kami atau hubungi kami hari ini</h2>
          <h3>Kantor Utama</h3>
          <div>
            <li>
              <i className="fal fa-map"></i>
              <p>Jl. Raya Bogor, Cibinong, Jawa Barat, Indonesia</p>
            </li>
            <li>
              <i className="far fa-envelope"></i>
              <p>hello@tallownara.com</p>
            </li>
            <li>
              <i className="fas fa-phone-alt"></i>
              <p>+62 821-1212-301</p>
            </li>
            <li>
              <i className="far fa-clock"></i>
              <p>Senin - Sabtu: 08.00 - 17.00 WIB</p>
            </li>
          </div>
        </div>

        <div className="map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126829.43126588283!2d106.75886361640625!3d-6.490001000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c32f81640a23%3A0xc3f606822502674e!2sCibinong%2C%20Bogor%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      <section id="form-details" className="section-p1">
        <form action="">
          <span>TINGGALKAN PESAN</span>
          <h2>Kami senang mendengar dari Anda</h2>
          <input type="text" placeholder="Nama Anda" />
          <input type="email" placeholder="E-mail" />
          <input type="text" placeholder="Subjek" />
          <textarea name="" id="" cols="30" rows="10" placeholder="Pesan Anda"></textarea>
          <button className="normal">Kirim Pesan</button>
        </form>

        <div className="people">
          <div>
            <i className="fas fa-headset" style={{ fontSize: '40px', color: '#2c3e2e', marginRight: '15px' }}></i>
            <p>
              <span>Customer Service</span>
              Butuh bantuan dengan pesanan Anda? <br /> Tim kami siap membantu.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;