function ProductCard({ image, category, title, bpom, safeForAll }) {
  return (
    <div className="pro">
      <img src={image} alt={title} />
      <div className="des">
        <span>{category}</span>
        <h5>{title}</h5>
        
        {bpom && <p style={{ fontSize: '11px', color: '#8c9c8a', margin: '5px 0' }}>BPOM: {bpom}</p>}
        {safeForAll && (
          <p style={{ fontSize: '11px', color: '#2c3e2e', fontWeight: 'bold', margin: '0 0 5px 0' }}>
            <i className="fas fa-check-circle" style={{ color: '#8c9c8a', marginRight: '4px' }}></i>
            Aman untuk Bumil, Busui & Bayi
          </p>
        )}

        <div className="star">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
