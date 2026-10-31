"use client";

import {
  useTransition,
} from "react";
import {
  useRouter,
} from "next/navigation";
import { Trash2 } from "lucide-react";

import {
  deleteTechnology,
} from "@/actions/technologies";

export default function DeleteTechnologyButton({
  technologyId,
  technologyName,
}) {
  const router = useRouter();

  const [
    pending,
    startTransition,
  ] = useTransition();

  function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete "${technologyName}"?\n\nIt will also be removed from assigned projects.`
      );

    if (!confirmed) return;

    startTransition(
      async () => {
        const result =
          await deleteTechnology(
            technologyId
          );

        if (!result.success) {
          window.alert(
            "Unable to delete technology."
          );

          return;
        }

        router.refresh();
      }
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={15} />

      {pending
        ? "Deleting..."
        : "Delete"}
    </button>
  );
}
