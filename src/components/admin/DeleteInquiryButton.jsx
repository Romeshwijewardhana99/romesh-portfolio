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
  deleteInquiry,
} from "@/actions/inquiries";

export default function DeleteInquiryButton({
  inquiryId,
  clientName,
}) {
  const router =
    useRouter();

  const [
    pending,
    startTransition,
  ] = useTransition();

  function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete inquiry from "${clientName}"?\n\nThis cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    startTransition(
      async () => {
        const result =
          await deleteInquiry(
            inquiryId
          );

        if (!result.success) {
          window.alert(
            "Unable to delete inquiry."
          );

          return;
        }

        router.replace(
          "/admin/inquiries"
        );

        router.refresh();
      }
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      <Trash2 size={16} />

      {pending
        ? "Deleting..."
        : "Delete Inquiry"}
    </button>
  );
}