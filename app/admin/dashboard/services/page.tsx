
"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, LogOut, ArrowLeft, Wrench } from "lucide-react";

const ADMIN_ID = "2f836c05-a359-4467-a4be-36706e272ce8";

type Service = {
  id: string;
  title_en: string;
  title_ar: string | null;
  description_en: string | null;
  description_ar: string | null;
  icon: string | null;
  sort_order: number;
  created_at?: string;
};

const emptyForm = {
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  icon: "building",
  sort_order: 0,
};

export default function ServicesManagement() {
  const supabase = createClient();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function initialize() {
      const { data, error: authError } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || data.user?.id !== ADMIN_ID) {
        router.replace("/admin");
        return;
      }

      const { data: rows, error: fetchError } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!active) return;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setServices((rows ?? []) as Service[]);
      }

      setLoading(false);
    }

    initialize();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function loadServices() {
    const { data, error: fetchError } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    setServices((data ?? []) as Service[]);
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  function openEditForm(service: Service) {
    setForm({
      title_en: service.title_en ?? "",
      title_ar: service.title_ar ?? "",
      description_en: service.description_en ?? "",
      description_ar: service.description_ar ?? "",
      icon: service.icon ?? "building",
      sort_order: service.sort_order ?? 0,
    });

    setEditingId(service.id);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      title_en: form.title_en.trim(),
      title_ar: form.title_ar.trim() || null,
      description_en: form.description_en.trim() || null,
      description_ar: form.description_ar.trim() || null,
      icon: form.icon.trim() || "building",
      sort_order: Number(form.sort_order) || 0,
    };

    if (!payload.title_en) {
      setError("English service title is required.");
      setSaving(false);
      return;
    }

    const result = editingId
      ? await supabase.from("services").update(payload).eq("id", editingId)
      : await supabase.from("services").insert([payload]);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    await loadServices();

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setMessage(editingId ? "Service updated successfully." : "Service added successfully.");
    setSaving(false);
  }

  async function deleteService(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("services")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setServices((current) => current.filter((service) => service.id !== id));
    setMessage("Service deleted successfully.");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin");
  }

  function updateField(
    field: keyof typeof emptyForm,
    value: string | number
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101D30] text-white">
        Loading services...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7]">
      <header className="bg-[#101D30] text-white px-5 py-5">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              SAUDI AFAQ
            </h1>
            <p className="text-sm text-[#D5B36A]">
              Services Management
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-2 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10"
            >
              <ArrowLeft size={17} />
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#C9A45C] text-[#101D30] px-4 py-2 rounded-lg font-semibold hover:bg-[#D5B36A]"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#101D30]">
              Manage Services
            </h2>
            <p className="text-gray-500 mt-1">
              Add, edit and manage your company services.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-[#C9A45C] text-[#101D30] px-5 py-3 rounded-lg font-bold hover:bg-[#D5B36A]"
          >
            <Plus size={20} />
            Add New Service
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-lg bg-green-100 text-green-800 p-4">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 text-red-700 p-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#101D30]">
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-red-600"
                aria-label="Close form"
              >
                <X size={23} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Service Title (English) *
                  </label>
                  <input
                    required
                    value={form.title_en}
                    onChange={(e) => updateField("title_en", e.target.value)}
                    placeholder="General Contracting"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Service Title (Arabic)
                  </label>
                  <input
                    dir="rtl"
                    value={form.title_ar}
                    onChange={(e) => updateField("title_ar", e.target.value)}
                    placeholder="المقاولات العامة"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description (English)
                  </label>
                  <textarea
                    rows={4}
                    value={form.description_en}
                    onChange={(e) => updateField("description_en", e.target.value)}
                    placeholder="Describe this service..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Description (Arabic)
                  </label>
                  <textarea
                    dir="rtl"
                    rows={4}
                    value={form.description_ar}
                    onChange={(e) => updateField("description_ar", e.target.value)}
                    placeholder="اكتب وصف الخدمة..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Icon Name
                  </label>
                  <input
                    value={form.icon}
                    onChange={(e) => updateField("icon", e.target.value)}
                    placeholder="building"
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Example: building, wrench, paintbrush
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) =>
                      updateField("sort_order", Number(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 outline-none focus:border-[#C9A45C]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Smaller numbers appear first.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#101D30] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1b304b] disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Service"
                    : "Save Service"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-300 px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-[#101D30] text-[#D5B36A] flex items-center justify-center mb-4">
                <Wrench size={23} />
              </div>

              <h3 className="text-lg font-bold text-[#101D30]">
                {service.title_en}
              </h3>

              {service.title_ar && (
                <p dir="rtl" className="text-gray-600 mt-1">
                  {service.title_ar}
                </p>
              )}

              <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                {service.description_en || "No description added."}
              </p>

              <p className="text-xs text-gray-400 mt-4">
                Display order: {service.sort_order}
              </p>

              <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                <button
                  onClick={() => openEditForm(service)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#101D30] text-white py-2 hover:bg-[#1b304b]"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => deleteService(service.id)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-50 text-red-600 py-2 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Wrench size={40} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-[#101D30]">
              No Services Yet
            </h3>
            <p className="text-gray-500 mt-2">
              Click Add New Service to create your first service.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
