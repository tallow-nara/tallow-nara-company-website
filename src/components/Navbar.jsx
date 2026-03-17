"use client"; 
import { useState } from 'react';
import Link from 'next/link';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header id="header">
      {/* Mengganti Image menjadi Text Logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <h1 style={{ 
          fontSize: '30px', 
          fontWeight: 'bold', 
          color: '#2c3e2e', 
          margin: 0,
          display: 'flex',
          alignItems: 'center'
        }}>
          Tallow<span style={{ color: '#8c9c8a' }}>nara</span>
        </h1>
      </Link>

      <nav>
        <ul id="navbar" className={isMobileMenuOpen ? "active" : ""}>
          <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li><Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link></li>
          <li><Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link></li>
          <li><Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
          <li id="close-li">
            <Link href="#" id="close" onClick={() => setIsMobileMenuOpen(false)}>
              <i className="far fa-times"></i>
            </Link>
          </li>
        </ul>
      </nav>

      <div id="mobile" onClick={() => setIsMobileMenuOpen(true)}>
        <i id="bar" style={{ color: '#2c3e2e', fontSize: '24px' }} className="fas fa-outdent"></i>
      </div>
    </header>
  );
}

export default Navbar;