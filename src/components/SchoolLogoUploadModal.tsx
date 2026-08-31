import React, { useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { updateSchoolLogoServer } from "@/lib/platform.functions";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  RefreshCw,
  Camera,
  Link2,
  Trash2,
} from "lucide-react";

interface SchoolLogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  currentLogoUrl?: string | null;
  schoolName: string;
  onLogoUpdated: (newLogoUrl: string | null) => void;
}

export function SchoolLogoUploadModal({
  isOpen,
  onClose,
  schoolId,
  currentLogoUrl,
  schoolName,
  onLogoUpdated,
}: SchoolLogoUploadModalProps) {
  const updateLogoFn = useServerFn(updateSchoolLogoServer);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const [customUrl, setCustomUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUrlChange = (val: string) => {
    setCustomUrl(val);
    if (val.trim()) {
      setPreviewUrl(val.trim());
    } else {
      setPreviewUrl(currentLogoUrl || null);
    }
  };

  const handleSaveLogo = async () => {
    if (!schoolId) {
      toast.error("School ID is missing.");
      return;
    }

    setUploading(true);
    try {
      let finalLogoUrl: string | null = null;

      if (activeTab === "upload" && selectedFile) {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        const res = await updateLogoFn({
          data: {
            school_id: schoolId,
            logo_data_base64: base64Data,
            content_type: selectedFile.type || "image/png",
          },
        });

        finalLogoUrl = res.logo_url;
      } else if (activeTab === "url") {
        const res = await updateLogoFn({
          data: {
            school_id: schoolId,
            logo_url: customUrl.trim() || undefined,
          },
        });
        finalLogoUrl = res.logo_url;
      }

      toast.success("School logo updated successfully!");
      onLogoUpdated(finalLogoUrl);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update school logo.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    if (!confirm("Are you sure you want to remove the school logo?")) return;

    setUploading(true);
    try {
      await updateLogoFn({
        data: {
          school_id: schoolId,
          remove_logo: true,
        },
      });

      toast.success("School logo removed.");
      onLogoUpdated(null);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove logo.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Camera className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Update School Logo</h3>
              <p className="text-xs text-muted-foreground truncate max-w-[240px]">{schoolName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Preview Box */}
          <div className="flex flex-col items-center justify-center p-6 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="School Logo Preview"
                  className="size-24 rounded-2xl object-cover border border-border shadow-md"
                  onError={() => {
                    toast.error("Failed to load image from URL.");
                    setPreviewUrl(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                  title="Change Image"
                >
                  <Camera className="size-5" />
                </button>
              </div>
            ) : (
              <div className="size-24 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl shadow-inner border border-primary/20">
                {schoolName ? schoolName.charAt(0).toUpperCase() : "S"}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3 font-medium">
              {previewUrl ? "Logo Preview" : "No logo uploaded (using letter badge)"}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-muted p-1 border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === "upload"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload className="size-3.5" />
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === "url"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Link2 className="size-3.5" />
              Image URL
            </button>
          </div>

          {/* Tab 1: Upload File */}
          {activeTab === "upload" && (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground font-semibold text-xs flex items-center justify-center gap-2 transition shadow-sm"
              >
                <ImageIcon className="size-4 text-primary" />
                {selectedFile ? selectedFile.name : "Choose Logo File (PNG, JPG, WebP, SVG)"}
              </button>
              <p className="text-[11px] text-muted-foreground text-center mt-1.5">
                Recommended: Square image 512x512px with transparent background.
              </p>
            </div>
          )}

          {/* Tab 2: URL Input */}
          {activeTab === "url" && (
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Direct Image Link
              </label>
              <input
                type="url"
                placeholder="https://example.com/school-logo.png"
                value={customUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          {currentLogoUrl ? (
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={uploading}
              className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <Trash2 className="size-3.5" />
              Remove
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveLogo}
              disabled={uploading}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              {uploading ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  Save Logo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
