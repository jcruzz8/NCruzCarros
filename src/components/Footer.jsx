import React from 'react';
import { Instagram, Youtube } from 'lucide-react'; // Retirei os ícones não usados para limpar o código
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-75 shadow-[0_0_15px_rgba(220,38,38,0.6)]"></div>

      {/* Um brilho extra por cima da linha para dar efeito 3D */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-brand-red blur-[2px] opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mudei para grid-cols-4 para dar mais espaço à marca e alinhar perfeitamente */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand - Agora ocupa 2 colunas no desktop */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logoZoom.png" alt="ncruz logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Transparência e qualidade em cada quilómetro.
            </p>
          </div>

          {/* Links Rápidos */}
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-6">Navegação</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/stock" className="hover:text-brand-red transition-colors">Stock Local</Link></li>
              <li><Link to="/sobre" className="hover:text-brand-red transition-colors">Quem Somos</Link></li>
              <li><a href="/#contactos" className="hover:text-brand-red transition-colors">Contactos</a></li>
              <li><Link to="/cartao" className="hover:text-brand-red transition-colors">Cartão Digital</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-6">Redes Sociais</h4>
            <div className="flex gap-4">
              {/* Trocado <Link> por <a> com target="_blank" */}
              <a
                href="https://www.instagram.com/ncruz_carros/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://m.olx.pt/ads/user/9PtD/?my_ads=0"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all border border-transparent hover:border-white/20"
                title="Ver no OLX"
              >
                <span className="font-extrabold text-[10px] tracking-widest">OLX</span>
              </a>
              <a
                href="https://www.youtube.com/@ncruzcarros"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-brand-red hover:text-white transition-all"
                title="Seguir no YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} NCRUZ Carros. Todos os direitos reservados.</p>
          <p>Empresa 100% Portuguesa</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;