"use client";

import { useId, useRef, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

const emptyState = { ok: false, message: "", errors: {} };
const inputClass = "w-full rounded-xl border border-neutral-300 bg-transparent px-4 py-3 outline-none transition focus:border-neutral-900 dark:border-white/10 dark:focus:border-white/40";

export default function ProjectInquiryForm({ services = [] }) {
  const prefix = useId();
  const formRef = useRef(null);
  const submitting = useRef(false);
  const [state, setState] = useState(emptyState);
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    try {
      const input = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch("/api/inquiries", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input),
      });
      const result = await response.json();
      setState({ ok: response.ok && result.ok, message: result.message || "Unable to send your inquiry.", errors: result.errors || {} });
      if (response.ok && result.ok) formRef.current?.reset();
    } catch {
      setState({ ...emptyState, message: "Unable to send your inquiry right now. Please try again." });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  function fieldError(name) {
    return state.errors?.[name]?.[0];
  }

  function errorText(name) {
    return fieldError(name) ? <p id={`${prefix}-${name}-error`} className="mt-1 text-sm text-red-500">{fieldError(name)}</p> : null;
  }

  const selects = [
    { name: "service", label: "What do you need?", options: [
      ["", "Select a service"], ...services.map((service) => [service.title, service.title]), ["Other", "Other / Not sure"],
    ] },
    { name: "budget", label: "Estimated Budget", options: [
      ["", "Not sure yet"], ["Under $500", "Under $500"], ["$500 - $1,000", "$500 ? $1,000"],
      ["$1,000 - $3,000", "$1,000 ? $3,000"], ["$3,000+", "$3,000+"],
    ] },
    { name: "timeline", label: "Timeline", options: [
      ["", "Flexible / Not sure"], ["As soon as possible", "As soon as possible"], ["Within 1 month", "Within 1 month"],
      ["1 - 3 months", "1?3 months"], ["3+ months", "3+ months"],
    ] },
  ];

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-busy={pending} className="space-y-6">
      {state.message && <div role={state.ok ? "status" : "alert"} className={`flex gap-3 rounded-2xl border px-5 py-4 text-sm ${state.ok ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"}`}>
        {state.ok && <CheckCircle2 size={20} className="shrink-0" />}{state.message}
      </div>}
      <div className="hidden" aria-hidden="true">
        <label htmlFor={prefix + "-website"}>Website</label>
        <input id={prefix + "-website"} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <fieldset disabled={pending} className="space-y-6 disabled:opacity-70">
        <legend className="sr-only">Project inquiry details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { name: "name", label: "Your Name", required: true, max: 100, autoComplete: "name" },
            { name: "email", label: "Email", required: true, type: "email", max: 190, autoComplete: "email" },
            { name: "phone", label: "Phone", type: "tel", max: 30, autoComplete: "tel" },
            { name: "company", label: "Company / Organization", max: 120, autoComplete: "organization" },
          ].map((field) => <div key={field.name}>
            <label htmlFor={`${prefix}-${field.name}`} className="mb-2 block text-sm">{field.label}{field.required ? " *" : ""}</label>
            <input id={`${prefix}-${field.name}`} name={field.name} type={field.type || "text"} required={field.required}
              maxLength={field.max} autoComplete={field.autoComplete} className={inputClass}
              aria-invalid={!!fieldError(field.name)} aria-describedby={fieldError(field.name) ? `${prefix}-${field.name}-error` : undefined} />
            {errorText(field.name)}
          </div>)}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {selects.map((field) => <div key={field.name} className={field.name === "service" ? "sm:col-span-2" : ""}>
            <label htmlFor={`${prefix}-${field.name}`} className="mb-2 block text-sm">{field.label}</label>
            <select id={`${prefix}-${field.name}`} name={field.name} defaultValue="" className={inputClass + " dark:bg-neutral-950"}
              aria-invalid={!!fieldError(field.name)} aria-describedby={fieldError(field.name) ? `${prefix}-${field.name}-error` : undefined}>
              {field.options.map(([value, label], index) => <option key={value + index} value={value}>{label}</option>)}
            </select>
            {errorText(field.name)}
          </div>)}
        </div>
        <div>
          <label htmlFor={prefix + "-message"} className="mb-2 block text-sm">Project Description *</label>
          <textarea id={prefix + "-message"} name="message" required minLength={20} maxLength={5000} rows={7}
            placeholder="What are you trying to build? What problem should it solve?" className={inputClass + " resize-none"}
            aria-invalid={!!fieldError("message")} aria-describedby={prefix + "-message-hint" + (fieldError("message") ? " " + prefix + "-message-error" : "")} />
          <p id={prefix + "-message-hint"} className="mt-1 text-xs text-neutral-500">20?5,000 characters.</p>
          {errorText("message")}
        </div>
        <button type="submit" disabled={pending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-6 py-3.5 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-200 sm:w-auto">
          <Send size={17} />{pending ? "Sending..." : "Send Project Inquiry"}
        </button>
      </fieldset>
    </form>
  );
}
