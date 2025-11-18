import { useState } from "react";

const API_BASE = "/calculations";

// Mapa para traducir el endpoint en un nombre bonito de método (para el informe)
const METHOD_LABELS = {
  cholesky: "Cholesky",
  crout: "Crout",
  doolittle: "Doolittle",
  lu: "LU simple",
  lusimple: "LU simple",
  lu_simple: "LU simple",
  lupivoteo: "LU con pivoteo",
  lu_pivoteo: "LU con pivoteo",
};

// Guarda/actualiza el resultado de un método directo en localStorage
function saveDirectMethodResult({ endpoint, A, b, out }) {
  // Nombre “bonito” para mostrar en el informe
  const methodName = METHOD_LABELS[endpoint] || endpoint;

  const entry = {
    method: methodName,
    timestamp: Date.now(),
    matrixA: A,
    vectorB: b,
    solution: out.solution || null,
    conclusion: out.conclusion || "",
  };

  // Leemos lo que ya haya guardado (para el informe del cap 4)
  const existing = JSON.parse(
    localStorage.getItem("cap4DirectMethodsReport") || "[]"
  );

  // Quitamos, si existe, la versión anterior de este mismo método
  const filtered = existing.filter((e) => e.method !== methodName);

  // Guardamos lista actualizada
  const updated = [...filtered, entry];
  localStorage.setItem("cap4DirectMethodsReport", JSON.stringify(updated));
}

function Table({ title, data }) {
  if (!data) return null;
  const isVector = Array.isArray(data) && !Array.isArray(data[0]);
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-[var(--line)]">
      <h4 className="font-semibold mb-3">{title}</h4>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <tbody>
            {isVector ? (
              <tr>
                {data.map((v, j) => (
                  <td key={j} className="border px-3 py-2">
                    {Number(v).toPrecision(8)}
                  </td>
                ))}
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i}>
                  {row.map((v, j) => (
                    <td key={j} className="border px-3 py-2">
                      {Number(v).toPrecision(8)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MatrixDirectForm({
  endpoint,
  title,
  note = null,
  showP = false,
}) {
  const [n, setN] = useState(3);
  const [A, setA] = useState(
    Array.from({ length: 3 }, () => Array(3).fill(0))
  );
  const [b, setB] = useState(Array(3).fill(0));
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState(null);
  const [err, setErr] = useState("");

  const grow = (dir) => {
    const size = Math.max(1, Math.min(10, n + dir));
    setN(size);
    setA(
      Array.from({ length: size }, (_, i) =>
        Array.from({ length: size }, (_, j) => A[i]?.[j] ?? 0)
      )
    );
    setB(Array.from({ length: size }, (_, i) => b[i] ?? 0));
  };

  const updateA = (i, j, val) => {
    const copy = A.map((r) => r.slice());
    copy[i][j] = Number(val);
    setA(copy);
  };

  const updateB = (i, val) => {
    const copy = b.slice();
    copy[i] = Number(val);
    setB(copy);
  };

  const submit = async () => {
    setLoading(true);
    setErr("");
    setOut(null);
    try {
      const res = await fetch(`${API_BASE}/${endpoint}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrix: A, vector_b: b }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || data?.conclusion || "Error");
      }
      setOut(data);

      // 👉 Guardar este resultado para el informe comparativo del capítulo 4
      saveDirectMethodResult({ endpoint, A, b, out: data });
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-4 text-sm text-[var(--ink-soft)]">
        <a href="/capitulo-2" className="book-link">
          ← Volver
        </a>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-[var(--card)] rounded-xxl border border-[var(--line)] p-6 shadow-soft">
          <h2 className="text-2xl font-editorial">{title}</h2>
          {note && (
            <div className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              {note}
            </div>
          )}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => grow(-1)}
              className="px-3 py-1 rounded-lg bg-slate-200"
            >
              −
            </button>
            <span className="text-slate-700">
              {n}×{n}
            </span>
            <button
              onClick={() => grow(+1)}
              className="px-3 py-1 rounded-lg bg-slate-200"
            >
              +
            </button>
          </div>
          <label className="block text-sm font-medium mt-4 mb-2">
            Matriz de coeficientes A
          </label>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`,
              gap: 8,
            }}
          >
            {A.map((row, i) =>
              row.map((v, j) => (
                <input
                  key={`${i}-${j}`}
                  type="number"
                  step="any"
                  className="border rounded-lg px-2 py-1 bg-amber-50"
                  value={v}
                  onChange={(e) => updateA(i, j, e.target.value)}
                />
              ))
            )}
          </div>
          <label className="block text-sm font-medium mt-4 mb-2">
            Vector b (opcional)
          </label>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`,
              gap: 8,
            }}
          >
            {b.map((v, i) => (
              <input
                key={i}
                type="number"
                step="any"
                className="border rounded-lg px-2 py-1 bg-amber-50"
                value={v}
                onChange={(e) => updateB(i, e.target.value)}
              />
            ))}
          </div>
          <button
            onClick={submit}
            disabled={loading}
            className="mt-5 w-full btn-copper py-3 rounded-2xl"
          >
            {loading ? "Calculando..." : "Calcular"}
          </button>
          {err && <p className="text-red-600 mt-3">{err}</p>}
        </section>
        <section className="bg-[var(--card)] rounded-xxl border border-[var(--line)] p-6 shadow-soft">
          {!out ? (
            <div className="h-full flex items-center justify-center text-[var(--ink-soft)]">
              Sin resultados aún
            </div>
          ) : (
            <div className="space-y-4">
              {showP && out.P && <Table title="Matriz P" data={out.P} />}
              {out.L && <Table title="Matriz L" data={out.L} />}
              {out.U && <Table title="Matriz U" data={out.U} />}
              {out.solution && <Table title="Solución x" data={out.solution} />}
              {out.conclusion && (
                <div className="text-[var(--ink-soft)]">
                  {out.conclusion}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
