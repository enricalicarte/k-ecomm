'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    gtmScript: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'cms', 'settings'));
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
        } else {
            // Check if it's in homepage and migrate it
            const docHomepage = await getDoc(doc(db, 'cms', 'homepage'));
            if (docHomepage.exists() && docHomepage.data().gtmScript) {
                setFormData(prev => ({ ...prev, gtmScript: docHomepage.data().gtmScript }));
            }
        }
      } catch (error) {
        console.error('Error fetching CMS Settings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'cms', 'settings'), formData, { merge: true });
      alert('Sincronización de configuración del sistema completada.');
    } catch (error) {
      console.error('Error saving settings', error);
      alert('Error actualizando las configuraciones del sistema.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500 p-10 font-sans text-sm">Obteniendo Configuración...</p>;

  return (
    <div className="max-w-4xl font-sans">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Configuración del Sistema</h1>
        <p className="text-sm text-gray-500 mt-1">
          Parámetros técnicos, integraciones y scripts globales.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Scripts y Tracking */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Analíticas y Google Tag Manager</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Google Tag Manager (Snippet o ID)</label>
                    <p className="text-sm text-gray-500 mb-4">Pega el snippet completo de GTM aquí (ej., &lt;script&gt;...&lt;/script&gt;) o simplemente el ID (ej. GTM-XXXXXXX). Dejar esto en blanco suspende la inyección.</p>
                    <textarea name="gtmScript" value={formData.gtmScript} onChange={handleChange} rows={6} className="w-full border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono" placeholder="<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->" />
                </div>
            </div>
        </div>

        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded text-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </button>
        </div>

      </form>
    </div>
  );
}
