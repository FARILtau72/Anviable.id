"use client";

import { useState } from "react";
import { loginAdminAction } from "@/lib/auth";
import { ShieldAlert, KeyRound, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await loginAdminAction(password);
      if (!res.success) {
        setError(res.message || "Kata sandi salah.");
      }
    } catch {
      setError("Terjadi kesalahan saat memvalidasi sandi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12 px-4 animate-fade-in">
      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl border border-slate-200">
          <div className="text-center space-y-2 mb-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-4 shadow-sm">
              <KeyRound className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Akses Panel Moderasi
            </h1>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Halaman ini dibatasi hanya untuk kurator & pengelola naviable.id.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 animate-slide-up">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kata Sandi Admin
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password}
              className="btn-coral flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi Sandi...</span>
                </>
              ) : (
                <>
                  <span>Buka Panel Admin</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
