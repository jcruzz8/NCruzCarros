import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RippleGrid from './RippleGrid';

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden bg-black">

      {/* 1. NOVO FUNDO: Ripple Grid (React Bits) */}
      <div className="absolute inset-0 z-0  width: '1080px', height: '1080px', position: 'relative' overflow-hidden">
        <RippleGrid
          enableRainbow={false}
          gridColor="#d71d1d"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={10}
          fadeDistance={1.5}
          vignetteStrength={2}
          glowIntensity={0.3}
          opacity={1}
          gridRotation={0}
          mouseInteraction
          mouseInteractionRadius={1}
        />

      </div>

      {/* 2. Overlay Gradiente (Mantém o texto legível) */}
      {/* NOTA: 'pointer-events-none' adicionado para o rato conseguir interagir com a grelha que está por baixo! */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-[1] pointer-events-none" />

      {/* Content */}
      {/* NOTA: 'pointer-events-auto' adicionado para garantir que podes clicar nos botões */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge Vermelho */}
          <span className="inline-block py-1 px-3 rounded-full bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-semibold tracking-wide mb-6 backdrop-blur-sm">
            OS PREÇOS MAIS COMPETITIVOS
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            Conduz o teu <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-gray-200">sonho.</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-300 font-light mb-10">
            Qualidade, confiança e transparência.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Botão Principal Vermelho */}
            <Link
              to="/stock"
              className="group relative px-8 py-4 bg-brand-red text-white font-bold rounded-sm overflow-hidden transition-all hover:bg-red-700 w-full sm:w-auto shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] block sm:inline-block text-center"
            >
              <span className="relative flex items-center justify-center gap-2">
                Ver Stock Local
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            {/* Botão Secundário */}
            <a
              href="/#contactos"
              className="group px-8 py-4 bg-transparent border border-white/30 text-white font-medium rounded-sm hover:bg-white/10 transition-all w-full sm:w-auto flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Globe className="w-4 h-4" />
              Pedir Orçamento Importação
            </a>
          </div>
        </motion.div>

        {/* Estatísticas / Trust signals rápidos no fundo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div>
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Carros Importados</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">30</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Anos de Mercado</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">24h</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Resposta</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;