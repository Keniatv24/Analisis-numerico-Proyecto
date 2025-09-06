import { Link } from "react-router-dom";

export default function Capitulo3() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <div className="mx-auto max-w-7xl grid grid-cols-12">
        {/* LOMO IZQUIERDO */}
        <aside className="col-span-12 lg:col-span-3 border-r border-[var(--line)] bg-[var(--paper-2)] lg:min-h-screen lg:sticky lg:top-0">
          <div className="px-6 py-7">
            {/* Marca editorial */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-2xl">PulsoMatematico</span>
              </div>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">Plataforma de métodos numéricos</p>
            </div>

            {/* Índice tipo libro */}
            <nav className="space-y-1 text-[17px]">
              <Link to="/" className="book-link block rounded-xl px-3 py-2 transition">Inicio</Link>
              <Link to="/" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all" />
                  Capítulo 1
                </span>
              </Link>
              <Link to="/capitulo-2" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all" />
                  Capítulo 2
                </span>
              </Link>
              <Link to="/capitulo-3" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all" />
                  Capítulo 3
                </span>
              </Link>
            </nav>

            <div className="mt-10 border-t border-[var(--line)] pt-4 text-sm text-[var(--ink-soft)] space-y-2">
              <a href="#" className="book-link block">Ayuda / Documentación</a>
              <a href="#" className="book-link block">Acerca de</a>
            </div>

            <div className="mt-10 text-sm text-[var(--ink-soft)]">
              <Link to="/capitulo-2" className="book-link inline-flex items-center gap-2">
                <span>‹</span> Capítulo anterior
              </Link>
            </div>
          </div>
        </aside>

        {/* PÁGINA DERECHA */}
        <main className="col-span-12 lg:col-span-9">
          {/* Encabezado pegado */}
          <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
            <div className="px-7 py-4 flex items-center justify-between">
              <h1 className="font-editorial text-[28px] md:text-[32px]">Métodos de Capítulo 3</h1>
              <div className="hidden md:flex items-center gap-3">
                <input
                  placeholder="Buscar métodos..."
                  className="rounded-full border border-[var(--line)] px-5 py-2 text-sm bg-white shadow-soft w-64"
                />
              </div>
            </div>
          </header>

          {/* Portada de capítulo */}
          <section className="px-7 pt-7">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <h2 className="font-editorial text-[44px] leading-none">Interpolación</h2>
                  <p className="mt-3 text-[var(--ink-soft)] text-[17px]">
                    Construye polinomios e interpolaciones suaves para aproximar funciones:
                    Vandermonde, Newton Interpolante, Lagrange y Splines.
                  </p>
                </div>
                {/* Ornamento minimal */}
                <div className="hidden md:block mt-1">
                  <svg width="104" height="96" viewBox="0 0 104 96" fill="none">
                    <path d="M12 74 C 36 34, 68 34, 92 74" stroke="var(--sage)" strokeWidth="3" fill="none"/>
                    <path d="M16 74 H88" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="20" cy="60" r="2.5" fill="var(--copper)" />
                    <circle cx="52" cy="46" r="2.5" fill="var(--copper)" />
                    <circle cx="84" cy="60" r="2.5" fill="var(--copper)" />
                  </svg>
                </div>
              </div>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--copper)]/60 via-transparent to-[var(--copper)]/60"></div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Chip>Polinomios</Chip>
                <Chip>Puntos de datos</Chip>
                <Chip>Suavidad</Chip>
              </div>
            </div>
          </section>

          {/* Grid de tarjetas */}
          <section className="px-7 pt-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MethodCard
                title="Vandermonde"
                to="/metodos/vander"
                desc="Polinomios interpolantes construidos a partir de la matriz de Vandermonde."
              />
              <MethodCard
                title="Newton Interpolante"
                to="/metodos/newton-interpolante"
                desc="Interpolación basada en diferencias divididas; buena para añadir puntos."
              />
              <MethodCard
                title="Lagrange"
                to="/metodos/lagrange"
                desc="Interpolación polinómica que usa la base de Lagrange sobre puntos dados."
              />
              <MethodCard
                title="Splines Lineal y Cúbico"
                to="/metodos/spline"
                desc="Ajustes suaves por tramos: continuidad y derivadas (cúbico) entre nodos."
              />
            </div>

            {/* Paginador inferior */}
            <div className="mt-8 flex items-center justify-between text-[var(--ink-soft)]">
              <Link to="/capitulo-2" className="book-link inline-flex items-center gap-2">
                <span>←</span> Capítulo II
              </Link>
              <span className="opacity-60">Fin del índice</span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* --------- Subcomponentes locales ---------- */
function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[var(--line)] bg-white px-4 py-1.5 text-sm shadow-soft">
      {children}
    </span>
  );
}

function MethodCard({ title, desc, to }) {
  return (
    <Link to={to} className="group">
      <article className="h-full rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-card hover:shadow transition">
        <div className="h-3 rounded-t-xxl bg-[var(--copper)] group-hover:bg-[var(--copper-600)] transition" />
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 rounded-xl bg-[var(--copper)] text-white grid place-items-center shadow-soft">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-editorial text-[22px] leading-6 text-[var(--ink)]">{title}</h4>
              <p className="mt-2 text-[var(--ink-soft)] text-[15px] leading-6">{desc}</p>
              <button className="btn-copper mt-4">
                Abrir método
                <svg className="h-4 w-4 translate-x-0 group-hover:translate-x-0.5 transition" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
