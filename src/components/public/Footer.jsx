import Link from "next/link";
import {
  ArrowUpRight,
} from "lucide-react";
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

export default function Footer({
  settings,
}) {
  const year =
    new Date().getFullYear();

  const socials = [
    {
      label: "GitHub",
      url: settings?.githubUrl,
      icon: FaGithub,
    },
    {
      label: "LinkedIn",
      url: settings?.linkedinUrl,
      icon: FaLinkedinIn,
    },
    {
      label: "Instagram",
      url: settings?.instagramUrl,
      icon: FaInstagram,
    },
    {
      label: "Facebook",
      url: settings?.facebookUrl,
      icon: FaFacebookF,
    },
  ].filter(
    (social) => social.url
  );

  return (
    <footer className="border-t border-neutral-200 dark:border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <Link
              href="/"
              className="text-xl font-semibold"
            >
              {settings?.siteName ??
                "Romesh Wijewardhana"}
              .
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-neutral-500">
              Full-stack developer
              building modern web
              applications, business
              systems and digital
              products.
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-sm text-neutral-500">
              Have a project in mind?
            </p>

            <Link
              href="/contact"
              className="mt-2 inline-flex items-center gap-2 text-lg font-medium"
            >
              Let&apos;s work together
              <ArrowUpRight
                size={18}
              />
            </Link>

            {socials.length > 0 && (
              <div className="mt-6 flex gap-3 md:justify-end">
                {socials.map(
                  (social) => {
                    const Icon =
                      social.icon;

                    return (
                      <a
                        key={
                          social.label
                        }
                        href={
                          social.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          social.label
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 transition hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-white/5"
                      >
                        <Icon
                          size={
                            17
                          }
                        />
                      </a>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
          <p>
            © {year}{" "}
            {settings?.siteName ??
              "Romesh Wijewardhana"}
            . All rights reserved.
          </p>

          <p>
            Designed & built with
            Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
