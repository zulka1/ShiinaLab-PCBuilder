"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

type Mode = "login" | "register";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageIsError, setMessageIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setMessageIsError(false);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const error =
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Permintaan gagal.";
        setMessage(error);
        setMessageIsError(true);
        return;
      }

      if (mode === "register") {
        setMode("login");
        setMessage("Akun berhasil dibuat. Sekarang masuk dengan password tadi.");
        setPassword("");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setMessage("Tidak dapat menghubungi server. Coba lagi.");
      setMessageIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <SiteHeader activePage="account" />
      <main id="main-content" className="site-page account-page">
        <div className="account-auth-layout">
          <section className="account-auth-intro">
            <p className="eyebrow"><span /> ShiinaLab / akun pengguna</p>
            <h1>
              {mode === "login"
                ? <>Rakit dimulai dari <span className="grad-text">akunmu.</span></>
                : <>Buat ruang untuk <span className="grad-text">rancanganmu.</span></>}
            </h1>
            <p className="page-lede">
              Masuk untuk mengatur profil. Rakitan PC belum disimpan ke akun pada tahap ini.
            </p>
            <p className="preview-note">
              <span className="preview-note-dot" />
              Password dilindungi dengan Argon2id. Gunakan password demo yang tidak dipakai di akun lain.
            </p>
          </section>

          <section className="account-panel account-auth-panel" aria-labelledby="account-heading">
            <div className="account-panel-heading">
              <p className="eyebrow">{mode === "login" ? "Selamat datang kembali" : "Pendaftaran"}</p>
              <h2 id="account-heading">{mode === "login" ? "Masuk ke akun" : "Buat akun baru"}</h2>
              <p>Username 3–24 karakter. Password 8–128 karakter.</p>
            </div>

            <form className="account-form" onSubmit={submit}>
              <div className="form-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  autoCapitalize="none"
                  required
                  minLength={3}
                  maxLength={24}
                  pattern="[A-Za-z0-9_]{3,24}"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
                {mode === "register" && (
                  <small className="account-field-hint">Gunakan huruf, angka, atau garis bawah.</small>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={mode === "register" ? 8 : 1}
                  maxLength={128}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button className="button button-primary account-submit" type="submit" disabled={busy}>
                {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
                <span aria-hidden="true">↗</span>
              </button>
            </form>

            <p className={`account-feedback${messageIsError ? " is-error" : ""}`} role="status" aria-live="polite">
              {message}
            </p>

            <div className="account-auth-switch">
              <span>{mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}</span>
              <button
                className="text-link account-switch-button"
                type="button"
                disabled={busy}
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setMessage("");
                  setMessageIsError(false);
                }}
              >
                {mode === "login" ? "Daftar sekarang" : "Masuk"}
              </button>
            </div>

            <Link className="account-back-link" href="/builder">
              Kembali ke PC Builder <span aria-hidden="true">↗</span>
            </Link>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}