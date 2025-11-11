import { useState } from "react";
import { ArrowLeft, Info, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PointsForm from "../PointsForm";
import Table, { ResultsCard, Poly } from "../ResultsBlocks";
import { postVandermonde } from "../../../../api/cap3.js";

export default function VandermondePage(){
  const [out, setOut] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");
  const [showInfo,setShowInfo] = useState(false);

  const submit = async ({points, x_eval}) => {
    setLoading(true); setErr(""), setOut(null);
    try{
      const data = await postVandermonde({ points, x_eval });
      setOut(data);
    }catch(e){ setErr(e.message||String(e)); }
    finally{ setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/capitulo-3" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition">
              <ArrowLeft className="h-5 w-5" /><span>Volver</span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]">
              <span className="font-editorial tracking-wide text-xl">PulsoMatematico</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[17px] font-editorial">Vandermonde</span>
            <button onClick={()=>setShowInfo(s=>!s)} className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition">
              <Info className="h-5 w-5" /><span>Info</span>
            </button>
            <Link
              to="/informeCap3"
              className="book-link inline-flex items-center rounded-xl border border-[var(--line)] px-3 py-1.5 bg-[var(--card)] hover:shadow-soft transition"
            >
              Ir al Informe
            </Link>
          </div>
        </div>
      </header>
      {showInfo && (
        <div className="border-b border-[var(--line)]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft">
              <h3 className="text-lg font-semibold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-[var(--copper)]"/>Matriz de Vandermonde</h3>
              <p className="mt-3 text-[var(--ink-soft)]">Resuelve el sistema V·a = y para obtener los coeficientes del polinomio interpolante.</p>
            </div>
          </div>
        </div>
      )}

      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PointsForm onSubmit={submit} isLoading={loading} error={err} methodName="Vandermonde" />
          {out ? (
            <ResultsCard title="Resultados Vandermonde">
              <Poly text={out.polynomial} />
              <Table title="Matriz Vandermonde" data={out.vandermonde} />
              <Table title="Coeficientes (vector)" data={out.solution} />
              {out.x_eval && <Table title="Evaluaciones y(x)" data={out.y_eval.map((v,i)=>[out.x_eval[i], v])} />}
            </ResultsCard>
          ) : (
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-8 flex items-center justify-center h-full shadow-soft">
              <div className="text-[var(--ink-soft)]">Sin resultados aún</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
