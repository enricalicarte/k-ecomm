'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Loader2, Plus, ArrowUp, ArrowDown, Trash2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';

type ModuleConfig = {
    id: string;
    type: string;
    props: Record<string, any>;
};

const MODULE_DEFINITIONS: Record<string, { label: string, fields: {name: string, label: string, type: string, options?: string[]}[] }> = {
    hero: {
        label: 'Hero',
        fields: [
            { name: 'heroLogoText', label: 'Texto de Logo', type: 'text' },
            { name: 'heroTitle', label: 'Título Grande', type: 'text' },
            { name: 'heroSubtitle', label: 'Subtítulo', type: 'text' }
        ]
    },
    manifesto: {
        label: 'Manifiesto',
        fields: [
            { name: 'manifestoSuper', label: 'Super Título', type: 'text' },
            { name: 'manifestoTitle', label: 'Título', type: 'text' },
            { name: 'manifestoDesc', label: 'Descripción', type: 'textarea' }
        ]
    },
    showroom: {
        label: 'Showroom (Imagen + Info)',
        fields: [
            { name: 'storeTitle', label: 'Título', type: 'text' },
            { name: 'storeDesc', label: 'Descripción', type: 'textarea' },
            { name: 'storeSchedule', label: 'Horario/Extra', type: 'text' },
            { name: 'storeImage', label: 'URL Imagen', type: 'image' }
        ]
    },
    split: {
        label: 'Pantalla Dividida (2 Imágenes)',
        fields: [
            { name: 'splitTitle', label: 'Título Oculto', type: 'text' },
            { name: 'splitBtnText', label: 'Texto Botón', type: 'text' },
            { name: 'splitBtnLink', label: 'Enlace Botón', type: 'text' },
            { name: 'splitImage1', label: 'URL Imagen Izq', type: 'image' },
            { name: 'splitImage2', label: 'URL Imagen Der', type: 'image' }
        ]
    },
    collection: {
        label: 'Colección Destacada (Grid)',
        fields: [
            { name: 'collectionTitle', label: 'Título', type: 'text' },
            { name: 'collectionMainImage', label: 'URL Imagen Principal', type: 'image' }
        ]
    },
    cta: {
        label: 'Llamada a la Acción (Banner)',
        fields: [
            { name: 'ctaTitle', label: 'Título', type: 'text' },
            { name: 'ctaDesc', label: 'Descripción', type: 'textarea' },
            { name: 'ctaBtnText', label: 'Texto Botón', type: 'text' },
            { name: 'ctaBtnLink', label: 'Enlace Botón', type: 'text' },
            { name: 'ctaImage', label: 'URL Fondo', type: 'image' }
        ]
    },
    marquee: {
        label: 'Cinta rodante',
        fields: [
            { name: 'marqueeText', label: 'Texto (se repetirá)', type: 'text' },
            { name: 'marqueeSpeed', label: 'Velocidad (1-100)', type: 'text' },
            { name: 'marqueeSize', label: 'Tamaño de Letra (clases Tailwind)', type: 'select', options: ['text-4xl md:text-8xl', 'text-6xl md:text-9xl', 'vw-huge'] }
        ]
    },
    huge_logo: {
        label: 'Logo Gigante',
        fields: []
    },
    carousels: {
        label: 'Carruseles de esta página',
        fields: []
    },
    newsletter: {
        label: 'Newsletter',
        fields: [
            { name: 'newsletterTitle', label: 'Título', type: 'text' },
            { name: 'newsletterDesc', label: 'Descripción', type: 'textarea' },
            { name: 'newsletterBtnText', label: 'Texto del Botón', type: 'text' }
        ]
    },
    our_story: {
        label: 'Nuestra Historia (Imagen + Texto Abajo)',
        fields: [
            { name: 'storyImage', label: 'URL Imagen', type: 'image' },
            { name: 'storyTitle', label: 'Título', type: 'text' },
            { name: 'storyDesc', label: 'Descripción', type: 'textarea' }
        ]
    },
    blog_slider: {
        label: 'Blog Slider',
        fields: [
            { name: 'blogTitle', label: 'Título', type: 'text' },
            { name: 'blogDesc', label: 'Descripción', type: 'textarea' }
        ]
    },
    featured_category: {
        label: 'Categoría Destacada',
        fields: [
            { name: 'categoryTitle', label: 'Título de Categoría', type: 'text' },
            { name: 'categoryDesc', label: 'Descripción', type: 'textarea' },
            { name: 'categoryBtnText', label: 'Texto del Botón', type: 'text' },
            { name: 'categoryBtnLink', label: 'Enlace del Botón', type: 'text' },
            { name: 'sourceCategory', label: 'Categoría de Productos', type: 'category_select' }
        ]
    },
    lookbook_grid: {
        label: 'Grid Destacado (Estilo Lookbook)',
        fields: [
            { name: 'lookbookTitle', label: 'Título Principal', type: 'text' },
            { name: 'lookbookSubtitle', label: 'Subtítulo Opcional', type: 'text' },
            { name: 'layoutStyle', label: 'Estilo de Grid', type: 'select', options: ['editorial', 'staggered', 'mixed', 'masonry'] },
            { name: 'sourceCategory', label: 'Categoría de Productos a extraer', type: 'category_select' }
        ]
    },
    feature_text: {
        label: 'Texto Destacado (Feature Text)',
        fields: [
            { name: 'text', label: 'Texto', type: 'textarea' }
        ]
    },
    collection_list: {
        label: 'Lista de Colecciones',
        fields: [
            { name: 'title', label: 'Título Principal', type: 'text' },
            { name: 'col1_title', label: 'Título Col 1', type: 'text' },
            { name: 'col1_image', label: 'Imagen Col 1 (Opcional)', type: 'image' },
            { name: 'col1_link', label: 'Enlace Col 1', type: 'text' },
            { name: 'col2_title', label: 'Título Col 2', type: 'text' },
            { name: 'col2_image', label: 'Imagen Col 2 (Opcional)', type: 'image' },
            { name: 'col2_link', label: 'Enlace Col 2', type: 'text' }
        ]
    }
};

export default function PageBuilder() {
    const params = useParams();
    const pageId = params.id as string;
    
    const [modules, setModules] = useState<ModuleConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    
    useEffect(() => {
        const load = async () => {
            try {
                const catsSnap = await getDocs(collection(db, 'categories'));
                setCategories(catsSnap.docs.map(d => ({id: d.id, ...d.data()})));

                const docRef = doc(db, 'page_layouts', pageId);
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    setModules(snap.data().modules || []);
                } else if (pageId === 'home') {
                    // Seed for old cms
                    setModules([
                        { id: '1', type: 'hero', props: { heroLogoText: 'STUDIO K', heroTitle: 'Archive 01', heroSubtitle: 'Curated Selection' } },
                        { id: '2', type: 'manifesto', props: { manifestoSuper: 'AGENCY', manifestoTitle: 'Aloha State of Mind', manifestoDesc: 'Hybrid' } },
                        { id: '3', type: 'carousels', props: {} }
                    ]);
                }
            } catch (error) {
                console.error("Error loading page layout:", error);
            }
            setLoading(false);
        };
        load();
    }, [pageId]);
    
    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'page_layouts', pageId), { modules });
            alert('Guardado con éxito!');
        } catch(e) {
            console.error(e);
            alert('Error guardando');
        }
        setSaving(false);
    };
    
    const moveModule = (index: number, direction: 'up' | 'down') => {
        const newMods = [...modules];
        if (direction === 'up' && index > 0) {
            [newMods[index - 1], newMods[index]] = [newMods[index], newMods[index - 1]];
        } else if (direction === 'down' && index < newMods.length - 1) {
            [newMods[index + 1], newMods[index]] = [newMods[index], newMods[index + 1]];
        }
        setModules(newMods);
    };
    
    const deleteModule = (id: string) => {
        setModules(modules.filter(m => m.id !== id));
    };
    
    const addModule = (type: string) => {
        const mDef = MODULE_DEFINITIONS[type];
        const initialProps: Record<string, string> = {};
        mDef.fields.forEach(f => initialProps[f.name] = '');
        
        setModules([...modules, {
            // eslint-disable-next-line react-hooks/purity
            id: Date.now().toString(),
            type,
            props: initialProps
        }]);
    };
    
    const updateProp = (modId: string, field: string, val: string) => {
        setModules(modules.map(m => {
            if (m.id === modId) {
                return { ...m, props: { ...m.props, [field]: val } };
            }
            return m;
        }));
    };
    
    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500 w-8 h-8" /></div>;
    
    return (
        <div className="font-sans max-w-4xl pb-32">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/pages" className="text-gray-500 hover:text-gray-900"><ArrowLeft /></Link>
                <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Estructura: /{pageId}</h1>
                <button onClick={handleSave} disabled={saving} className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Guardar Cambios
                </button>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
                <h3 className="font-medium text-gray-900 mb-4">Añadir Módulo</h3>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(MODULE_DEFINITIONS).map(([type, def]) => (
                        <button key={type} onClick={() => addModule(type)} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1 border border-gray-200">
                            <Plus className="w-3 h-3" /> {def.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="space-y-4">
                {modules.map((mod, index) => {
                    const def = MODULE_DEFINITIONS[mod.type];
                    if (!def) return null;
                    return (
                        <div key={mod.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full">{index + 1}</span>
                                    <h3 className="font-medium text-gray-900">{def.label}</h3>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => moveModule(index, 'up')} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                                    <button onClick={() => moveModule(index, 'down')} disabled={index === modules.length - 1} className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                                    <button onClick={() => deleteModule(mod.id)} className="p-1.5 text-red-400 hover:text-red-600 ml-2"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            
                            {def.fields.length > 0 && (
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {def.fields.map(f => (
                                        <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{f.label}</label>
                                            {f.type === 'textarea' ? (
                                                <textarea 
                                                    value={mod.props[f.name] || ''} 
                                                    onChange={e => updateProp(mod.id, f.name, e.target.value)}
                                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows={3}
                                                />
                                            ) : f.type === 'image' ? (
                                                <ImageUpload
                                                    value={mod.props[f.name] || ''}
                                                    onChange={val => updateProp(mod.id, f.name, val)}
                                                    folder="page_images"
                                                    label={f.label}
                                                />
                                            ) : f.type === 'select' ? (
                                                <select
                                                    value={mod.props[f.name] || ''}
                                                    onChange={e => updateProp(mod.id, f.name, e.target.value)}
                                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">Selecciona...</option>
                                                    {f.options?.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : f.type === 'category_select' ? (
                                                <select
                                                    value={mod.props[f.name] || ''}
                                                    onChange={e => updateProp(mod.id, f.name, e.target.value)}
                                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="">Selecciona Categoría...</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={mod.props[f.name] || ''} 
                                                    onChange={e => updateProp(mod.id, f.name, e.target.value)}
                                                    className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                {modules.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                        Ningún módulo instalado. Añade módulos desde arriba.
                    </div>
                )}
            </div>
        </div>
    );
}
