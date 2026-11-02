"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass = "mt-2 w-full rounded-xl border border-[#CFDDD1] bg-[#FAFCF9] px-4 py-3.5 text-sm text-[#183D2A] outline-none transition placeholder:text-[#94A398] focus:border-[#2A885A] focus:ring-3 focus:ring-[#2A885A]/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div role="alert" className="rounded-xl border border-[#EBC7C2] bg-[#FFF1EF] px-4 py-3 text-sm text-[#A3342D]">{error}</div>}
      <div>
        <label htmlFor="admin-email" className="block text-[13px] font-semibold text-[#375341]">Email address</label>
        <input
          id="admin-email" type="email" name="email" required autoComplete="email"
          value={email} onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com" className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-[13px] font-semibold text-[#375341]">Password</label>
        <div className="relative">
          <input
            id="admin-password" type={showPassword ? "text" : "password"} name="password" required
            autoComplete="current-password" value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${fieldClass} pr-12`} placeholder="Enter your password"
          />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((old) => !old)}
            className="absolute right-3 top-1/2 -translate-y-[37%] rounded-lg p-2 text-[#668275] hover:text-[#214D36]">
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#174734] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#276449] disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Signing in..." : "Sign in to CMS"}
        {!loading && <ArrowRight size={17} />}
      </button>
      <p className="text-center text-[11px] text-[#8A9B8F]">Administrator access only</p>
    </form>
  );
}
