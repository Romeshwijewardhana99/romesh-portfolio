"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteService } from "@/actions/services";

export default function DeleteServiceButton({ serviceId, serviceTitle }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm(`Delete "${serviceTitle}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteService(serviceId);

        if (!result.success) {
          window.alert("Unable to delete service.");
          return;
        }

        router.refresh();
      } catch {
        window.alert("Unable to delete service.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={15} />
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
