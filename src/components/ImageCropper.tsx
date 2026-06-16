import { useState } from "react";
import { Sparkles } from "lucide-react";

interface CropperProps {
  imageSrc: string;
  onCrop: (base64: string) => void;
  onCancel: () => void;
  circular?: boolean;
  cropSize?: number; // Output dimensions, defaults to 300 (high-res 300x300)
}

export function ImageCropper({
  imageSrc,
  onCrop,
  onCancel,
  circular = false,
  cropSize = 300,
}: CropperProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [removeBg, setRemoveBg] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setIsDragging(true);
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (touch) {
      setOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    }
  };

  const handleCrop = () => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropSize;
      canvas.height = cropSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Initial fill white
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cropSize, cropSize);

      const center = cropSize / 2;
      const scaleMultiplier = cropSize / 150; // The UI crop area is 150px

      ctx.save();
      ctx.translate(center, center);
      ctx.scale(zoom, zoom);
      ctx.translate((offset.x * scaleMultiplier) / zoom, (offset.y * scaleMultiplier) / zoom);

      const maxDim = Math.max(img.width, img.height);
      const initialScale = (200 * scaleMultiplier) / maxDim;
      const drawW = img.width * initialScale;
      const drawH = img.height * initialScale;

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      // smart background removal option (Chroma key backdrop replacement)
      if (removeBg) {
        const imageData = ctx.getImageData(0, 0, cropSize, cropSize);
        const data = imageData.data;

        // Use top-left pixel color as chroma key backdrop color
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        for (let idx = 0; idx < data.length; idx += 4) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const distToBg = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
          const distToWhite = Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2);

          // Threshold 70 is standard keying threshold
          if (distToBg < 70 || distToWhite < 70) {
            // Replace background pixels with professional card blue (#3c68d9)
            data[idx] = 60;     // R
            data[idx + 1] = 104; // G
            data[idx + 2] = 217; // B
            data[idx + 3] = 255; // Alpha
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onCrop(croppedBase64);
    };
  };

  return (
    <div className="space-y-4">
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="size-[300px] border border-border bg-slate-900 overflow-hidden relative cursor-move mx-auto rounded-lg select-none"
      >
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="size-full absolute inset-0 pointer-events-none"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
          <div
            className={`size-[150px] border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] ${
              circular ? "rounded-full" : "rounded-lg"
            }`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground flex justify-between">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setOffset({ x: 0, y: 0 });
            }}
            className="text-brand hover:underline"
          >
            Reset
          </button>
        </label>
        <input
          type="range"
          min="0.5"
          max="3.0"
          step="0.05"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-secondary/30">
        <input
          type="checkbox"
          id="removeBgCheck"
          checked={removeBg}
          onChange={(e) => setRemoveBg(e.target.checked)}
          className="rounded cursor-pointer"
        />
        <label htmlFor="removeBgCheck" className="text-xs font-medium select-none cursor-pointer">
          Smart Chroma Key (Replace backdrop with blue)
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCrop}
          className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md font-semibold"
        >
          Crop & Use
        </button>
      </div>
    </div>
  );
}
