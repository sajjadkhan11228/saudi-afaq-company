
"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Globe,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { createClient } from "../lib/supabase/client";

type SiteSettings = {
  company_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
};

const DEFAULT_SETTINGS: SiteSettings = {
  company_name: "SAUDI AFAQ COMPANY",
  phone: "+966550748345",
  whatsapp: "+966550748345",
  email: "ik3630108@gmail.com",
};

export default function Header() {
  const { isArabic, toggleLanguage } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    async function fetchSettings() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("site_settings")
        .select("company_name, phone, whatsapp, email")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Header settings error:", error.message);
        return;
      }

      if (data) {
        setSettings({
          company_name:
            data.company_name || DEFAULT_SETTINGS.company_name,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          whatsapp: data.whatsapp || DEFAULT_SETTINGS.whatsapp,
          email: data.email || DEFAULT_SETTINGS.email,
        });
      }
    }

    fetchSettings();
  }, []);

  const phone = settings.phone || DEFAULT_SETTINGS.phone;
  const email = settings.email || DEFAULT_SETTINGS.email;

  const whatsappNumber = (
    settings.whatsapp ||
    DEFAULT_SETTINGS.whatsapp ||
    "+966550748345"
  ).replace(/\D/g, "");

  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const links = isArabic
    ? [
        ["الرئيسية", "#home"],
        ["من نحن", "#about"],
        ["خدماتنا", "#services"],
        ["مشاريعنا", "#projects"],
        ["اتصل بنا", "#contact"],
      ]
    : [
        ["Home", "#home"],
        ["About Us", "#about"],
        ["Services", "#services"],
        ["Projects", "#projects"],
        ["Contact", "#contact"],
      ];

  return (
    <header className="sticky top-0 z-50 bg-[#101D30] text-white shadow-xl">
      {/* Top Contact Bar */}
      <div className="border-b border-white/10 bg-[#0B1524]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-2">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 transition hover:text-[#D5B36A]"
              dir="ltr"
            >
              <Phone size={14} className="text-[#D5B36A]" />
              {phone}
            </a>

            <a
              href={`mailto:${email}`}
              className="hidden items-center gap-2 transition hover:text-[#D5B36A] sm:flex"
              dir="ltr"
            >
              <Mail size={14} className="text-[#D5B36A]" />
              {email}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>

            <span className="animate-pulse text-lg" title="Saudi Arabia">
              🇸🇦
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"
      >
        <a href="#home" className="leading-tight">
          <span className="block text-xl font-bold tracking-wider text-[#D5B36A]">
            {settings.company_name || "SAUDI AFAQ COMPANY"}
          </span>

          <span className="text-xs text-gray-300">
            {isArabic
              ? "شركة آفاق السعودية للمقاولات"
              : "CONTRACTING COMPANY"}
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-gray-200 transition hover:text-[#D5B36A]"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm hover:text-[#D5B36A]"
          >
            <Globe size={17} />
            {isArabic ? "English" : "العربية"}
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle size={17} />
            {isArabic ? "تواصل عبر واتساب" : "WhatsApp Us"}
          </a>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav
          dir={isArabic ? "rtl" : "ltr"}
          className="border-t border-white/10 px-5 py-5 lg:hidden"
        >
          <div className="flex flex-col gap-5">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-sm hover:text-[#D5B36A]"
              >
                {label}
              </a>
            ))}

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm"
            >
              <Globe size={17} />
              {isArabic ? "English" : "العربية"}
            </button>

            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm text-[#D5B36A]"
              dir="ltr"
            >
              <Phone size={17} />
              {phone}
            </a>

            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 break-all text-sm text-[#D5B36A]"
              dir="ltr"
            >
              <Mail size={17} />
              {email}
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-5 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={18} />
              {isArabic ? "تواصل عبر واتساب" : "WhatsApp Us"}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
