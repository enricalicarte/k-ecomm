import { useState, useRef } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UploadCloud, Loader2, Image as ImageIcon, X, Check } from 'lucide-react';
import MediaRenderer from '@/components/MediaRenderer';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({ value, onChange, folder = 'uploads', label = 'Imagen' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFilename, setCustomFilename] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Solo se permiten archivos de imagen y video.');
      return;
    }

    setSelectedFile(file);
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setCustomFilename(nameWithoutExt);
    setError(null);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
      const safeCustomName = customFilename.trim() || 'imagen';
      const cleanCustomName = safeCustomName.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      // Append a small timestamp just to avoid accidental overwrites if desired, or let them overwrite.
      // Easiest is to let them overwrite if they use the exact same name, as they want to edit the file name.
      const filename = `${cleanCustomName}${ext}`;
      
      const storageRef = ref(storage, `${folder}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      // Add a timeout to detect hanging uploads
      const timeoutId = setTimeout(() => {
        if (uploadTask.snapshot.bytesTransferred === 0) {
           setError('Tiempo de espera agotado. Es probable que Firebase Storage no esté activado.');
           setIsUploading(false);
           uploadTask.cancel();
        }
      }, 15000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error("Upload error:", error);
          if (error.code === 'storage/unauthorized' || error.message.includes('unauthorized') || error.message.includes('permission')) {
             setError('Firebase Storage no tiene reglas configuradas para permitir subidas. Ve a la consola de Firebase: Build > Storage > Rules y configúralo.');
          } else if (error.code === 'storage/unknown' || error.message.includes('not configured')) {
             setError('Firebase Storage no está inicializado. Ve a Firebase Console, Storage y dale a "Get Started".');
          } else {
             setError(`Error al subir: ${error.message}`);
          }
          setIsUploading(false);
        },
        async () => {
          clearTimeout(timeoutId);
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadURL);
          setSelectedFile(null);
          setIsUploading(false);
          setProgress(0);
        }
      );
    } catch (err) {
      console.error(err);
      setError('Error inesperado al preparar la subida.');
      setIsUploading(false);
    }
  };

  const handleCancelFile = () => {
    setSelectedFile(null);
    setCustomFilename('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">{label}</label>

      {value ? (
        <div className="relative border border-gray-200 rounded-sm overflow-hidden bg-gray-50 group h-48">
          <MediaRenderer src={value} alt="Uploaded" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              type="button" 
              onClick={handleRemove}
              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
              title="Eliminar imagen"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : selectedFile ? (
        <div className="border border-gray-200 rounded-sm p-4 bg-gray-50">
           {isUploading ? (
             <div className="flex flex-col items-center justify-center h-24">
               <Loader2 size={32} className="animate-spin text-[#6B7A3D] mb-4" />
               <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                 <div className="bg-[#6B7A3D] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
               </div>
               <span className="text-xs text-gray-500 mt-2 font-mono">{Math.round(progress)}%</span>
             </div>
           ) : (
             <div className="flex flex-col gap-4">
               <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-16 h-16 object-cover rounded-sm border border-gray-200" />
                  <div className="flex-grow">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">Nombre del archivo (sin extensión)</label>
                    <input 
                      type="text" 
                      value={customFilename} 
                      onChange={(e) => setCustomFilename(e.target.value)}
                      className="w-full border border-gray-200 p-2 text-sm focus:border-[#6B7A3D] outline-none rounded-sm"
                    />
                  </div>
               </div>
               <div className="flex items-center justify-end gap-2">
                 <button 
                   type="button" 
                   onClick={handleCancelFile}
                   className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="button" 
                   onClick={handleConfirmUpload}
                   className="flex items-center gap-1 px-4 py-2 bg-[#6B7A3D] text-white text-xs font-semibold rounded-sm hover:bg-[#5a6733] transition"
                 >
                   <Check size={14} /> Subir Imagen
                 </button>
               </div>
             </div>
           )}
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-300 rounded-sm p-6 text-center cursor-pointer hover:border-[#6B7A3D] hover:bg-gray-50 transition-all ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center justify-center h-24">
            <UploadCloud size={32} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">Haz clic para seleccionar un archivo</span>
            <span className="text-xs text-gray-400 mt-1">PNG, JPG, MP4, WEBP</span>
          </div>
        </div>
      )}
      
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*,video/*" 
        className="hidden" 
      />
      
      {/* Hidden input to pass generic URLs if needed later alongside this */}
      <div className="mt-4 border-t border-gray-200 pt-4">
          <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">O pegar una URL directamente (YouTube, Vimeo, etc.)</label>
          <input 
            type="url" 
            placeholder="https://..." 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            disabled={isUploading || !!selectedFile}
            className="w-full border border-gray-200 p-2 text-xs focus:border-charcoal outline-none rounded-sm transition-colors" 
          />
      </div>
    </div>
  );
}
