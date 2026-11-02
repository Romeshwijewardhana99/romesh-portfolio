"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { markInquiryRead } from "@/actions/inquiries";

export default function InquiryReadMarker({ inquiryId }) {
  const router = useRouter();
  const started = useRef(null);
  useEffect(() => {
    if (started.current === inquiryId) return;
    started.current = inquiryId;
    markInquiryRead(inquiryId).then((result) => {
      if (result.success) router.refresh();
    }).catch(() => {});
  }, [inquiryId, router]);
  return null;
}
