import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Instagram, Globe, MapPin, UserPlus, Check, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DigitalCard = () => {
  // Estado para controlar se o link foi copiado
  const [copied, setCopied] = useState(false);

  // Função super simples para copiar o link
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://ncruzcarros.pt/cartao');
      setCopied(true);
      
      // Volta ao normal passado 3 segundos
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('Erro ao copiar o link:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      
      {/* Efeito de brilho de fundo */}
      <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-brand-red/20 to-transparent pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm z-10 flex flex-col items-center"
      >
        {/* Foto / Logótipo */}
        <div className="w-32 h-32 bg-white/5 backdrop-blur-md rounded-full border-2 border-brand-red p-4 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
          <img src="/ncruz-semfundo.png" alt="NCRUZ Carros" className="w-full h-auto object-contain" />
        </div>

        {/* Nome e Título */}
        <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">NCruz Carros</h1>
        <p className="text-gray-400 font-medium mb-8 text-center">Encontra o carro certo para ti.</p>

        {/* BOTÃO PRINCIPAL EM DESTAQUE - Guardar Contacto */}
        <a href="/ncruz.vcf" download className="flex items-center justify-center gap-2 w-full bg-brand-red hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] mb-8 transform hover:scale-105 active:scale-95">
          <UserPlus size={20} />
          Guardar nos Contactos
        </a>

        {/* Botões de Contacto Secundários */}
        <div className="w-full space-y-4">

          {/* Ver Site */}
          <Link to="/" className="flex items-center gap-4 bg-white/10 hover:bg-brand-red text-white p-4 rounded-xl transition-all border border-white/5 hover:border-brand-red group">
            <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors flex items-center justify-center w-12 h-12">
              <Globe size={24} className="text-brand-red group-hover:text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">O Nosso Site</h3>
              <p className="text-xs text-gray-400 group-hover:text-red-200">www.ncruzcarros.pt</p>
            </div>
          </Link>

          {/* OLX */}
          <a href="https://m.olx.pt/ads/user/9PtD/?my_ads=0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/10 hover:bg-brand-red text-white p-4 rounded-xl transition-all border border-white/5 hover:border-brand-red group">
            <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors flex items-center justify-center w-12 h-12">
              <span className="font-extrabold text-[14px] tracking-widest text-brand-red group-hover:text-white">OLX</span>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">OLX</h3>
              <p className="text-xs text-gray-400 group-hover:text-red-200">Ver anúncios ativos</p>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com/ncruz_carros" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/10 hover:bg-brand-red text-white p-4 rounded-xl transition-all border border-white/5 hover:border-brand-red group">
            <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors flex items-center justify-center w-12 h-12">
              <Instagram size={24} className="text-brand-red group-hover:text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">Instagram</h3>
              <p className="text-xs text-gray-400 group-hover:text-red-200">Acompanha as novidades</p>
            </div>
          </a>

          {/* Localização */}
          <a href="https://www.google.com/maps/place/R.+de+Angola,+Olival+Basto/@38.7942945,-9.1643218,879m/data=!3m1!1e3!4m6!3m5!1s0xd19329f9844073b:0x698f93abcfae02f8!8m2!3d38.7940018!4d-9.1647081!16s%2Fg%2F1tffqm0t?hl=pt-PT&entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/10 hover:bg-brand-red text-white p-4 rounded-xl transition-all border border-white/5 hover:border-brand-red group">
            <div className="bg-white/10 p-3 rounded-lg group-hover:bg-white/20 transition-colors flex items-center justify-center w-12 h-12">
              <MapPin size={24} className="text-brand-red group-hover:text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-lg">Localização</h3>
              <p className="text-xs text-gray-400 group-hover:text-red-200">Ver no Google Maps</p>
            </div>
          </a>

          {/* Botão de Partilhar (Copia o Link e fica Verde) */}
          <button 
            onClick={copyLink}
            className={`mt-4 flex items-center justify-center gap-2 w-full border font-medium py-4 rounded-xl transition-all duration-300 ${
              copied 
                ? 'bg-green-500/20 border-green-500 text-green-400' 
                : 'bg-transparent border-white/20 hover:bg-white/10 text-gray-300'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} />
                Link Copiado com Sucesso!
              </>
            ) : (
              <>
                <Share2 size={20} />
                Partilhar este Cartão
              </>
            )}
          </button>

        </div>
      </motion.div>
    </div>
  );
};

export default DigitalCard;