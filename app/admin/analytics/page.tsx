'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const q = query(
          collection(db, 'analytics'),
          orderBy('timestamp', 'desc'),
          limit(500)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(data);
      } catch (err) {
        console.error('Error fetching analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <p className="text-gray-500 font-sans text-sm p-10">Cargando Analíticas...</p>;
  }

  // Derived metrics
  const pageViews = events.filter(e => e.type === 'page_view');
  const requestClicks = events.filter(e => e.type === 'email_click' || e.type === 'whatsapp_click');
  
  // Try to figure out most visited pages
  const viewsByPath: Record<string, number> = {};
  pageViews.forEach(v => {
    const path = v.path || '/';
    viewsByPath[path] = (viewsByPath[path] || 0) + 1;
  });
  
  const topPages = Object.entries(viewsByPath)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Group request clicks by product
  const reqByProduct: Record<string, number> = {};
  requestClicks.forEach(w => {
    const pName = w.metadata?.product || 'Unknown';
    reqByProduct[pName] = (reqByProduct[pName] || 0) + 1;
  });
  const topRequests = Object.entries(reqByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Group events by user (visitorId)
  const eventsByVisitor: Record<string, any[]> = {};
  events.forEach(e => {
      const vId = e.visitorId || 'Anonymous';
      if (!eventsByVisitor[vId]) eventsByVisitor[vId] = [];
      eventsByVisitor[vId].push(e);
  });
  
  // Sort visitors by their latest event timestamp
  const topVisitors = Object.entries(eventsByVisitor)
    .sort((a, b) => {
        const timeA = a[1][0]?.timestamp?.seconds || 0;
        const timeB = b[1][0]?.timestamp?.seconds || 0;
        return timeB - timeA;
    })
    .slice(0, 10);

  return (
    <div className="max-w-6xl font-sans">
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Analíticas y Tráfico</h1>
        <p className="text-sm text-gray-500 mt-1">
          Interacciones registradas (excluye visitas administrativas internas).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
           <h3 className="text-sm font-medium text-gray-500 mb-2">Visitas Generales</h3>
           <p className="text-3xl font-semibold text-gray-900">{pageViews.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
           <h3 className="text-sm font-medium text-gray-500 mb-2">Solicitudes Generadas</h3>
           <p className="text-3xl font-semibold text-gray-900">{requestClicks.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
           <h3 className="text-sm font-medium text-gray-500 mb-2">Eventos Totales</h3>
           <p className="text-3xl font-semibold text-gray-900">{events.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
           <div className="border-b border-gray-200 p-4 bg-gray-50">
               <h3 className="text-sm font-medium text-gray-900">Páginas más visitadas</h3>
           </div>
           <div className="divide-y divide-gray-200">
             {topPages.map(([path, qty], idx) => (
                <div key={idx} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-700 truncate max-w-[80%]">{path}</span>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{qty}</span>
                </div>
             ))}
             {topPages.length === 0 && <p className="p-4 text-sm text-gray-500 font-medium">Historial vacío.</p>}
           </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
           <div className="border-b border-gray-200 p-4 bg-gray-50">
               <h3 className="text-sm font-medium text-gray-900">Prendas con mayor demanda (Request)</h3>
           </div>
           <div className="divide-y divide-gray-200">
             {topRequests.map(([product, qty], idx) => (
                <div key={idx} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                    <span className="text-sm text-gray-700 truncate max-w-[80%]">{product}</span>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{qty}</span>
                </div>
             ))}
             {topRequests.length === 0 && <p className="p-4 text-sm text-gray-500 font-medium">No se encontraron solicitudes registradas.</p>}
           </div>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-8">
         <div className="border-b border-gray-200 p-4 bg-gray-50">
             <h3 className="text-sm font-medium text-gray-900">Sesiones Activas Estimadas</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="p-4 font-medium">Visitante</th>
                        <th className="p-4 font-medium">Interacciones Destacadas</th>
                        <th className="p-4 font-medium">Última Conexión</th>
                        <th className="p-4 font-medium">Inicio Sesión</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {topVisitors.map(([vId, visitorEvents], idx) => {
                        const firstEvent = visitorEvents[visitorEvents.length - 1];
                        const lastEvent = visitorEvents[0];
                        
                        const timeLast = lastEvent?.timestamp?.seconds 
                            ? new Date(lastEvent.timestamp.seconds * 1000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
                            : 'Reciente';
                        const timeFirst = firstEvent?.timestamp?.seconds 
                            ? new Date(firstEvent.timestamp.seconds * 1000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
                            : 'Descocido';

                        return (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-sm text-gray-600 font-mono">
                                    {vId.startsWith('v_') ? vId.slice(0, 8) + '...' : vId}
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    <div className="flex flex-col gap-2 max-w-xs max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                        {visitorEvents.slice(0, 5).map((e: any, eIdx: number) => (
                                            <div key={eIdx} className="flex gap-3 items-center">
                                                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${e.type === 'whatsapp_click' || e.type === 'email_click' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {e.type}
                                                </span>
                                                <span className="truncate text-gray-500 max-w-[150px]" title={e.path}>{e.path}</span>
                                            </div>
                                        ))}
                                        {visitorEvents.length > 5 && <span className="text-xs text-gray-400 mt-1">...y {visitorEvents.length - 5} acciones adicionales</span>}
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{timeLast}</td>
                                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{timeFirst}</td>
                            </tr>
                        );
                    })}
                    {topVisitors.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-sm text-center text-gray-500 bg-gray-50">No hay sesiones activas.</td>
                        </tr>
                    )}
                </tbody>
             </table>
         </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
         <div className="border-b border-gray-200 p-4 bg-gray-50">
             <h3 className="text-sm font-medium text-gray-900">Historial (15 eventos más recientes)</h3>
         </div>
         <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                        <th className="p-4 font-medium">Marcador</th>
                        <th className="p-4 font-medium">Visitante</th>
                        <th className="p-4 font-medium">Acción</th>
                        <th className="p-4 font-medium">Destino / Item</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {events.slice(0, 15).map((e, idx) => {
                        const dateStr = e.timestamp?.seconds 
                            ? new Date(e.timestamp.seconds * 1000).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
                            : 'Reciente';
                        return (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-500 whitespace-nowrap">{dateStr}</td>
                                <td className="p-4 text-gray-600 font-mono">
                                    {e.visitorId ? (e.visitorId.startsWith('v_') ? e.visitorId.slice(0, 8) : e.visitorId) : '-'}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${e.type === 'whatsapp_click' || e.type === 'email_click' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {e.type}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-900 font-medium max-w-sm truncate">
                                    {e.metadata?.product ? `${e.metadata.product}` : e.path}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
             </table>
         </div>
      </div>
    </div>
  );
}
