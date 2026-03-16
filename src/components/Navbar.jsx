import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header id="header">
      <Link to="/" style={{ fontSize: '30px', fontWeight: 'bold', color: '#2c3e2e', textDecoration: 'none' }}>
        Tallow<span style={{ color: '#8c9c8a' }}>nara</span>
      </Link>

      <nav>
        <ul id="navbar" className={isMobileMenuOpen ? "active" : ""}>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link></li>
          <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
          <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
          <Link to="#" id="close" onClick={() => setIsMobileMenuOpen(false)}>
            <i className="far fa-times"></i>
          </Link>
        </ul>
      </nav>
      <div id="mobile" onClick={() => setIsMobileMenuOpen(true)}>
        <i id="bar" style={{ color: '#2c3e2e' }} className="fas fa-outdent"></i>
      </div>
    </header>
  );
}

export default Navbar;