"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

export default function CoverImageUploader({ projectId, initialUrl = "" }) {
  const inputRef = useRef(null);
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const [error, setError] = useState("");
  const pending = busy || refreshing;

  async function changeCover(method, file) {
    if (!projectId) return;
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      if (file) body.append("file", file);
      const response = await fetch(`/api/admin/projects/${projectId}/cover`, {
        method,
        ...(method === "POST" ? { body } : {}),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || "Unable to update cover image.");
      setImageUrl(method === "POST" ? data.url : "");
      startTransition(() => router.refresh());
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (!projectId) return <p className="text-sm text-neutral-400">Create the project before uploading images.</p>;

  return (
    <div className="space-y-3">
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          <Image src={imageUrl} alt="Project cover preview" fill unoptimized sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm hover:bg-white/5 disabled:opacity-50">
          {pending ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          {pending ? "Processing..." : imageUrl ? "Replace Cover" : "Upload Cover Image"}
        </button>
        {imageUrl && (
          <button type="button" disabled={pending} onClick={() => {
            if (window.confirm("Remove this cover image?")) changeCover("DELETE");
          }} className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50">
            <Trash2 size={16} /> Remove
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" disabled={pending}
        aria-label="Select project cover image" onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) changeCover("POST", file);
        }} />
      <p className="text-xs text-neutral-500">JPG, PNG, WebP or AVIF ? Max 8 MB. Cover changes are saved immediately.</p>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
