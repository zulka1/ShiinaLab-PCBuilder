"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { SiteFooter, SiteHeader } from "../components/SiteNavigation";

type Profile = {
  username: string;
  fullName: string | null;
  email: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isProfile(value: unknown): value is Profile {
  return (
    isRecord(value) &&
    typeof value.username === "string" &&
    (typeof value.fullName === "string" || value.fullName === null) &&
    (typeof value.email === "string" || value.email === null)
  );
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [pageMessage, setPageMessage] = useState("Memuat profil...");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [busyAction, setBusyAction] = useState<"profile" | "password" | "delete" | "logout" | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/account/profile");
        const result: unknown = await response.json();
        if (!response.ok) {
          if (active && response.status === 401) {
            setAuthRequired(true);
            setPageMessage("");
            return;
          }
          throw new Error(
            isRecord(result) && typeof result.error === "string"
              ? result.error
              : "Profil tidak dapat dimuat.",
          );
        }
        if (!isRecord(result) || !isProfile(result.user)) {
          throw new Error("Respons profil tidak valid.");
        }
        if (active) {
          setProfile(result.user);
          setPageMessage("");
        }
      } catch (error) {
        if (active) {
          setPageMessage(error instanceof Error ? error.message : "Profil tidak dapat dimuat.");
        }
      }
    }

    void loadProfile();
    return () => { active = false; };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile) return;
    setBusyAction("profile");
    setProfileMessage("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setProfileMessage(
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Perubahan profil gagal disimpan.",
        );
        return;
      }
      setProfile({
        username: profile.username.trim(),
        fullName: profile.fullName?.trim() || null,
        email: profile.email?.trim() || null,
      });
      setProfileMessage("Profil berhasil diperbarui.");
    } catch {
      setProfileMessage("Tidak dapat menghubungi server. Perubahan belum disimpan.");
    } finally {
      setBusyAction(null);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction("password");
    setPasswordMessage("");
    try {
      const response = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setPasswordMessage(
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Password tidak dapat diganti.",
        );
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setProfile(null);
      setAuthRequired(true);
      setPageMessage("Password berhasil diganti. Silakan masuk kembali.");
    } catch {
      setPasswordMessage("Tidak dapat menghubungi server. Password belum diganti.");
    } finally {
      setBusyAction(null);
    }
  }

  async function deleteAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction("delete");
    setDeleteMessage("");
    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: deleteConfirmation, password: deletePassword }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setDeleteMessage(
          isRecord(result) && typeof result.error === "string"
            ? result.error
            : "Akun belum dihapus.",
        );
        return;
      }
      setDeletePassword("");
      setDeleteConfirmation("");
      setProfile(null);
      setAuthRequired(true);
      setPageMessage("Akun berhasil dihapus.");
    } catch {
      setDeleteMessage("Tidak dapat menghubungi server. Akun belum dihapus.");
    } finally {
      setBusyAction(null);
    }
  }

  async function logout() {
    setBusyAction("logout");
    setLogoutMessage("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setLogoutMessage("Belum berhasil keluar. Coba lagi.");
        return;
      }
      setProfile(null);
      setAuthRequired(true);
      setPageMessage("Kamu sudah keluar dari akun.");
    } catch {
      setLogoutMessage("Tidak dapat menghubungi server. Kamu belum keluar.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <>
      <SiteHeader activePage="account" />
      <main id="main-content" className="site-page account-page">
        <div className="page-container">
          <section className="page-intro account-page-intro">
            <p className="eyebrow"><span /> ShiinaLab / ruang akun</p>
            <h1>Profil <span className="grad-text">pengguna.</span></h1>
            <p className="page-lede">Atur detail akun dan keamanan login di satu tempat.</p>
          </section>

          {authRequired ? (
            <section className="account-panel account-logged-out" aria-labelledby="account-login-heading">
              <p className="eyebrow">Akses akun</p>
              <h2 id="account-login-heading">{pageMessage || "Silakan masuk untuk melihat profil."}</h2>
              <p>Login diperlukan untuk membaca dan mengubah detail akun.</p>
              <Link className="button button-primary" href="/login">Masuk atau daftar <span aria-hidden="true">↗</span></Link>
            </section>
          ) : profile ? (
            <div className="account-content">
              <section className="account-panel" aria-labelledby="profile-heading">
                <div className="account-panel-heading account-heading-row">
                  <div>
                    <p className="eyebrow">Informasi pribadi</p>
                    <h2 id="profile-heading">Profil akun</h2>
                    <p>Perubahan tersimpan pada akun yang sedang masuk.</p>
                  </div>
                  <button className="button button-quiet account-logout" type="button" onClick={() => void logout()} disabled={busyAction !== null}>
                    {busyAction === "logout" ? "Keluar..." : "Keluar"}
                  </button>
                </div>
                {logoutMessage && <p className="account-feedback is-error" role="alert">{logoutMessage}</p>}

                <form className="account-form account-profile-form" onSubmit={saveProfile}>
                  <div className="form-field">
                    <label htmlFor="profile-name">Nama</label>
                    <input
                      id="profile-name"
                      autoComplete="name"
                      maxLength={80}
                      value={profile.fullName ?? ""}
                      onChange={(event) => setProfile({ ...profile, fullName: event.target.value })}
                      placeholder="Nama yang ingin ditampilkan"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="profile-email">Email</label>
                    <input
                      id="profile-email"
                      type="email"
                      autoComplete="email"
                      maxLength={254}
                      value={profile.email ?? ""}
                      onChange={(event) => setProfile({ ...profile, email: event.target.value })}
                      placeholder="nama@contoh.com"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="profile-username">Username</label>
                    <input
                      id="profile-username"
                      autoComplete="username"
                      minLength={3}
                      maxLength={24}
                      pattern="[A-Za-z0-9_]{3,24}"
                      value={profile.username}
                      onChange={(event) => setProfile({ ...profile, username: event.target.value })}
                    />
                    <small className="account-field-hint">3–24 karakter: huruf, angka, atau garis bawah.</small>
                  </div>
                  <div className="account-form-actions">
                    <p className="account-feedback" role="status" aria-live="polite">{profileMessage}</p>
                    <button className="button button-primary" type="submit" disabled={busyAction !== null}>
                      {busyAction === "profile" ? "Menyimpan..." : "Simpan perubahan"}
                    </button>
                  </div>
                </form>
              </section>

              <section className="account-panel" aria-labelledby="password-heading">
                <div className="account-panel-heading">
                  <p className="eyebrow">Keamanan</p>
                  <h2 id="password-heading">Ganti password</h2>
                  <p>Password lama diverifikasi sebelum password baru disimpan. Sesi login akan diakhiri.</p>
                </div>
                <form className="account-form account-security-form" onSubmit={changePassword}>
                  <div className="form-field">
                    <label htmlFor="current-password">Password saat ini</label>
                    <input id="current-password" type="password" autoComplete="current-password" required maxLength={128}
                      value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="new-password">Password baru</label>
                    <input id="new-password" type="password" autoComplete="new-password" required minLength={8} maxLength={128}
                      value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                    <small className="account-field-hint">Gunakan 8–128 karakter.</small>
                  </div>
                  <div className="account-form-actions">
                    <p className="account-feedback" role="status" aria-live="polite">{passwordMessage}</p>
                    <button className="button button-quiet" type="submit" disabled={busyAction !== null}>
                      {busyAction === "password" ? "Mengganti..." : "Ganti password"}
                    </button>
                  </div>
                </form>
              </section>

              <section className="account-panel account-danger-panel" aria-labelledby="delete-account-heading">
                <div className="account-panel-heading">
                  <p className="eyebrow">Tindakan permanen</p>
                  <h2 id="delete-account-heading">Hapus akun</h2>
                  <p>Akun dan sesi login akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>
                </div>
                <form className="account-form account-delete-form" onSubmit={deleteAccount}>
                  <div className="form-field">
                    <label htmlFor="delete-confirmation">Ketik HAPUS AKUN untuk mengonfirmasi</label>
                    <input id="delete-confirmation" required value={deleteConfirmation}
                      onChange={(event) => setDeleteConfirmation(event.target.value)} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="delete-password">Password saat ini</label>
                    <input id="delete-password" type="password" autoComplete="current-password" required maxLength={128}
                      value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} />
                  </div>
                  <div className="account-form-actions">
                    <p className="account-feedback is-error" role="status" aria-live="polite">{deleteMessage}</p>
                    <button className="button account-danger-button" type="submit" disabled={busyAction !== null}>
                      {busyAction === "delete" ? "Menghapus..." : "Hapus akun"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          ) : (
            <section className="account-panel account-loading" aria-live="polite">
              <span className="account-loading-mark" aria-hidden="true" />
              <p>{pageMessage}</p>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}