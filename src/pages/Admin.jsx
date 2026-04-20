import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Upload, X, Plus, Trash2, Edit2, XCircle, Star, Eye, Calendar, Gauge, Fuel, Zap, ArrowRight, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, LogOut, Lock, GripHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // ================= DRAG & DROP MULTIMÉDIA =================
  const [media, setMedia] = useState([]); // Guarda fotos velhas e novas juntas
  const [coverId, setCoverId] = useState(null); // Sabe sempre qual é a capa, mesmo que a movas
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // UI States
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Stock e Paginação
  const [existingCars, setExistingCars] = useState([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 7;
  
  // Formulário
  const initialFormState = {
    make: '', model: '', version: '', price: '', year: '', mileage: '', fuel: '', transmission: '', power: '',
    seats: '', segment: '', origin: '', emissions: '', engine_capacity: '', color: '', doors: '', condition: '', 
    consumption: '', warranty: '', video_link: '', tag: 'Disponível', description: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsAuthenticated(true);
      setAuthChecking(false);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) showToastMessage('Acesso Negado: Email ou password incorretos.', 'error');
    else { setIsAuthenticated(true); showToastMessage('Bem-vindo ao Painel!', 'success'); }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    showToastMessage('Sessão terminada.', 'success');
    setTimeout(() => { navigate('/stock'); }, 800);
  };

  const showToastMessage = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => { setToast({ show: false, message: '', type: 'success' }); }, 4000);
  };

  useEffect(() => { if (isAuthenticated) fetchExistingCars(); }, [isAuthenticated]);

  const fetchExistingCars = async () => {
    setLoadingCars(true);
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (!error && data) setExistingCars(data);
    setLoadingCars(false);
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Tem a certeza?')) return;
    try {
      const { error } = await supabase.from('cars').delete().eq('id', id);
      if (error) throw error;
      showToastMessage('Anúncio apagado!', 'success');
      fetchExistingCars();
      if (editingId === id) cancelEdit();
    } catch (error) { showToastMessage('Erro: ' + error.message, 'error'); }
  };

  // --- LÓGICA DE DRAG & DROP E IMAGENS ---
  const handleEditClick = (car) => {
    setEditingId(car.id);
    setFormData({ ...initialFormState, ...car });
    
    const existingMedia = (car.images || []).map((url, i) => ({ id: `old-${i}`, type: 'old', url }));
    setMedia(existingMedia);
    if (existingMedia.length > 0) setCoverId(existingMedia[0].id);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null); setFormData(initialFormState); setMedia([]); setCoverId(null);
  };

  const handleFileChange = (e) => {
    const newMedia = Array.from(e.target.files).map((file, i) => ({
      id: `new-${Date.now()}-${i}`, type: 'new', url: URL.createObjectURL(file), file
    }));
    setMedia(prev => {
      const updated = [...prev, ...newMedia];
      if (!coverId && updated.length > 0) setCoverId(updated[0].id);
      return updated;
    });
  };

  const removeMedia = (idToRemove) => {
    setMedia(prev => prev.filter(m => m.id !== idToRemove));
    if (coverId === idToRemove) setCoverId(null);
  };

  const handleSort = () => {
    const _media = [...media];
    const draggedItemContent = _media.splice(dragItem.current, 1)[0];
    _media.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setMedia(_media);
  };

  const handleInputChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const getCoverImageUrl = () => {
    const cover = media.find(m => m.id === coverId) || media[0];
    return cover ? cover.url : '/placeholder.jpg';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImages = [];
      for (const item of media) {
        if (item.type === 'old') {
          finalImages.push(item.url);
        } else {
          const fileName = `${Date.now()}-${item.file.name}`;
          await supabase.storage.from('car-images').upload(fileName, item.file);
          const { data: { publicUrl } } = supabase.storage.from('car-images').getPublicUrl(fileName);
          finalImages.push(publicUrl);
        }
      }

      // Garante que a foto escolhida como capa fica em 1º lugar na base de dados
      const coverIndexInFinal = media.findIndex(m => m.id === coverId);
      if (coverIndexInFinal > 0) {
        const cover = finalImages.splice(coverIndexInFinal, 1)[0];
        finalImages.unshift(cover);
      }

      if (editingId) {
        await supabase.from('cars').update({ ...formData, images: finalImages }).eq('id', editingId);
        showToastMessage('Atualizado com sucesso!', 'success');
      } else {
        await supabase.from('cars').insert([{ ...formData, images: finalImages }]);
        showToastMessage('Publicado com sucesso!', 'success');
        setCurrentPage(1); 
      }
      cancelEdit(); fetchExistingCars();
    } catch (error) { showToastMessage('Erro: ' + error.message, 'error'); } 
    finally { setLoading(false); }
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = existingCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(existingCars.length / carsPerPage);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  if (authChecking) return <div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div></div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
        {toast.show && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-bounce">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border backdrop-blur-md text-white transition-all duration-300 bg-red-950/80 border-red-500/50`}><AlertCircle className="text-red-400" size={24} /><span className="font-medium">{toast.message}</span></div>
          </div>
        )}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        <div className="bg-neutral-900/80 p-8 rounded-2xl border border-white/10 w-full max-w-md text-center relative z-10 backdrop-blur-md shadow-2xl">
          <div className="flex justify-center mb-6"><div className="p-4 bg-brand-red/10 rounded-full border border-brand-red/20"><Lock className="text-brand-red" size={32} /></div></div>
          <h2 className="text-2xl text-white font-bold mb-2">Painel de Administração</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" required placeholder="Email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-lg text-white focus:border-brand-red transition-colors outline-none" />
            <input type="password" required placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 p-4 rounded-lg text-white focus:border-brand-red transition-colors outline-none" />
            <button type="submit" disabled={isLoggingIn} className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] disabled:opacity-50 mt-4 flex justify-center items-center gap-2">
              {isLoggingIn ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> A entrar...</> : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-12 px-4 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8 bg-neutral-900/50 p-4 px-6 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3"><Lock className="text-brand-red" size={20} /><span className="text-white font-bold tracking-widest text-sm uppercase">Modo Administrador</span></div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors bg-white/5 hover:bg-red-500/10 px-4 py-2 rounded-lg">Sair <LogOut size={16} /></button>
      </div>

      {toast.show && (
        <div className="fixed bottom-8 right-8 z-[200] animate-bounce">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] border backdrop-blur-md text-white transition-all duration-300 ${toast.type === 'success' ? 'bg-green-950/80 border-green-500/50' : 'bg-red-950/80 border-red-500/50'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="text-green-400" size={24} /> : <AlertCircle className="text-red-400" size={24} />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* MODAL DE PREVIEW */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="relative w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPreview(false)} className="absolute -top-12 right-0 text-gray-400 hover:text-white flex items-center gap-2"><X size={20}/> Fechar Preview</button>
            <div className="bg-neutral-900 rounded-lg overflow-hidden border border-white/10 flex flex-col shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 z-20"><span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-sm ${formData.tag === 'Reservado' ? 'bg-gray-600' : 'bg-brand-red'}`}>{formData.tag}</span></div>
                <img src={getCoverImageUrl()} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-6 flex flex-col flex-grow bg-neutral-900 relative z-20">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{formData.make || 'Marca'} {formData.model || 'Modelo'}</h3>
                  <p className="text-brand-red font-medium text-sm truncate">{formData.version || formData.transmission || 'Versão / Caixa'}</p>
                </div>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-red" /><span>{formData.year || 'Ano'}</span></div>
                  <div className="flex items-center gap-2"><Gauge size={16} className="text-brand-red" /><span>{formData.mileage || 'Km'}</span></div>
                  <div className="flex items-center gap-2"><Fuel size={16} className="text-brand-red" /><span>{formData.fuel || 'Combust.'}</span></div>
                  <div className="flex items-center gap-2"><Zap size={16} className="text-brand-red" /><span>{formData.transmission || 'Caixa'}</span></div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                  <div><p className="text-xs text-gray-500 uppercase">Preço</p><p className="text-2xl font-bold text-white">{formData.price || '0€'}</p></div>
                  <div className="p-3 bg-brand-red rounded-full"><ArrowRight size={20} className="text-white" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= FORMULÁRIO (COM DRAG & DROP) ================= */}
        <div className={`bg-neutral-900 p-8 rounded-2xl border ${editingId ? 'border-brand-red shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-white/10'} h-fit transition-all`}>
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h1 className="text-2xl font-bold text-white">{editingId ? '✏️ Editar Anúncio' : 'Adicionar Novo Carro'}</h1>
            <div className="flex gap-4">
              <button type="button" onClick={() => setShowPreview(true)} className="text-gray-400 hover:text-brand-red flex items-center gap-1 text-sm font-medium transition-colors"><Eye size={18} /> Pré-visualizar</button>
              {editingId && <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"><XCircle size={18} /> Cancelar</button>}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* UPLOAD & DRAG DROP */}
            <div className="bg-black/50 p-6 rounded-xl border border-dashed border-white/20">
              <div className="flex justify-between items-end mb-4">
                <label className="block text-white font-bold">Galeria & Ordenação</label>
                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white px-3 py-1.5 rounded text-sm transition-colors font-medium"><Upload size={16} /> Adicionar Fotos</label>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="file-upload" />
              </div>
              <p className="text-xs text-gray-500 mb-4">Arrasta as fotos para as ordenares. A foto com a ⭐ será a principal.</p>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                {media.map((item, index) => (
                  <div 
                    key={item.id} 
                    draggable
                    onDragStart={(e) => (dragItem.current = index)}
                    onDragEnter={(e) => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                    className={`relative aspect-square rounded overflow-hidden group border-2 cursor-grab active:cursor-grabbing transition-transform ${coverId === item.id ? 'border-brand-red' : 'border-transparent hover:border-white/30'}`}
                  >
                    <img src={item.url} alt="Galeria" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-2">
                      <button type="button" onClick={() => setCoverId(item.id)} className={`p-1.5 rounded-full ${coverId === item.id ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}><Star fill={coverId === item.id ? 'currentColor' : 'none'} size={18} /></button>
                      <button type="button" onClick={() => removeMedia(item.id)} className="p-1.5 text-white hover:text-red-500 rounded-full"><Trash2 size={18} /></button>
                    </div>
                    {item.type === 'new' && <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl opacity-80 pointer-events-none">NOVA</div>}
                    {coverId === item.id && <div className="absolute top-0 left-0 bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-br z-10 pointer-events-none">CAPA</div>}
                    
                    {/* Ícone de arrastar no canto */}
                    <div className="absolute bottom-1 left-1 bg-black/50 p-1 rounded opacity-50 group-hover:opacity-100 pointer-events-none"><GripHorizontal size={14} color="white"/></div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCO 1: PRINCIPAL */}
            <div>
              <h3 className="text-brand-red text-xs uppercase font-bold tracking-widest mb-3 border-b border-white/10 pb-2">Informação Principal</h3>
              <div className="grid grid-cols-2 gap-4">
                <input name="make" placeholder="Marca * (Ex: MINI)" value={formData.make} onChange={handleInputChange} required className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="model" placeholder="Modelo * (Ex: Coupé)" value={formData.model} onChange={handleInputChange} required className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="version" placeholder="Versão (Ex: John Cooper Works)" value={formData.version} onChange={handleInputChange} className="col-span-2 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="price" placeholder="Preço (Ex: 11 970 €)" value={formData.price} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm font-bold outline-none focus:border-brand-red" />
                <select name="tag" value={formData.tag} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red">
                  <option value="Disponível">Disponível</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Novo">Novo</option>
                </select>
              </div>
            </div>

            {/* BLOCO 2: TÉCNICA */}
            <div>
              <h3 className="text-brand-red text-xs uppercase font-bold tracking-widest mb-3 border-b border-white/10 pb-2">Características Técnicas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input name="year" placeholder="Registo (Ex: Nov. 2011)" value={formData.year} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="mileage" placeholder="Quilómetros (Ex: 164 994)" value={formData.mileage} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <select name="fuel" value={formData.fuel} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red">
                  <option value="">Combustível...</option>
                  <option value="Gasóleo">Gasóleo</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Elétrico">Elétrico</option>
                </select>
                <input name="power" placeholder="Potência (Ex: 143 Cv)" value={formData.power} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="engine_capacity" placeholder="Cilindrada (Ex: 1995 Cc)" value={formData.engine_capacity} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="transmission" placeholder="Caixa (Ex: Manual 6v)" value={formData.transmission} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="emissions" placeholder="Emissões (Ex: 114g/km)" value={formData.emissions} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="consumption" placeholder="Consumos (Ex: 5.5L/100)" value={formData.consumption} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="condition" placeholder="Estado (Ex: Usado)" value={formData.condition} onChange={handleInputChange} className="bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
              </div>
            </div>

            {/* BLOCO 3: FÍSICO E ORIGEM */}
            <div>
              <h3 className="text-brand-red text-xs uppercase font-bold tracking-widest mb-3 border-b border-white/10 pb-2">Detalhes Físicos & Origem</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input name="segment" placeholder="Segmento (Utilitário...)" value={formData.segment} onChange={handleInputChange} className="col-span-2 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="origin" placeholder="Origem (Ex: Nacional)" value={formData.origin} onChange={handleInputChange} className="col-span-2 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="color" placeholder="Cor (Ex: Preto)" value={formData.color} onChange={handleInputChange} className="col-span-1 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="doors" placeholder="Portas (Ex: 2)" value={formData.doors} onChange={handleInputChange} className="col-span-1 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="seats" placeholder="Lugares (Ex: 4)" value={formData.seats} onChange={handleInputChange} className="col-span-1 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
                <input name="warranty" placeholder="Garantia (Ex: 18 Meses)" value={formData.warranty} onChange={handleInputChange} className="col-span-1 bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red" />
              </div>
            </div>

            {/* BLOCO 4: DESCRIÇÃO & VIDEO */}
            <div>
              <h3 className="text-brand-red text-xs uppercase font-bold tracking-widest mb-3 border-b border-white/10 pb-2">Multimédia & Descrição</h3>
              <input name="video_link" placeholder="Link do Vídeo YouTube (Opcional)" value={formData.video_link} onChange={handleInputChange} className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm mb-4 outline-none focus:border-brand-red" />
              <textarea name="description" placeholder="Descrição livre ou extras do veículo..." rows="4" value={formData.description} onChange={handleInputChange} className="w-full bg-black border border-white/10 p-3 rounded text-white text-sm outline-none focus:border-brand-red"></textarea>
            </div>

            <button type="submit" disabled={loading} className={`w-full text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-brand-red hover:bg-red-700'}`}>
              {loading ? "A processar..." : (editingId ? "Atualizar Anúncio" : "Publicar Anúncio")}
              {!loading && (editingId ? <Edit2 size={20} /> : <Plus size={20} />)}
            </button>
          </form>
        </div>

        {/* LADO DIREITO: Gerir Stock Atual */}
        <div className="bg-neutral-900 p-8 rounded-2xl border border-white/10 h-fit flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-white">Gerir Stock</h2>
            {existingCars.length > 0 && (
               <span className="text-brand-red font-bold bg-brand-red/10 px-3 py-1 rounded-full text-sm">
                 {existingCars.length} {existingCars.length === 1 ? 'carro' : 'carros'}
               </span>
            )}
          </div>
          
          {loadingCars ? (
            <p className="text-gray-400">A carregar stock...</p>
          ) : existingCars.length === 0 ? (
            <p className="text-gray-400">Não há carros em stock de momento.</p>
          ) : (
            <>
              <div className="space-y-4 pr-2">
                {currentCars.map((car) => (
                  <div key={car.id} className={`bg-black p-4 rounded-xl border flex items-center justify-between group transition-colors ${editingId === car.id ? 'border-brand-red' : 'border-white/10'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-neutral-800 rounded overflow-hidden">
                        <img src={car.images && car.images.length > 0 ? car.images[0] : '/placeholder.jpg'} alt={car.model} className="w-full h-full object-cover"/>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-base leading-tight">{car.make} {car.model}</p>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          <span>{car.price || 'Sem Preço'}</span> • 
                          <span className={car.tag === 'Disponível' ? 'text-green-500' : car.tag === 'Vendido' ? 'text-red-500' : 'text-orange-500'}>{car.tag}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleEditClick(car)} className={`p-2 rounded transition-colors ${editingId === car.id ? 'text-brand-red bg-red-500/10' : 'text-gray-500 hover:text-orange-400 hover:bg-orange-500/10'}`} title="Editar Anúncio"><Edit2 size={20} /></button>
                      <button onClick={() => handleDeleteCar(car.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Apagar Anúncio"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                  <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center gap-2 p-2 px-4 rounded bg-neutral-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors text-sm font-medium"><ChevronLeft size={18} /> Anterior</button>
                  <span className="text-gray-400 text-sm font-medium">Página <span className="text-white">{currentPage}</span> de {totalPages}</span>
                  <button onClick={nextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 p-2 px-4 rounded bg-neutral-800 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors text-sm font-medium">Próximo <ChevronRight size={18} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;