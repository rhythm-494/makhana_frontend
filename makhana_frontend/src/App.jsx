
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import ProductList from './Components/ProductList';
import './App.css';
import About from './Components/About';
import Contact from './Components/Contact';
import Navbar from './Components/Navbar';
import { CartProvider } from './context/CartContext';
import CartSidebar from './Components/Cart';
import ProfileSection from './Components/ProfileSection';

function App() {
  return (
<CartProvider>
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path = "/contact" element = {<Contact />} />
          <Route path = "/about" element = {<About />} />
          <Route path = "/cart" element = {<CartSidebar />} />
          <Route path = "/profile" element = {<ProfileSection />} />
        </Routes>
      </div>
    </Router>
</CartProvider>
  );
}

export default App;
