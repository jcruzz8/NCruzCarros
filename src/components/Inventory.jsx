import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { Fuel, Calendar, Gauge, ArrowRight, Zap, CarFront } from 'lucide-react';

const Inventory = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestCars();
  }, []);

  async function fetchLatestCars() {
    setLoading(true);
    let { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3); 

    if (!error && data) {
      setCars(data);
    }
    setLoading(false);
  }

  return (
    <section id="stock" className="py-24 bg-brand-dark relative z-0">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{
               backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
               backgroundSize: '80px 80px'
             }}>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-transparent to-brand-dark"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {loading ? (
           <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
           </div>
        ) : cars.length === 0 ? (
          
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-white/5 backdrop-blur-sm max-w-3xl mx-auto shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="bg-brand-red/10 p-4 rounded-full">
                <CarFront size={48} className="text-brand-red opacity-80" />
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Não há stock disponível de momento.
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              Todos os carros já foram vendidos, mas a nossa especialidade é a importação à medida.
            </p>
            <a href="#contactos" className="inline-block px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-bold rounded-lg transition-all uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              Encomendar o meu
            </a>
          </div>

        ) : (
          <>
            {/* CABEÇALHO SÓ APARECE SE HOUVER CARROS */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                O SEU <span className="text-brand-red">PRÓXIMO</span> CARRO
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Descubra as novidades que acabaram de chegar à nossa garagem.
              </p>
            </div>

            {/* GRELHA DE CARROS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <Link to={`/carro/${car.id}`} key={car.id} className="group bg-neutral-900 rounded-lg overflow-hidden border border-white/5 hover:border-brand-red/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] flex flex-col">
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                       <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm ${car.tag === 'Reservado' || car.tag === 'Vendido' ? 'bg-gray-600' : 'bg-brand-red'}`}>
                         {car.tag}
                       </span>
                    </div>
                    <img 
                      src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder.jpg'} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
                  </div>

                  <div className="p-6 flex flex-col flex-grow bg-neutral-900 relative z-20">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-1">{car.make} {car.model}</h3>
                      <p className="text-brand-red font-medium truncate">{car.version || car.transmission}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" /><span>{car.year}</span></div>
                      <div className="flex items-center gap-2"><Gauge size={16} className="text-brand-red" /><span>{car.mileage}</span></div>
                      <div className="flex items-center gap-2"><Fuel size={16} className="text-brand-red" /><span>{car.fuel}</span></div>
                      <div className="flex items-center gap-2"><Zap size={16} className="text-brand-red" /><span>{car.transmission}</span></div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Preço</p>
                        <p className="text-2xl font-bold text-white">{car.price}</p>
                      </div>
                      <div className="p-3 bg-white/5 group-hover:bg-brand-red rounded-full transition-colors group-hover:translate-x-1 duration-300">
                        <ArrowRight size={20} className="text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 text-center">
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