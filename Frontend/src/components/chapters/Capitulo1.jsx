// Frontend/src/components/chapters/Capitulo1.jsx
import { Link } from "react-router-dom";

export default function Capitulo1() {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <div className="mx-auto max-w-7xl grid grid-cols-12">
        {/* LOMO IZQUIERDO (índice simple para volver al inicio) */}
        <aside className="col-span-12 lg:col-span-3 border-r border-[var(--line)] bg-[var(--paper-2)] lg:min-h-screen lg:sticky lg:top-0">
          <div className="px-6 py-7">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
                <span className="font-editorial tracking-wide text-2xl">PulsoMatematico</span>
              </div>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">Plataforma de métodos numéricos</p>
            </div>

            <nav className="space-y-1 text-[17px]">
              <Link to="/" className="book-link block rounded-xl px-3 py-2 transition">Inicio</Link>
              <Link to="/capitulo-1" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all"></span>
                  Capítulo 1
                </span>
              </Link>
              <Link to="/capitulo-2" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all"></span>
                  Capítulo 2
                </span>
              </Link>
              <Link to="/capitulo-3" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all"></span>
                  Capítulo 3
                </span>
              </Link>
              <Link to="/capitulo-4" className="book-link group block rounded-xl px-3 py-2 transition">
                <span className="inline-flex items-center gap-2">
                <span className="h-3 w-1.5 bg-[var(--copper)] rounded-full group-hover:h-4 transition-all" />
                     Capítulo 4
                 </span>
                 </Link>
            </nav>
          </div>
        </aside>

        {/* PÁGINA DERECHA */}
        <main className="col-span-12 lg:col-span-9">
          <header id="inicio" className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
            <div className="px-7 py-4 flex items-center justify-between">
              <h1 className="font-editorial text-[28px] md:text-[32px]">Métodos de Capítulo 1</h1>
              <div className="hidden md:flex items-center gap-3">
                <input
                  placeholder="Buscar métodos..."
                  className="rounded-full border border-[var(--line)] px-5 py-2 text-sm bg-white shadow-soft w-64"
                />
              </div>
            </div>
          </header>

          {/* Portada de capítulo (Raíces) */}
          <section className="px-7 pt-7">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-7 shadow-soft">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-2xl">
                  <h2 className="font-editorial text-[48px] leading-none">Raíces</h2>
                  <p className="mt-3 text-[var(--ink-soft)] text-[17px]">
                    Métodos numéricos para encontrar raíces de ecuaciones no lineales, empleando técnicas iterativas y cerradas.
                  </p>
                </div>
                <div className="hidden md:block mt-1">
                  <svg width="120" height="96" viewBox="0 0 120 96" fill="none">
                    <path d="M90 64H54" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M73 63c0-20 5-30 19-36-2 14-7 22-19 36Z" stroke="var(--sage)" strokeWidth="3" fill="none"/>
                    <path d="M70 63c0-14-4-22-16-27 2 11 6 17 16 27Z" stroke="var(--sage)" strokeWidth="3" fill="none"/>
                    <path d="M73 64v20" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M73 84c6-2 8-5 11-10" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M73 84c-6-2-8-5-11-10" stroke="var(--copper)" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="mt-6 h-px w-full bg-gradient-to-r from-[var(--copper)]/60 via-transparent to-[var(--copper)]/60"></div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Chip>Iterativos</Chip>
                <Chip>Cerrados</Chip>
                <Chip>Con derivadas</Chip>
              </div>
            </div>
          </section>

          {/* GRID de tarjetas */}
          <section className="px-7 pt-6 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MethodCard title="Bisección" to="/metodos/biseccion"
                desc="Divide repetidamente el intervalo a la mitad y selecciona el subintervalo donde ocurre el cambio de signo." />
              <MethodCard title="Regla Falsa" to="/metodos/regla-falsa"
                desc="Utiliza interpolación lineal para estimar la raíz, combinando la robustez de la bisección con mayor velocidad." />
              <MethodCard title="Secante" to="/metodos/secante"
                desc="Iterativo que utiliza la recta secante entre dos puntos para aproximar la raíz." />
              <MethodCard title="Newton" to="/metodos/newton"
                desc="Usando derivada de la función para aproximar la convergencia." />
              <MethodCard title="Punto Fijo" to="/metodos/punto-fijo"
                desc="Reescribe f(x)=0 como x=g(x) y itera x_{n+1}=g(x_n) para converger a la raíz." />
              <MethodCard title="Raices Múltiples" to="/metodos/raices-multiples"
                desc="Método especializado para raíces de multiplicidad mayor a 1, empleando derivadas." />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* -------- Subcomponentes locales -------- */
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
