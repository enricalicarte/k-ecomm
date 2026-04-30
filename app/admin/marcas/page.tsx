'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

type Brand = {
  id: string;
  name: string;
  slug: string;
  logoText: string;
  origin: string;
  description: string;
  coverImage: string;
  isFeatured: boolean;
};

export default function AdminDesignersPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Partial<Brand>>({});

  const fetchBrands = async () => {
    setLoading(true);
    const qs = await getDocs(collection(db, 'brands'));
    const data: Brand[] = [];
    qs.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Brand));
    
    // Auto-seed Raf Simons for the user if it doesn't exist
    if (!data.find(b => b.slug === 'raf-simons')) {
      const desc = `Raf Simons has repeatedly redefined youth culture and menswear over the last three decades.\n\nHis eponymous label, launched in 1995, brought an unprecedented focus on subcultures, music, and the rebellious energy of youth. From the iconic 'Riot! Riot! Riot!' collection to the seminal 'Consumed', his pieces have become some of the most sought-after grails in the archival fashion community. The dedication to structural experimentation and subversive graphics ensures his place in the pantheon of design.`;
      const seedData = {
        id: 'raf-simons',
        name: 'Raf Simons',
        slug: 'raf-simons',
        logoText: 'RAF SIMONS',
        origin: 'Belgium',
        description: desc,
        coverImage: '',
        isFeatured: true
      };
      await setDoc(doc(db, 'brands', 'raf-simons'), seedData);
      data.push(seedData);
    }
    
    setBrands(data);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBrands();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBrand.name || !currentBrand.slug) return alert("Nombre y Slug son campos obligatorios.");

    const brandId = currentBrand.id || Date.now().toString();
    
    await setDoc(doc(db, 'brands', brandId), {
      ...currentBrand,
      id: brandId,
      isFeatured: currentBrand.isFeatured || false
    });
    
    setIsEditing(false);
    fetchBrands();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres borrar permanentemente este diseñador? Su espacio dedicado en el archivo será destruido.")) {
      await deleteDoc(doc(db, 'brands', id));
      fetchBrands();
    }
  };

  const openNew = () => {
    setCurrentBrand({
      name: '', slug: '', logoText: '', origin: '', description: '', coverImage: '', isFeatured: false
    });
    setIsEditing(true);
  };

  const handleSeedOriginalBrands = async () => {
    if (!window.confirm("¿Inicializar el grid base de diseñadores de archivo? Esto generará los archivos para los creadores esenciales.")) return;
    setLoading(true);
    
    const archivalDesigners = [
      { slug: 'rick-owens', name: 'Rick Owens', logoText: 'RICK OWENS', origin: 'USA/Paris', isFeatured: true, description: 'The undisputed lord of modern brutalist fashion. Known for elongated proportions, dropped crotches, and a dark, draped aesthetic that defies traditional luxury.' },
      { slug: 'yohji-yamamoto', name: 'Yohji Yamamoto', logoText: 'YOHJI YAMAMOTO', origin: 'Japan', isFeatured: true, description: "Master tailor and poet of black. Yohji's profound understanding of drape and asymmetry creates garments that interact with the space around the body." },
      { slug: 'maison-margiela', name: 'Maison Margiela', logoText: '0-23', origin: 'Paris', isFeatured: false, description: 'The house that defined deconstruction. By exposing seams, repurposing vintage items, and maintaining strict anonymity, Margiela completely re-oriented late 20th century fashion.' },
      { slug: 'undercover', name: 'Undercover', logoText: 'UNDERCOVER', origin: 'Japan', isFeatured: false, description: 'Jun Takahashi’s collision of punk attitude and high-end construction. “We Make Noise Not Clothes” acts as the eternal manifesto for the brand.' },
      { slug: 'comme-des-garcons', name: 'Comme des Garçons', logoText: 'CDG', origin: 'Japan', isFeatured: true, description: 'Rei Kawakubo’s ever-evolving empire. Constantly challenging the very definition of a garment through structural warping and relentless innovation.' }
    ];

    try {
      for (const d of archivalDesigners) {
        await setDoc(doc(db, 'brands', d.slug), { ...d, id: d.slug });
      }
      await fetchBrands();
    } catch (error) {
      console.error('Error importing designers', error);
      alert('Error inicializando el archivo base.');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500 font-sans text-sm p-10">Cargando Diseñadores...</p>;

  return (
    <div className="max-w-6xl font-sans">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Base de Datos de Diseñadores</h1>
          <p className="text-sm text-gray-500 mt-1">Cura y destaca los creadores en el archivo.</p>
        </div>
        <button onClick={openNew} className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition flex items-center gap-2">
          <Plus size={16} /> Registrar Diseñador
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 relative shadow-sm">
          <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
          <h2 className="text-xl font-medium text-gray-900 mb-6">{currentBrand.id ? 'Modificar Perfil de Diseñador' : 'Nuevo Diseñador'}</h2>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Nombre de Registro</label>
                <input required type="text" value={currentBrand.name || ''} onChange={e => {
                  const name = e.target.value;
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setCurrentBrand({...currentBrand, name, slug: currentBrand.id ? currentBrand.slug : slug})
                }} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Slug (ID del Sistema)</label>
                <input required type="text" value={currentBrand.slug || ''} onChange={e => setCurrentBrand({...currentBrand, slug: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm bg-gray-50 text-gray-600 font-mono focus:border-indigo-500 outline-none" />
                <p className="text-xs text-gray-500 mt-2">Ruta: /designers/{currentBrand.slug || 'slug'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Apodo Tipográfico (Logo Texto)</label>
                <input type="text" placeholder="ej. RAF SIMONS" value={currentBrand.logoText || ''} onChange={e => setCurrentBrand({...currentBrand, logoText: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Origen Operativo</label>
                <input type="text" placeholder="ej. Bélgica" value={currentBrand.origin || ''} onChange={e => setCurrentBrand({...currentBrand, origin: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
              </div>
            </div>

            <div className="w-full p-4 border border-gray-200 rounded">
              <ImageUpload
                label="Recurso de Cabecera"
                folder="brands"
                value={currentBrand.coverImage || ''}
                onChange={(url) => setCurrentBrand({ ...currentBrand, coverImage: url })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Historia / Perfil en Archivo</label>
              <textarea rows={6} value={currentBrand.description || ''} onChange={e => setCurrentBrand({...currentBrand, description: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
              <input type="checkbox" id="featured" checked={currentBrand.isFeatured || false} onChange={e => setCurrentBrand({...currentBrand, isFeatured: e.target.checked})} className="w-4 h-4 accent-indigo-600 rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                 <Star size={16} className={currentBrand.isFeatured ? "text-amber-500 fill-amber-500" : "text-gray-300"} /> Destacar en el Menú Superior
              </label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-gray-200 text-gray-600 hover:text-gray-900 rounded text-sm font-medium transition">Cancelar</button>
              <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition">Guardar Cambios</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map(brand => (
            <div key={brand.id} className={`bg-white border rounded-lg p-6 flex flex-col justify-between group shadow-sm transition-all hover:shadow-md ${brand.isFeatured ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-gray-200'}`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="text-gray-500 font-medium text-xs tracking-wider border-b border-gray-100 pb-2 flex-grow mr-4 truncate">
                    {brand.logoText || brand.name.toUpperCase()}
                  </div>
                  {brand.isFeatured && <Star size={16} className="text-amber-500 fill-amber-500 shrink-0" />}
                </div>
                <h3 className="font-semibold text-xl mb-1 text-gray-900">{brand.name}</h3>
                <span className="text-xs text-gray-500 font-medium block mb-4">{brand.origin}</span>
                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{brand.description}</p>
              </div>
              
              <div className="flex gap-3 justify-end mt-6 border-t border-gray-100 pt-4 transition-opacity">
                <button onClick={() => { setCurrentBrand(brand); setIsEditing(true); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(brand.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {brands.length === 0 && (
             <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500 mb-6 text-sm font-medium">El directorio de diseñadores está vacío.</p>
                <button onClick={handleSeedOriginalBrands} className="bg-indigo-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700 transition inline-flex items-center">
                    Inicializar Diseñadores Base
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
