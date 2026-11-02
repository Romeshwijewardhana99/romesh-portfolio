"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/actions/inquiries";

export default function InquiryStatusSelect({ inquiryId, initialStatus }) {
  const router = useRouter();
  const [status, setStatus] = useOptimistic(initialStatus);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function change(event) {
    const nextStatus = event.target.value;
    setError("");
    startTransition(async () => {
      setStatus(nextStatus);
      try {
        const result = await updateInquiryStatus(inquiryId, nextStatus);
        if (!result.success) { setError(result.message || "Unable to update status."); return; }
        router.refresh();
      } catch { setError("Unable to update status. Please try again."); }
    });
  }

  return (
    <div>
      <label htmlFor={`inquiry-status-${inquiryId}`} className="sr-only">Inquiry status</label>
      <select id={`inquiry-status-${inquiryId}`} value={status} onChange={change} disabled={pending}
        aria-busy={pending} className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm outline-none disabled:opacity-50">
        <option value="NEW">New</option>
        <option value="READ">{initialStatus === "CLOSED" ? "Reopen / Read" : "Mark Read"}</option>
        <option value="REPLIED">Mark Replied</option>
        <option value="CLOSED">Close Inquiry</option>
      </select>
      {error && <p role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
