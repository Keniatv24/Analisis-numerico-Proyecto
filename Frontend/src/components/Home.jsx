import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--paper)] text-[var(--ink)] font-ui">
      <div className="text-center max-w-2xl px-6">
        {/* Logo editorial */}
        <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-4 py-2 bg-[var(--paper-2)] shadow-sm">
          <span className="font-editorial tracking-wide text-4xl">PulsoMatematico</span>
        </div>

        {/* Subtítulo */}
        <p className="mt-4 text-lg text-[var(--ink-soft)]">
          Bienvenido a la plataforma de <strong>métodos numéricos</strong>.
          <br />Selecciona un capítulo para comenzar.
        </p>

        {/* Botones de capítulos */}
        <div className="mt-10 space-y-4">
          <Link to="/capitulo-1" className="block">
            <button className="w-full md:w-auto btn-copper px-8 py-3 rounded-2xl shadow-card hover:shadow-lg transition text-lg font-semibold">
              Capítulo 1 – Métodos de un paso
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
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-[var(--ink-soft)]">
          © {new Date().getFullYear()} PulsoMatematico — Plataforma académica
        </p>
      </div>
    </div>
  );
}
