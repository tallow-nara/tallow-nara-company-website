import ProductCard from "./ProductCard.jsx";

function Shop() {
  return (
    <main>
      <section 
        id="page-header" 
        style={{ backgroundImage: "url('/img/backgroundpage.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Jarak dinaikkan menjadi 220px agar lebih bawah */}
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
            bpom="NA18250118219" 
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
      </section>
    </main>
  );
}

export default Shop;