import ProductCard from "../../components/ProductCard";

function Shop() {
  return (
    <main>
      <section 
        id="page-header" 
        style={{ backgroundImage: "url('/img/backgroundpage.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div style={{ marginTop: '220px' }}>
          <h2>#KoleksiLengkap</h2>
          <p>Belanja semua produk alami Tallownara di sini</p>
        </div>
      </section>

      <section id="product1" className="section-p1">
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
      </section>
    </main>
  );
}

export default Shop;
