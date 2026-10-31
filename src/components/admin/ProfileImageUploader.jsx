"use client";

import {
  useRef,
  useState,
} from "react";

import {
  Camera,
  Loader2,
  Trash2,
} from "lucide-react";

export default function ProfileImageUploader({
  initialUrl = "",
  initialPublicId = "",
}) {
  const inputRef =
    useRef(null);

  const [
    imageUrl,
    setImageUrl,
  ] = useState(initialUrl);

  const [
    publicId,
    setPublicId,
  ] = useState(
    initialPublicId
  );

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  async function handleUpload(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "/api/admin/uploads/profile",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Upload failed."
        );
      }

      setImageUrl(
        data.image.url
      );

      setPublicId(
        data.image.publicId
      );
    } catch (error) {
      setError(
        error.message
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value =
          "";
      }
    }
  }

  function removeImage() {
    setImageUrl("");
    setPublicId("");
  }

  return (
    <div>
      <input
        type="hidden"
        name="profileImage"
        value={imageUrl}
      />

      <input
        type="hidden"
        name="profileImagePublicId"
        value={publicId}
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-600">
              <Camera size={28} />
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black disabled:opacity-50"
            >
              {uploading ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Camera
                  size={16}
                />
              )}

              {imageUrl
                ? "Replace Image"
                : "Upload Image"}
            </button>

            {imageUrl && (
              <button
                type="button"
                onClick={
                  removeImage
                }
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2
                  size={16}
                />

                Remove
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            JPG, PNG, WebP or AVIF.
            Maximum 5 MB.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={
          handleUpload
        }
        className="hidden"
      />

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}