
"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  Trees,
  Layers3,
  HardHat,
} from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { createClient } from "../lib/supabase/client";

type Project = {
  id: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  category: string | null;
  image_urls: string[] | null;
  featured: boolean;
};

const supabase = createClient();

function getProjectIcon(category: string | null) {
  const value = (category || "").toLowerCase();

  if (value.includes("garden") || value.includes("landscape")) {
    return Trees;
  }

  if (value.includes("stone") || value.includes("finish")) {
    return Layers3;
  }

  if (value.includes("building") || value.includes("construction")) {
    return Building2;
  }

  return HardHat;
}

export default function Projects() {
  const { isArabic } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title_en, title_ar, description_en, description_ar, category, image_urls, featured"
        )
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Projects loading error:", error.message);
      } else {
        setProjects((data ?? []) as Project[]);
      }

      setLoading(false);
    }

    fetchProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      dir={isArabic ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#F7F7F5] py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#B18A43]">
            <span className="h-px w-8 bg-[#C9A45C]" />
            {isArabic ? "أعمالنا" : "OUR WORK"}
            <span className="h-px w-8 bg-[#C9A45C]" />
          </span>

          <h2
            id="projects-heading"
            className="mb-5 text-3xl font-bold leading-tight text-[#101D30] sm:text-4xl md:text-5xl"
          >
            {isArabic
              ? "مشاريع المقاولات والبناء وأعمالنا المميزة"
              : "Construction Projects & General Contracting Work in Saudi Arabia"}
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            {isArabic
              ? "اكتشف مشاريع شركة آفاق السعودية في بناء المباني وتنسيق الحدائق وأعمال الحجر والتشطيبات، مع الالتزام بالجودة والاهتمام بالتفاصيل."
              : "Explore SAUDI AFAQ COMPANY projects in building construction, garden landscaping, stonework and finishing services across Saudi Arabia. We focus on quality workmanship and attention to detail."}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            aria-label={isArabic ? "جاري تحميل المشاريع" : "Loading projects"}
            aria-busy="true"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Project Cards */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => {
              const Icon = getProjectIcon(project.category);

              const title =
                isArabic && project.title_ar
                  ? project.title_ar
                  : project.title_en;

              const description =
                isArabic && project.description_ar
                  ? project.description_ar
                  : project.description_en;

              const image = project.image_urls?.[0];

              const imageAlt = isArabic
                ? `${title} - مشروع من أعمال شركة آفاق السعودية للمقاولات`
                : `${title} - ${project.category || "Construction Project"} by SAUDI AFAQ COMPANY in Saudi Arabia`;

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Project Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200 sm:h-72">
                    {image ? (
                      <img
                        src={image}
                        alt={imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#101D30] to-[#344967]"
                        aria-hidden="true"
                      >
                        <Icon
                          size={65}
                          className="text-[#D5B36A]"
                          strokeWidth={1.2}
                        />
                      </div>
                    )}

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#101D30]/75 via-transparent to-transparent"
                      aria-hidden="true"
                    />

                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                      <span className="rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                        {project.category ||
                          (isArabic ? "مشاريعنا" : "Our Projects")}
                      </span>

                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A45C] text-[#101D30] transition-transform duration-300 group-hover:rotate-45"
                        aria-hidden="true"
                      >
                        <ArrowUpRight size={21} />
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 sm:p-7">
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A45C]/15 text-[#A77D32]"
                      aria-hidden="true"
                    >
                      <Icon size={25} strokeWidth={1.8} />
                    </div>

                    <h3 className="mb-3 text-xl font-bold text-[#101D30] transition-colors group-hover:text-[#A77D32]">
                      {title}
                    </h3>

                    <p className="text-sm leading-7 text-gray-600">
                      {description ||
                        (isArabic
                          ? "نقدم أعمالنا بجودة واهتمام بالتفاصيل في جميع مشاريعنا."
                          : "SAUDI AFAQ delivers quality construction work with attention to detail across every project in Saudi Arabia.")}
                    </p>

                    <div className="mt-6 h-px w-full bg-gray-100" />

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#A77D32]">
                        SAUDI AFAQ
                      </span>

                      <span className="text-xs font-medium text-gray-400">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center">
            <Building2
              size={45}
              className="mx-auto mb-4 text-[#C9A45C]"
              aria-hidden="true"
            />

            <h3 className="text-xl font-bold text-[#101D30]">
              {isArabic ? "لا توجد مشاريع حالياً" : "Projects Coming Soon"}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {isArabic
                ? "سيتم عرض مشاريعنا هنا قريباً."
                : "Our building construction, landscaping and stonework projects will be displayed here soon."}
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-14 text-center">
          <a
            href="https://wa.me/966550748345"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-[#101D30] px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-[#C9A45C] hover:text-[#101D30]"
          >
            {isArabic ? "اطلب خدماتنا الآن" : "DISCUSS YOUR PROJECT"}
            <ArrowUpRight size={18} />
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          {isArabic
            ? "نعرض هنا المشاريع التي تضيفونها من لوحة التحكم."
            : "Projects added through the admin dashboard appear here."}
        </p>
      </div>
    </section>
  );
}
