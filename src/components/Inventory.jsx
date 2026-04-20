import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, ArrowRight, Zap, CarFront, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetchLatestCars();
  }, []);

  async function fetchLatestCars() {
    setLoading(true);
    let { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false }).limit(9);
    if (!error && data) setCars(data);
    setLoading(false);
  }

  const handleNext = () => setActiveIndex((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? cars.length - 1 : prev - 1));

  const getLeftIndex = () => (activeIndex === 0 ? cars.length - 1 : activeIndex - 1);
  const getRightIndex = () => (activeIndex === cars.length - 1 ? 0 : activeIndex + 1);

  return (
    <section id="stock" className="py-24 bg-brand-dark relative z-0 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {loading ? (
           <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-white/5 backdrop-blur-sm max-w-3xl mx-auto shadow-2xl">
            <div className="flex justify-center mb-6"><div className="bg-brand-red/10 p-4 rounded-full"><CarFront size={48} className="text-brand-red opacity-80" /></div></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Não há stock disponível de momento.</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Todos os carros já foram vendidos, mas a nossa especialidade é a importação à medida.</p>
            <a href="#contactos" className="inline-block px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)]">Encomendar o meu</a>
          </div>
        ) : (
          <>
            <div className="text-center mb-16 relative z-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">O SEU <span className="text-brand-red">PRÓXIMO</span> CARRO</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Descubra as novidades que acabaram de chegar à nossa garagem.</p>
            </div>

            {cars.length >= 3 ? (
              <div className="relative w-full h-[550px] sm:h-[450px] flex items-center justify-center">
                <button onClick={handlePrev} className="absolute left-0 md:left-4 z-30 p-3 sm:p-4 bg-black/60 hover:bg-brand-red text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-2xl hover:scale-110"><ChevronLeft size={28} /></button>

                <div className="relative w-full max-w-[1100px] h-full flex justify-center items-center">
                  {cars.map((car, index) => {
                    let position = 'hidden';
                    let styles = 'opacity-0 scale-50 z-0 pointer-events-none translate-x-0';
                    
                    if (index === activeIndex) {
                      position = 'active';
                      styles = 'opacity-100 scale-100 z-20 translate-x-0 blur-none pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.6)] border-brand-red/50';
                    } else if (index === getLeftIndex()) {
                      position = 'left';
                      styles = 'opacity-40 scale-[0.85] z-10 -translate-x-[45%] sm:-translate-x-[60%] blur-[2px] pointer-events-none border-white/5';
                    } else if (index === getRightIndex()) {
                      position = 'right';
                      styles = 'opacity-40 scale-[0.85] z-10 translate-x-[45%] sm:translate-x-[60%] blur-[2px] pointer-events-none border-white/5';
                    }

                    return (
                      <div key={car.id} className={`absolute w-[90%] sm:w-[850px] h-[500px] sm:h-[350px] transition-all duration-700 ease-out bg-neutral-900 rounded-xl overflow-hidden border ${styles}`}>
                        {/* ALTERADO PARA FLEX-ROW EM ECRÃS MAIORES PARA FICAR HORIZONTAL */}
                        <Link to={`/carro/${car.id}`} className="flex flex-col sm:flex-row h-full group">
                          
                          {/* Metade Esquerda: Imagem */}
                          <div className="relative w-full sm:w-1/2 h-56 sm:h-full overflow-hidden">
                            <div className="absolute top-4 left-4 z-10"><span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm ${car.tag === 'Reservado' ? 'bg-gray-600' : 'bg-brand-red'}`}>{car.tag}</span></div>
                            <img src={car.images?.[0] || '/placeholder.jpg'} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 sm:bg-gradient-to-r via-transparent to-transparent opacity-90 sm:opacity-50" />
                          </div>

                          {/* Metade Direita: Info */}
                          <div className="w-full sm:w-1/2 p-6 md:p-8 flex flex-col justify-center bg-neutral-900 relative z-20">
                            <div className="mb-6">
                              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">{car.make} {car.model}</h3>
                              {(car.version || car.transmission) && <p className="text-brand-red font-medium truncate">{car.version || car.transmission}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 text-sm text-gray-400">
                              {car.year && <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" /><span>{car.year}</span></div>}
                              {car.mileage && <div className="flex items-center gap-2"><Gauge size={16} className="text-brand-red" /><span>{car.mileage}</span></div>}
                              {car.fuel && <div className="flex items-center gap-2"><Fuel size={16} className="text-brand-red" /><span>{car.fuel}</span></div>}
                              {car.power && <div className="flex items-center gap-2"><Zap size={16} className="text-brand-red" /><span>{car.power}</span></div>}
                            </div>

                            <div className="mt-auto border-t border-white/10 pt-4 flex items-center justify-between">
                              <div>
                                {car.price && (
                                  <>
                                    <p className="text-xs text-gray-500 uppercase">Preço</p>
                                    <p className="text-2xl font-bold text-white">{car.price}</p>
                                  </>
                                )}
                              </div>
                              <div className="p-3 bg-white/5 group-hover:bg-brand-red rounded-full transition-colors group-hover:translate-x-2 duration-300">
                                <ArrowRight size={20} className="text-white" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                <button onClick={handleNext} className="absolute right-0 md:right-4 z-30 p-3 sm:p-4 bg-black/60 hover:bg-brand-red text-white rounded-full transition-all backdrop-blur-md border border-white/10 shadow-2xl hover:scale-110"><ChevronRight size={28} /></button>
              </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                 {/* ... (mantido código fallback antigo se tiver menos de 3 carros) ... */}
               </div>
            )}

            <div className="mt-16 text-center relative z-20">
              <Link to="/stock" className="inline-block px-8 py-3 border border-white/20 hover:border-brand-red hover:text-brand-red text-white transition-colors uppercase tracking-widest text-sm font-bold rounded-sm">
                Ver Stand Completo
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Inventory;