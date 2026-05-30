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
          bpom="NA18250118219"
          safeForAll={true}
        />
        
        <ProductCard
          image="/img/products/product2.jpg"
          category="Tallow Balm"
          title="Tallow Balm Multifungsi Pelembab Alami Grass Fed"
          safeForAll={true}
        />

        <ProductCard
          image="/img/products/product3.jpg"
          category="Soap"
          title="Nourishing Tallow Liquid Soap, Sabun Tallow Kastil Alami"
          bpom="NA18250702788"
          safeForAll={true}
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
