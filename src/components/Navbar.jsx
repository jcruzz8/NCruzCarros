import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Função para fechar o menu mobile ao clicar num link
  const closeMenu = () => setIsOpen(false);

  // Função para ir para o topo suavemente ao clicar no logótipo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu(); // Garante que o menu mobile fecha se estiver aberto
  };

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo (Agora com a função scrollToTop) */}
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2">
            <img src="/logoZoom.png" alt="ncruz logo" className="h-12 w-auto object-contain" />
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/stock" className="text-gray-300 hover:text-brand-red transition-colors font-medium">
                Stock Local
              </Link>

              <Link to="/sobre" className="text-gray-300 hover:text-brand-red transition-colors font-medium">
                Sobre Nós
              </Link>
              
              <a href="tel:+351928346476" className="bg-brand-red hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold transition-all flex items-center gap-2">
                <Phone size={18} />
                Contactar
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-white/10">
          <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col">
            <Link to="/stock" onClick={closeMenu} className="block text-gray-300 hover:text-brand-red transition-colors font-medium text-lg">
              Stock Local
            </Link>

            <Link to="/sobre" onClick={closeMenu} className="block text-gray-300 hover:text-brand-red transition-colors font-medium text-lg">
              Sobre Nós
            </Link>

            {/* Usar tag <a> no mobile também */}
            <a href="/#contactos" onClick={closeMenu} className="inline-flex bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all items-center gap-2 w-fit mt-2">
              <Phone size={18} />
              Contactar
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;