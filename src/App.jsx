import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'; // <--- IMPORTANTE: Importar Outlet
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Admin from './pages/Admin';
import Stock from './pages/Stock';
import CarDetail from './pages/CarDetail';
import ScrollToTop from './components/ScrollToTop';
import DigitalCard from './pages/DigitalCard';

// 1. Criamos um "Layout" que contém a Navbar e o Footer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* É aqui que as páginas vão ser "injetadas" */}
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="bg-brand-dark min-h-screen font-sans text-white overflow-x-hidden">
        <ScrollToTop />
        
        <Routes>
          {/* 2. A Rota do Cartão (Fora do Layout -> SEM Navbar e SEM Footer) */}
          <Route path="/cartao" element={<DigitalCard />} />

          {/* 3. Todas as outras páginas (Dentro do Layout -> COM Navbar e COM Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/carro/:id" element={<CarDetail />} />
          </Route>
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;