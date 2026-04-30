export default function AdminSalesPage() {
  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Transacciones y Manifiestos</h1>
          <p className="text-sm text-gray-500 mt-1">Logística y procesamiento de pagos.</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Pendiente Inicialización del Módulo</h2>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Protocolos de transacciones actualmente en establecimiento. La conexión a un portal seguro a través de <strong>Stripe</strong> se implementará próximamente para manejar actualizaciones de transferencias y libros contables.
        </p>
      </div>
    </div>
  );
}
