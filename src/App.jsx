import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Shop from "./components/Shop.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx"; // <-- Tambahkan import ini

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} /> {/* <-- Tambahkan rute ini */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;