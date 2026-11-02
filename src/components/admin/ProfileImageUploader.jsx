"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Loader2, Trash2 } from "lucide-react";

export default function ProfileImageUploader({ initialUrl = "" }) {
  const inputRef = useRef(null);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/settings/profile-image", { method: "POST", body });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to upload profile image.");
      setImageUrl(data.image.url);
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (!window.confirm("Remove your profile image?")) return;
    setUploading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/settings/profile-image", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to remove profile image.");
      setImageUrl("");
      router.refresh();
    } catch (error) { setError(error.message); }
    finally { setUploading(false); }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          {imageUrl ? <Image src={imageUrl} alt="Profile preview" fill unoptimized sizes="128px" className="object-cover" />
            : <div className="flex h-full items-center justify-center text-neutral-600"><Camera size={28} /></div>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm disabled:opacity-50">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            {uploading ? "Uploading..." : imageUrl ? "Replace Image" : "Upload Image"}
          </button>
          {imageUrl && <button type="button" disabled={uploading} onClick={remove}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400 disabled:opacity-50"><Trash2 size={16} />Remove</button>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading}
        onChange={upload} className="hidden" aria-label="Select profile image" />
      <p className="text-xs text-neutral-500">Max 8 MB. Images are saved immediately and resized to fit 1200 ? 1200.</p>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
