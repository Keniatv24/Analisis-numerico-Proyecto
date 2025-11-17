import { useState } from "react";
import { ArrowLeft, Info, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PointsForm from "../PointsForm";
import Table, { ResultsCard, Poly, InterpolationChart } from "../ResultsBlocks";
import { postNewtonInterpolante } from "../../../../api/cap3.js";

export default function NewtonInterpolantePage(){
  const [out, setOut] = useState(null);
  const [loading,setLoading] = useState(false);
  const [err,setErr] = useState("");
  const [showInfo,setShowInfo] = useState(false);
  const [inputPoints, setInputPoints] = useState(null);
  const submit = async ({points, x_eval}) => {
    setLoading(true); setErr(""), setOut(null);
    setInputPoints(points);
    try{ setOut(await postNewtonInterpolante({ points, x_eval })); }
    catch(e){ setErr(e.message||String(e)); }
    finally{ setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/capitulo-3" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition"><ArrowLeft className="h-5 w-5"/><span>Volver</span></Link>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]"><span className="font-editorial tracking-wide text-xl">PulsoMatematico</span></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[17px] font-editorial">Newton Interpolante</span>
            <button onClick={()=>setShowInfo(s=>!s) } className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition"><Info className="h-5 w-5"/><span>Info</span></button>
            <Link to="/informeCap3" className="book-link inline-flex items-center rounded-xl border border-[var(--line)] px-3 py-1.5 bg-[var(--card)] hover:shadow-soft transition">Ir al Informe</Link>
          </div>
        </div>
      </header>
      {showInfo && (
        <div className="border-b border-[var(--line)]"><div className="max-w-7xl mx-auto px-4 py-4"><div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft"><h3 className="text-lg font-semibold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-[var(--copper)]"/>Polinomio de Newton</h3><p className="mt-3 text-[var(--ink-soft)]">Construye diferencias divididas y genera forma de Newton más eficiente para añadir puntos.</p></div></div></div>
      )}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PointsForm onSubmit={submit} isLoading={loading} error={err} methodName="Newton Interpolante" />
          {out ? (
            <ResultsCard title="Resultados Newton">
              {out.x_eval && out.y_eval && (
                <InterpolationChart 
                  points={inputPoints} 
                  x_eval={out.x_eval} 
                  y_eval={out.y_eval}
                  methodName="Newton Interpolante"
                />
              )}
              <Poly label="Polinomio en forma de Newton" text={out.polynomial_newton} />
              <Table title="Tabla diferencias divididas" data={out.dd_table} />
              <Table title="Coeficientes a" data={out.a} />
              <Poly label="Forma estándar" text={"Coeficientes: ["+ out.coefficients_std.map(v=>v.toPrecision(6)).join(", ") + "]"} />
              {out.x_eval && <Table title="Evaluaciones y(x)" data={out.y_eval.map((v,i)=>[out.x_eval[i], v])} />}
            </ResultsCard>
          ) : (<div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-8 flex items-center justify-center h-full shadow-soft"><div className="text-[var(--ink-soft)]">Sin resultados aún</div></div>)}
        </div>
      </main>
    </div>
  );
}
