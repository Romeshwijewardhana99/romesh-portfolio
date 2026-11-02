
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

import {
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  MapPin,
} from "lucide-react";

export default function Hero({ settings }) {
  const title =
    settings?.heroTitle ||
    "I build modern digital products that solve real business problems.";

  const subtitle =
    settings?.heroSubtitle ||
    "Full-stack developer creating modern web applications, business systems and reliable digital solutions.";

  const profileImage =
    settings?.profileImage || null;

  const available =
    settings?.availableForWork ?? true;

  return (
    <section
      className="relative isolate overflow-hidden bg-[#080E0C] text-white"
    >
      {/* SOFT EMERALD ATMOSPHERE */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_33%_53%,rgba(24,75,54,0.48)_0%,rgba(11,34,26,0.18)_43%,transparent_75%)]"
      />

      {/* SECONDARY LIGHT */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-250px] right-[-200px] h-[650px] w-[650px] rounded-full bg-[#194F38]/20 blur-[130px]"
      />

      <div
        className="relative mx-auto flex min-h-[680px] max-w-[1320px] flex-col justify-center px-6 pt-20 sm:px-8 lg:min-h-[740px] lg:px-12 lg:py-24"
      >
        {/* LEFT CONTENT */}
        <div className="relative z-20 w-full pb-6 lg:w-[55%] lg:pb-0">

          {/* AVAILABILITY */}
          {available && (
            <div className="mb-8 inline-flex items-center gap-2.5 text-xs font-medium text-[#BDE4CA]">
              <span className="h-2 w-2 rounded-full bg-[#85DBA5]" />

              {settings?.heroBadge ||
                "Available for freelance projects"}
            </div>
          )}

          {/* INTRO */}
          <p className="mb-3 text-sm font-medium text-[#94C8AA]">
            Hello,
          </p>

          <p className="mb-5 text-sm font-medium text-[#D9E9DF]">
            I&apos;m Romesh Wijewardhana
          </p>

          {/* HEADLINE */}
          <h1
            className="max-w-[700px] text-[clamp(3.1rem,5.4vw,5.5rem)] font-semibold leading-[1.06] tracking-[-0.065em] text-white"
          >
            {title}
          </h1>

          {/* DESCRIPTION */}
          <p
            className="mt-7 max-w-[530px] text-base leading-[1.85] text-[#C3D7C9] sm:text-lg"
          >
            {subtitle}
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#D9F2E0] px-7 py-3.5 text-sm font-semibold text-[#143E2A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Let&apos;s Work Together
              <ArrowUpRight size={17} />
            </Link>

            <Link
              href="/projects"
              className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white hover:bg-white/10"
            >
              Explore My Work
              <ArrowDownRight size={17} />
            </Link>
          </div>

          {/* PROFESSIONAL LINKS */}
          {(settings?.githubUrl ||
            settings?.resumeUrl) && (
            <div className="mt-8 flex flex-wrap items-center gap-6">
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#B9D1C1] transition hover:text-white"
                >
                  <FaGithub size={16} />
                  GitHub
                  <ArrowUpRight size={13} />
                </a>
              )}

              {settings?.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#B9D1C1] transition hover:text-white"
                >
                  <FileText size={16} />
                  View Resume
                  <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          )}

          {/* SPECIALIZATION */}
          <div className="mt-11 flex flex-wrap gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-xs font-medium text-[#AFCBB8]">
            <span>Web Applications</span>
            <span>Business Systems</span>
            <span>Full-Stack Engineering</span>
          </div>

          {settings?.location && (
            <p className="mt-5 flex items-center gap-2 text-xs text-[#96B5A2]">
              <MapPin size={14} />
              {settings.location}
            </p>
          )}
        </div>

        {/* RIGHT SIDE - LARGE BLENDED PORTRAIT */}
        <div
          className="pointer-events-none relative order-last mt-6 h-[420px] w-full overflow-hidden sm:h-[500px] lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:h-full lg:w-[56%]"
          aria-hidden="true"
        >
          {/* LIGHT BEHIND PORTRAIT */}
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_55%,rgba(32,87,60,0.30),transparent_70%)]"
          />

          {profileImage ? (
            <Image
              src={profileImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1023px) 90vw, 56vw"
              className="object-cover object-[center_20%] grayscale brightness-[0.90] contrast-[1.15]"
              style={{
                maskImage:
                  "radial-gradient(ellipse 78% 90% at 55% 46%, black 40%, transparent 95%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 78% 90% at 55% 46%, black 40%, transparent 95%)",
              }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-[clamp(7rem,19vw,15rem)] font-semibold tracking-[-0.1em] text-[#294B3A]/60"
            >
              RW
            </div>
          )}

          {/* FADE PORTRAIT INTO DARK BACKGROUND */}
          <div
            className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#080E0C] via-[#080E0C]/30 to-transparent"
          />

          {/* LEFT EDGE SOFT BLEND */}
          <div
            className="absolute inset-y-0 left-0 hidden w-[23%] bg-gradient-to-r from-[#080E0C] to-transparent lg:block"
          />
        </div>
      </div>
    </section>
  );
}
