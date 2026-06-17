import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function ImageCropper({ imageSrc, onCrop, onCancel, circular = false, cropSize = 300 }) {
  const [zoom, setZoom] = reactExports.useState(1);
  const [offset, setOffset] = reactExports.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [dragStart, setDragStart] = reactExports.useState({ x: 0, y: 0 });
  const [removeBg, setRemoveBg] = reactExports.useState(false);
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (touch) {
      setIsDragging(true);
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };
  const handleTouchMove = (e) => {
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
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, cropSize, cropSize);
      const center = cropSize / 2;
      const scaleMultiplier = cropSize / 150;
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
      if (removeBg) {
        const imageData = ctx.getImageData(0, 0, cropSize, cropSize);
        const data = imageData.data;
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        for (let idx = 0; idx < data.length; idx += 4) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const distToBg = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
          const distToWhite = Math.sqrt((r - 255) ** 2 + (g - 255) ** 2 + (b - 255) ** 2);
          if (distToBg < 70 || distToWhite < 70) {
            data[idx] = 60;
            data[idx + 1] = 104;
            data[idx + 2] = 217;
            data[idx + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }
      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onCrop(croppedBase64);
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "space-y-4",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseUp,
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleMouseUp,
        className:
          "size-[300px] border border-border bg-slate-900 overflow-hidden relative cursor-move mx-auto rounded-lg select-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            style: {
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              backgroundImage: `url(${imageSrc})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            },
            className: "size-full absolute inset-0 pointer-events-none",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className:
              "absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: `size-[150px] border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] ${circular ? "rounded-full" : "rounded-lg"}`,
            }),
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
            className: "text-xs font-medium text-muted-foreground flex justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                children: ["Zoom: ", Math.round(zoom * 100), "%"],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                type: "button",
                onClick: () => {
                  setZoom(1);
                  setOffset({ x: 0, y: 0 });
                },
                className: "text-brand hover:underline",
                children: "Reset",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
            type: "range",
            min: "0.5",
            max: "3.0",
            step: "0.05",
            value: zoom,
            onChange: (e) => setZoom(parseFloat(e.target.value)),
            className: "w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-2 p-2 border border-border rounded-lg bg-secondary/30",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
            type: "checkbox",
            id: "removeBgCheck",
            checked: removeBg,
            onChange: (e) => setRemoveBg(e.target.checked),
            className: "rounded cursor-pointer",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
            htmlFor: "removeBgCheck",
            className: "text-xs font-medium select-none cursor-pointer",
            children: "Smart Chroma Key (Replace backdrop with blue)",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex gap-2 justify-end",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            type: "button",
            onClick: onCancel,
            className: "px-3 py-1.5 text-sm border border-border rounded-md hover:bg-secondary",
            children: "Cancel",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            type: "button",
            onClick: handleCrop,
            className:
              "px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md font-semibold",
            children: "Crop & Use",
          }),
        ],
      }),
    ],
  });
}
export { ImageCropper as I };
