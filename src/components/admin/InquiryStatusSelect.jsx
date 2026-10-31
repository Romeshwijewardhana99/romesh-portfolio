"use client";

import {
  useState,
  useTransition,
} from "react";
import {
  useRouter,
} from "next/navigation";

import {
  updateInquiryStatus,
} from "@/actions/inquiries";

export default function InquiryStatusSelect({
  inquiryId,
  initialStatus,
}) {
  const router = useRouter();

  const [
    status,
    setStatus,
  ] = useState(initialStatus);

  const [
    pending,
    startTransition,
  ] = useTransition();

  function handleChange(
    event
  ) {
    const nextStatus =
      event.target.value;

    setStatus(nextStatus);

    startTransition(
      async () => {
        const result =
          await updateInquiryStatus(
            inquiryId,
            nextStatus
          );

        if (!result.success) {
          setStatus(
            initialStatus
          );

          window.alert(
            "Unable to update status."
          );

          return;
        }

        router.refresh();
      }
    );
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={pending}
      className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm outline-none disabled:opacity-50"
    >
      <option value="NEW">
        New
      </option>

      <option value="READ">
        Read
      </option>

      <option value="REPLIED">
        Replied
      </option>

      <option value="CLOSED">
        Closed
      </option>
    </select>
  );
}