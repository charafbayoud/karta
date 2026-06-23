import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CopySqlTextarea } from "@/components/setup/CopySqlTextarea";
import { SUPABASE_SQL_EDITOR_URL } from "@/lib/strava/database-status";
import "./setup-sql.css";

export default function StravaSqlSetupPage() {
  const sql = readFileSync(
    path.join(process.cwd(), "supabase/RUN-ME-STRAVA.sql"),
    "utf8"
  );

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="auth-card" style={{ maxWidth: "48rem" }}>
          <p className="karta-label">Configuration Strava</p>
          <h1>SQL à exécuter dans Supabase</h1>
          <p className="auth-sub">
            Copie tout le script ci-dessous, colle-le dans Supabase → SQL Editor, clique{" "}
            <strong>Run</strong>, puis recharge la page login ou signup.
          </p>

          <p className="auth-setup-banner-steps">
            1.{" "}
            <a href={SUPABASE_SQL_EDITOR_URL} target="_blank" rel="noopener noreferrer">
              Ouvrir Supabase SQL Editor
            </a>
            <br />
            2. Sélectionne tout le texte dans la zone → Copier
            <br />
            3. Colle dans Supabase → Run → retourne sur KARTA
          </p>

          <CopySqlTextarea value={sql} />

          <Link href="/login" className="btn-primary auth-submit">
            Retour au login
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
