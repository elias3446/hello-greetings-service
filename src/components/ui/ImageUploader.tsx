import React, { useRef, useState } from 'react';
import { FileImage, Camera, Repeat } from 'lucide-react';

interface ImageUploaderProps {
  images: File[];
  setImages: (images: File[]) => void;
  maxImages?: number;
}

const isMobile = () => {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, setImages, maxImages = 3 }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cameraMode, setCameraMode] = useState<'environment' | 'user'>('environment');
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (images.length + files.length > maxImages) {
      setInfoMsg(`Solo puedes subir hasta ${maxImages} imágenes.`);
      return;
    }
    setImages([...images, ...files].slice(0, maxImages));
    setInfoMsg(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (images.length + files.length > maxImages) {
      setInfoMsg(`Solo puedes subir hasta ${maxImages} imágenes.`);
      return;
    }
    setImages([...images, ...files].slice(0, maxImages));
    setInfoMsg(null);
  };

  const handleOpenFileDialog = () => {
    if (inputRef.current) {
      // Cambia el atributo capture según el modo de cámara
      if (isMobile()) {
        inputRef.current.setAttribute('capture', cameraMode);
      } else {
        inputRef.current.removeAttribute('capture');
      }
      inputRef.current.click();
    }
  };

  const handleRemove = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
    setInfoMsg(null);
  };

  return (
    <div>
      <label className="block mb-1 font-medium">Images <span className="text-muted-foreground">(Optional)</span></label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 dark:border-gray-700 dark:bg-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition min-h-[120px] relative"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={handleOpenFileDialog}
        style={{ background: '#fcfcfd' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={images.length >= maxImages}
        />
        {images.length === 0 && (
          <>
            <FileImage className="w-10 h-10 text-gray-400 mb-2" />
            <div className="text-gray-500 text-sm mb-1">Upload images (max {maxImages})</div>
          </>
        )}
        {isMobile() && (
          <button
            type="button"
            className="flex items-center gap-1 text-primary text-xs border border-primary rounded px-2 py-1 mt-2 hover:bg-primary/10"
            onClick={e => { e.stopPropagation(); setCameraMode(cameraMode === 'environment' ? 'user' : 'environment'); }}
            disabled={images.length >= maxImages}
            title={cameraMode === 'environment' ? 'Switch to front camera' : 'Switch to back camera'}
          >
            <Repeat className="w-4 h-4" />
            {cameraMode === 'environment' ? 'Back Camera' : 'Front Camera'}
          </button>
        )}
        {images.length > 0 && (
          <div className="absolute left-0 right-0 bottom-2 flex justify-center gap-2 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`img-${idx}`}
                  className="w-24 h-24 object-cover rounded-lg border shadow-md"
                  style={{ width: 96, height: 96 }}
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-80 group-hover:opacity-100 shadow"
                  onClick={e => { e.stopPropagation(); handleRemove(idx); }}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {infoMsg && (
        <div className="text-xs text-blue-600 mt-2 text-center">{infoMsg}</div>
      )}
    </div>
  );
};

export default ImageUploader; 