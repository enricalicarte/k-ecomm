'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import MediaRenderer from '@/components/MediaRenderer';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<any>({});

    const fetchCategories = async () => {
        const qs = await getDocs(collection(db, 'categories'));
        const data: any[] = [];
        qs.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setCategories(data);
        setLoading(false);
    };

    useEffect(() => {
        let mounted = true;
        const loadCats = async () => {
            const qs = await getDocs(collection(db, 'categories'));
            if (!mounted) return;
            const data: any[] = [];
            qs.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setCategories(data);
            setLoading(false);
        };
        loadCats();
        return () => { mounted = false; };
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!current.name) return alert("El nombre es requerido.");

        const id = current.id || current.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        await setDoc(doc(db, 'categories', id), {
            ...current,
            id: id,
        });
        
        setIsEditing(false);
        fetchCategories();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Seguro que quieres eliminar esta categoría? Si hay productos vinculados, seguirán existiendo pero su categoría no se mostrará correctamente.")) {
            await deleteDoc(doc(db, 'categories', id));
            fetchCategories();
        }
    };

    const openNew = () => {
        setCurrent({ name: '', image: '', desc: '' });
        setIsEditing(true);
    };

    if (loading) return <p className="text-gray-500 p-10 font-sans text-sm">Cargando...</p>;

    return (
        <div className="max-w-4xl font-sans">
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Categorías y Colecciones</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestiona las agrupaciones de tus productos en el portal.</p>
                </div>
                <button onClick={openNew} className="bg-charcoal text-white px-6 py-2 rounded text-sm font-medium hover:bg-charcoal/90 transition flex items-center gap-2">
                    <Plus size={16} /> Crear Categoría
                </button>
            </div>

            {isEditing ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 relative shadow-sm">
                    <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-medium text-gray-900 mb-6">{current.id ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
                    
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Nombre</label>
                                <input required type="text" placeholder="Catálogo, Lookbook..." value={current.name || ''} onChange={e => setCurrent({...current, name: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                            </div>
                            
                            <div className="row-span-2">
                                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Imagen (Opcional)</label>
                                <ImageUpload
                                    value={current.image || ''}
                                    onChange={(url) => setCurrent({ ...current, image: url })}
                                    folder="categories"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Descripción Corta</label>
                                <textarea placeholder="Describe el estilo..." value={current.desc || ''} onChange={e => setCurrent({...current, desc: e.target.value})} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 h-24 resize-none" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded transition">Cancelar</button>
                            <button type="submit" className="bg-charcoal text-white px-6 py-2 rounded text-sm hover:bg-charcoal/90 transition">Guardar</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(cat => (
                        <div key={cat.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm group">
                            <div className="aspect-[4/3] bg-gray-100 relative">
                                {cat.image ? (
                                    <MediaRenderer src={cat.image} fill className="object-cover group-hover:scale-105 transition-transform duration-500" alt={cat.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-30">
                                        <svg viewBox="0 0 200 200" className="w-[40%] h-[40%] stroke-gray-500 fill-none stroke-[2]"><path d="M 40,140 L 160,140 L 140,90 L 60,90 Z" /><circle cx="100" cy="115" r="10" /></svg>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setCurrent(cat); setIsEditing(true); }} className="bg-white/90 p-1.5 rounded shadow text-gray-700 hover:text-indigo-600">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="bg-white/90 p-1.5 rounded shadow text-gray-700 hover:text-red-600">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <h3 className="font-medium text-gray-900">{cat.name}</h3>
                                {cat.desc && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.desc}</p>}
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <div className="col-span-full text-center py-24 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                            <p className="text-gray-500 mb-2">No hay categorías configuradas.</p>
                            <button onClick={openNew} className="text-sm text-indigo-600 hover:underline">Comienza a agrupar productos</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
