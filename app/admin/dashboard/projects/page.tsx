
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Loader2,
  FolderKanban,
  Star,
  Image as ImageIcon,
  Save,
} from "lucide-react";

import { createClient } from "../../../../lib/supabase/client";

const ADMIN_ID = "2f836c05-a359-4467-a4be-36706e272ce8";
const BUCKET = "project-images";

type Project = {
  id: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  category: string | null;
  image_urls: string[] | null;
  featured: boolean;
  created_at: string;
};

const emptyForm = {
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  category: "",
  featured: false,
};

export default function ProjectsManagement() {
  const router = useRouter();
  const [supabase] = useState(() => createClient());

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState(emptyForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      const { data: userData, error: authError } =
        await supabase.auth.getUser();

      if (
        authError ||
        !userData.user ||
        userData.user.id !== ADMIN_ID
      ) {
        router.replace("/admin");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setProjects((data || []) as Project[]);
      }

      setLoading(false);
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  function openNewProject() {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFiles([]);
    setExistingImages([]);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditProject(project: Project) {
    setEditingId(project.id);

    setForm({
      title_en: project.title_en || "",
      title_ar: project.title_ar || "",
      description_en: project.description_en || "",
      description_ar: project.description_ar || "",
      category: project.category || "",
      featured: project.featured || false,
    });

    setExistingImages(project.image_urls || []);
    setSelectedFiles([]);
    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    setSelectedFiles((previous) => [...previous, ...files]);

    event.target.value = "";
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  }

  function removeExistingImage(url: string) {
    setExistingImages((previous) =>
      previous.filter((image) => image !== url)
    );
  }

  async function uploadImages(): Promise<string[]> {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      const extension = file.name.split(".").pop() || "jpg";
      const filePath = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      uploadedUrls.push(data.publicUrl);
    }

    return uploadedUrls;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title_en.trim()) {
      setError("Please enter the English project title.");
      return;
    }

    if (!editingId && selectedFiles.length === 0) {
      setError("Please upload at least one project image.");
      return;
    }

    setSaving(true);

    try {
      const uploadedUrls = await uploadImages();
      const finalImages = [...existingImages, ...uploadedUrls];

      const projectData = {
        title_en: form.title_en.trim(),
        title_ar: form.title_ar.trim() || null,
        description_en: form.description_en.trim() || null,
        description_ar: form.description_ar.trim() || null,
        category: form.category.trim() || null,
        image_urls: finalImages,
        featured: form.featured,
      };

      if (editingId) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingId);

        if (updateError) throw updateError;

        setSuccess("Project updated successfully!");
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert(projectData);

        if (insertError) throw insertError;

        setSuccess("New project added successfully!");
      }

      const { data, error: fetchError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setProjects((data || []) as Project[]);
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      setSelectedFiles([]);
      setExistingImages([]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title_en}"?`
    );

    if (!confirmed) return;

    setDeletingId(project.id);
    setError("");
    setSuccess("");

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setProjects((previous) =>
        previous.filter((item) => item.id !== project.id)
      );
      setSuccess("Project deleted successfully.");
    }

    setDeletingId(null);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101D30]">
        <Loader2 size={38} className="animate-spin text-[#D5B36A]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F6F9]">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#101D30] px-5 py-5 text-white sm:px-10">
        <div>
          <h1 className="text-xl font-bold">
            SAUDI <span className="text-[#D5B36A]">AFAQ</span>
          </h1>
          <p className="mt-1 text-xs tracking-widest text-[#C9A45C]">
            PROJECT MANAGEMENT
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-9 sm:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#101D30]">
              Manage Projects
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Add, edit and manage your company projects.
            </p>
          </div>

          <button
            onClick={openNewProject}
            className="flex items-center gap-2 rounded-xl bg-[#101D30] px-5 py-3 font-semibold text-white transition hover:bg-[#B18B45]"
          >
            <Plus size={19} />
            Add New Project
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {showForm && (
          <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#101D30]">
                {editingId ? "Edit Project" : "Add New Project"}
              </h3>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#101D30]">
                    Project Title (English) *
                  </label>
                  <input
                    required
                    value={form.title_en}
                    onChange={(e) =>
                      setForm({ ...form, title_en: e.target.value })
                    }
                    placeholder="Example: Modern Building Construction"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#101D30]">
                    Project Title (Arabic)
                  </label>
                  <input
                    dir="rtl"
                    value={form.title_ar}
                    onChange={(e) =>
                      setForm({ ...form, title_ar: e.target.value })
                    }
                    placeholder="عنوان المشروع"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#101D30]">
                    Description (English)
                  </label>
                  <textarea
                    rows={4}
                    value={form.description_en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description_en: e.target.value,
                      })
                    }
                    placeholder="Write project description..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#101D30]">
                    Description (Arabic)
                  </label>
                  <textarea
                    dir="rtl"
                    rows={4}
                    value={form.description_ar}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description_ar: e.target.value,
                      })
                    }
                    placeholder="اكتب وصف المشروع..."
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#101D30]">
                  Project Category
                </label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  placeholder="Building / Landscaping / Stone Work"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-[#101D30]">
                  Project Images *
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9A45C]/50 bg-[#C9A45C]/5 px-5 py-8 text-center transition hover:bg-[#C9A45C]/10">
                  <Upload size={30} className="mb-3 text-[#A47B32]" />
                  <span className="font-semibold text-[#101D30]">
                    Click to upload project images
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    You can select multiple images
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span className="truncate text-gray-700">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="ml-3 text-red-500"
                          aria-label="Remove selected image"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {existingImages.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-gray-700">
                      Existing Images
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {existingImages.map((url) => (
                        <div
                          key={url}
                          className="relative overflow-hidden rounded-xl border"
                        >
                          <img
                            src={url}
                            alt="Project image"
                            className="h-28 w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white"
                            aria-label="Remove existing image"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[#C9A45C]/10 p-4">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                  className="h-5 w-5 accent-[#A47B32]"
                />
                <span className="flex items-center gap-2 text-sm font-semibold text-[#101D30]">
                  <Star size={18} className="text-[#B18B45]" />
                  Mark as Featured Project
                </span>
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#101D30] px-7 py-3 font-semibold text-white transition hover:bg-[#B18B45] disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={19} className="animate-spin" />
                  ) : (
                    <Save size={19} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Project"
                    : "Save Project"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <div className="mb-5 flex items-center gap-3">
          <FolderKanban className="text-[#B18B45]" size={23} />
          <h3 className="text-xl font-bold text-[#101D30]">
            All Projects ({projects.length})
          </h3>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
            <ImageIcon className="mx-auto mb-4 text-gray-400" size={42} />
            <h3 className="font-bold text-[#101D30]">
              No Projects Yet
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Click Add New Project to create your first project.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <div className="relative h-52 bg-gray-100">
                  {project.image_urls?.[0] ? (
                    <img
                      src={project.image_urls[0]}
                      alt={project.title_en}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <ImageIcon size={42} />
                    </div>
                  )}

                  {project.featured && (
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#C9A45C] px-3 py-1 text-xs font-bold text-[#101D30]">
                      <Star size={13} />
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#A47B32]">
                    {project.category || "General Project"}
                  </p>

                  <h4 className="text-lg font-bold text-[#101D30]">
                    {project.title_en}
                  </h4>

                  {project.title_ar && (
                    <p dir="rtl" className="mt-1 text-sm text-gray-600">
                      {project.title_ar}
                    </p>
                  )}

                  <p className="mt-3 line-clamp-3 text-sm text-gray-500">
                    {project.description_en || "No description added."}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    {project.image_urls?.length || 0} image(s)
                  </p>

                  <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                    <button
                      onClick={() => openEditProject(project)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#101D30] px-3 py-2 text-sm font-semibold text-white hover:bg-[#B18B45]"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(project)}
                      disabled={deletingId === project.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingId === project.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
