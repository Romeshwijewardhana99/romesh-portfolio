"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

export default function CoverImageUploader({
  initialUrl = "",
  initialPublicId = "",
}) {
  const inputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [imagePublicId, setImagePublicId] = useState(initialPublicId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads/image", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed.");
      }

      setImageUrl(data.image.url);
      setImagePublicId(data.image.publicId);
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function removeImage() {
    setImageUrl("");
    setImagePublicId("");
  }

  return (
    <div>
      <input type="hidden" name="coverImage" value={imageUrl} />
      <input type="hidden" name="coverImagePublicId" value={imagePublicId} />

      {imageUrl ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          <div className="aspect-[16/9] overflow-hidden bg-black">
            <img
              src={imageUrl}
              alt="Project cover preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-neutral-400">Project cover</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm hover:bg-white/5"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={15} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] text-neutral-400 transition hover:border-white/30 hover:bg-white/[0.04]"
        >
          {uploading ? (
            <>
              <Loader2 size={26} className="animate-spin" />
              <span className="mt-3 text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus size={28} />
              <span className="mt-3 text-sm">Upload cover image</span>
              <span className="mt-1 text-xs text-neutral-600">
                JPG, PNG, WebP or AVIF · Max 8 MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={uploadImage}
        className="hidden"
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
