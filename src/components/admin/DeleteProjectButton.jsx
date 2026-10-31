"use client";

import {
  useTransition,
} from "react";
import {
  useRouter,
} from "next/navigation";
import {
  Trash2,
} from "lucide-react";

import {
  deleteProject,
} from "@/actions/projects";

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}) {
  const router = useRouter();

  const [
    pending,
    startTransition,
  ] = useTransition();

  function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete "${projectTitle}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    startTransition(
      async () => {
        const result =
          await deleteProject(
            projectId
          );

        if (!result.success) {
          window.alert(
            "Unable to delete project."
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
      disabled={pending}
      onClick={handleDelete}
      className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={15} />

      {pending
        ? "Deleting..."
        : "Delete"}
    </button>
  );
}