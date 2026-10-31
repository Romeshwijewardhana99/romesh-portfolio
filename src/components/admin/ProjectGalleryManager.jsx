"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

export default function ProjectGalleryManager({ projectId, images = [] }) {
  const inputRef = useRef(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const [error, setError] = useState("");
  const pending = busy || refreshing;

  function refreshGallery() {
    startTransition(() => router.refresh());
  }

  async function uploadImages(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setBusy(true);
    setError("");

    try {
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch(`/api/admin/projects/${projectId}/images`, {
          method: "POST",
          body,
        });
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Unable to upload image.");
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
      refreshGallery();
    }
  }

  async function deleteImage(image) {
    if (!window.confirm("Delete this gallery image? This cannot be undone.")) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/images/${image.id}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to delete image.");
      }
      refreshGallery();
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">Project Gallery</h2>
          <p className="mt-1 text-sm text-neutral-500">
            JPG, PNG, WebP or AVIF · Max 8 MB per image
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5 disabled:opacity-50"
        >
          {pending ? <Loader2 size={17} className="animate-spin" /> : <ImagePlus size={17} />}
          {pending ? "Processing..." : "Add Images"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={uploadImages}
        disabled={pending}
        className="hidden"
        aria-label="Upload gallery images"
      />

      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}

      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-neutral-500">
          No gallery images yet. Add images to showcase this project.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
              <div className="relative aspect-video">
                <Image
                  src={image.imageUrl}
                  alt={image.altText || "Project gallery image"}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <p className="truncate text-xs text-neutral-500">{image.caption || "Gallery image"}</p>
                <button
                  type="button"
                  onClick={() => deleteImage(image)}
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
