import React, { useState } from 'react';
import { 
  Phone, Mail, Send, 
  User, Car, Calendar, Wallet, MessageSquare 
} from 'lucide-react';

const ContactSection = () => {
  // --- Lógica de Envio (Web3Forms) ---
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("A enviar...");
    
    const formData = new FormData(event.target);

    // ***********************************************************
    // COLA AQUI A TUA CHAVE DE ACESSO DO WEB3FORMS
    // Podes obter uma em https://web3forms.com/
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    // ***********************************************************

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Pedido enviado com sucesso! Entraremos em contacto brevemente.");
        event.target.reset(); // Limpa o formulário após envio
      } else {
        console.log("Error", data);
        setResult("Ocorreu um erro. Por favor tente novamente.");
      }
    } catch (error) {
      setResult("Erro de conexão. Verifique a sua internet.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="contactos" className="py-24 bg-brand-dark relative overflow-hidden">
      
      {/* Background Padrão Diagonal */}
      <div className="absolute inset-0 z-0">
        {/* Linhas diagonais subtis */}
        <div className="absolute inset-0 opacity-5" 
             style={{
               backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)',
               backgroundSize: '10px 10px'
             }}>
        </div>
        
        {/* Glow vermelho grande no canto para dar profundidade */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* LADO ESQUERDO: Texto e Contactos Diretos */}
          <div className="lg:sticky lg:top-24">
            <span className="text-brand-red font-bold tracking-widest text-sm uppercase">Vamos Conversar</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 text-white mb-6">
              O seu próximo carro <br /> à distância de um clique.
            </h2>
            <p className="text-gray-400 text-lg mb-12">
              Preencha o formulário com os detalhes do veículo que procura. A nossa equipa entrará em contacto com uma proposta personalizada.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="bg-neutral-900 p-4 rounded-lg border border-white/10 text-gray-400 group-hover:text-brand-red group-hover:border-brand-red transition-all duration-300">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Ligue-nos</h4>
                  <p className="text-gray-400 font-mono">+351 928 346 476</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="bg-neutral-900 p-4 rounded-lg border border-white/10 text-gray-400 group-hover:text-brand-red group-hover:border-brand-red transition-all duration-300">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Envie Email</h4>
                  <p className="text-gray-400 font-mono">n.cruz.auto00@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: O Formulário */}
          <div className="bg-neutral-900 p-8 rounded-2xl border border-white/10 shadow-2xl relative">
            {/* Efeito Glow subtil atrás do form */}
            <div className="absolute -inset-1 bg-brand-red/20 blur-xl -z-10 rounded-2xl opacity-20"></div>

            <form onSubmit={onSubmit} className="space-y-5">
              
              {/* Nome Completo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <User size={16} className="text-brand-red" />
                  Nome e Apelido
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="O seu nome" 
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Mail size={16} className="text-brand-red" />
                  Email (Opcional)
                </label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="seu@email.com" 
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Phone size={16} className="text-brand-red" />
                  Telefone
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="+351 912 345 678" 
                />
              </div>

              {/* Marca Pretendida */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Car size={16} className="text-brand-red" />
                  Marca
                </label>
                <input 
                  type="text" 
                  name="brand"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="Ex: BMW, Mercedes, Audi..." 
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Car size={16} className="text-brand-red" />
                  Modelo
                </label>
                <input 
                  type="text" 
                  name="model"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="Ex: Série 5, Classe C, A6..." 
                />
              </div>

              {/* Anos (Grid 2 colunas) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                    <Calendar size={16} className="text-brand-red" />
                    Ano Mínimo
                  </label>
                  <input 
                    type="number" 
                    name="year_min"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                    placeholder="2000" 
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                    <Calendar size={16} className="text-brand-red" />
                    Ano Máximo
                  </label>
                  <input 
                    type="number" 
                    name="year_max"
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                    placeholder="2026" 
                  />
                </div>
              </div>

              {/* Orçamento */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <Wallet size={16} className="text-brand-red" />
                  Orçamento Máximo (€)
                </label>
                <input 
                  type="number" 
                  name="budget"
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="45000" 
                />
              </div>
            
              {/* Extra 1 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <MessageSquare size={16} className="text-brand-red" />
                  Extra 1 (Opcional)
                </label>
                <textarea 
                  name="extra_1"
                  rows="2" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="Cor: Vermelho, Azul, Preto..."
                ></textarea>
              </div>

              {/* Extra 2 */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <MessageSquare size={16} className="text-brand-red" />
                  Extra 2 (Opcional)
                </label>
                <textarea 
                  name="extra_2"
                  rows="2" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="Kit: Desportivo, Pack M..."
                ></textarea>
              </div>

              {/* Informações Adicionais */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-white mb-2">
                  <MessageSquare size={16} className="text-brand-red" />
                  Informações Adicionais (Opcional)
                </label>
                <textarea 
                  name="message"
                  rows="4" 
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all" 
                  placeholder="Especificações desejadas, mais extras..."
                ></textarea>
              </div>

              {/* Feedback Message */}
              {result && (
                <div className={`text-center text-sm font-bold ${result.includes("sucesso") ? "text-green-500" : "text-brand-red"}`}>
                  {result}
                </div>
              )}

              {/* Botão de Envio */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full mt-4 bg-brand-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all shadow-[0_4px_20px_rgba(220,38,38,0.25)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "A Enviar..." : "Pedir Orçamento Gratuito"}
                {!isSubmitting && <Send size={18} />}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;