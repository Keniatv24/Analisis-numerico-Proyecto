// Frontend/src/components/home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen hero-bg text-[var(--ink)] font-ui flex items-center justify-center">
      <div className="w-full max-w-3xl px-6 py-12 text-center">

        {/* Marca */}
        <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-5 py-3 bg-[color-mix(in_olab,var(--paper)_92%,var(--ink)_8%)] shadow-soft backdrop-blur-sm">
          <span className="font-editorial tracking-wide text-4xl md:text-5xl">
            PulsoMatematico
          </span>
        </div>

        {/* Subtítulo */}
        <p className="mt-6 text-lg md:text-xl text-[color-mix(in_olab,var(--ink)_85%,var(--paper)_15%)]">
          Bienvenido a la plataforma de <strong>métodos numéricos</strong>.<br />
          Selecciona un capítulo para comenzar.
        </p>

        {/* Botones / CTAs */}
        <div className="mt-10 space-y-4">
          <Link to="/capitulo-1" className="block">
            <button className="w-full md:w-auto btn-copper px-8 py-3 rounded-2xl shadow-card hover:shadow-lg transition text-lg font-semibold">
              Capítulo 1 – Raíces
            </button>
          </Link>

          <Link to="/capitulo-2" className="block">
            <button className="w-full md:w-auto btn-copper px-8 py-3 rounded-2xl shadow-card hover:shadow-lg transition text-lg font-semibold">
              Capítulo 2 – Sistemas Lineales
            </button>
          </Link>

          <Link to="/capitulo-3" className="block">
            <button className="w-full md:w-auto btn-copper px-8 py-3 rounded-2xl shadow-card hover:shadow-lg transition text-lg font-semibold">
              Capítulo 3 – Interpolación
            </button>
          </Link>
          <Link to="/capitulo-4" className="btn-copper">
            Capítulo 4 — Factorizaciones y Álgebra Matricial
          </Link>

        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-[var(--ink-soft)]">
          © {new Date().getFullYear()} PulsoMatematico — Plataforma académica
        </p>
      </div>
    </div>
  );
}
