import ProductCard from "./ProductCard.jsx";

function ProductSection() {
  const marqueeCSS = `
    .marquee-container {
      display: flex;
      overflow: hidden;
      background-color: #f5f5f5;
      padding: 20px 0;
      margin-top: 60px;
      border-radius: 10px;
      user-select: none;
    }
    .marquee-content {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      min-width: 100%;
      animation: scroll 20s linear infinite;
    }
    .marquee-item {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e2e;
      margin: 0 25px;
    }
    @keyframes scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
  `;

  return (
    <section id="product1" className="section-p1">
      <style>{marqueeCSS}</style>

      <h2>Produk Unggulan Kami</h2>
      <p>Koleksi Skincare Alami Tallownara</p>
      
      <div className="pro-container">
        <ProductCard
          image="/img/products/product1.jpg"
          category="Tallow Balm"
          title="NEW FORMULA Luxury Grassfed Beef Tallow Balm with Calendula Herbs"
          price="Rp 50.700"
          bpom="NA18250118219"
          safeForAll={true}
          shopeeLink="https://shopee.co.id/NEW-FORMULA-Luxury-Grassfed-Beef-Tallow-Balm-with-Calendula-Herbs-i.40064382.20985911016"
        />
        
        <ProductCard
          image="/img/products/product2.jpg"
          category="Tallow Balm"
          title="Tallow Balm Multifungsi Pelembab Alami Grass Fed"
          price="Rp 33.900"
          safeForAll={true}
          shopeeLink="https://shopee.co.id/Tallow-Balm-Multifungsi-Pelembab-Alami-Grass-Fed-i.40064382.18585542253"
        />

        <ProductCard
          image="/img/products/product3.jpg"
          category="Soap"
          title="Nourishing Tallow Liquid Soap, Sabun Tallow Kastil Alami"
          price="Rp 40.000"
          bpom="NA18250702788"
          safeForAll={true}
          shopeeLink="https://shopee.co.id/Nourishing-Tallow-Liquid-Soap-Sabun-Tallow-Kastil-Alami-i.40064382.56603458067"
        />
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          <span className="marquee-item">TANPA PETROLATUM   </span>
          <span className="marquee-item">TANPA SULFATE   </span>
          <span className="marquee-item">TANPA PARABEN & BHT  </span>
          <span className="marquee-item">TANPA PEWANGI SINTETIS   </span>
          <span className="marquee-item">TANPA PERASA SINTETIS  </span>
          <span className="marquee-item">BEBAS MINYAK KELAPA SAWIT  </span>
        </div>
        <div className="marquee-content" aria-hidden="true">
          <span className="marquee-item">TANPA PETROLATUM   </span>
          <span className="marquee-item">TANPA SULFATE  </span>
          <span className="marquee-item">TANPA PARABEN & BHT  </span>
          <span className="marquee-item">TANPA PEWANGI SINTETIS   </span>
          <span className="marquee-item">TANPA PERASA SINTETIS  </span>
          <span className="marquee-item">BEBAS MINYAK KELAPA SAWIT  </span>
        </div>
      </div>

    </section>
  );
}

export default ProductSection;