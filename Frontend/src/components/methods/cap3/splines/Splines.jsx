import { useState } from "react";
import { ArrowLeft, Info, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import PointsForm from "../PointsForm";
import Table, { ResultsCard, Poly, InterpolationChart } from "../ResultsBlocks";
import { postSplineLineal, postSplineCubico } from "../../../../api/cap3.js";

export default function SplinesPage(){
  const [out,setOut]=useState(null); const [loading,setLoading]=useState(false); const [err,setErr]=useState(""); const [showInfo,setShowInfo]=useState(false); const [mode,setMode]=useState("lineal"); const [inputPoints, setInputPoints] = useState(null);
  const submit = async ({points,x_eval})=>{ setLoading(true); setErr(""), setOut(null); setInputPoints(points); try{ setOut(mode==="lineal"? await postSplineLineal({points,x_eval}) : await postSplineCubico({points,x_eval})); }catch(e){ setErr(e.message||String(e)); } finally{ setLoading(false); }};
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-ui">
      <header className="sticky top-0 z-10 bg-[var(--paper)]/90 backdrop-blur border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link to="/capitulo-3" className="inline-flex items-center gap-2 text-[var(--copper-700)] hover:text-[var(--copper)] transition"><ArrowLeft className="h-5 w-5"/><span>Volver</span></Link><div className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line)] px-3 py-1 bg-[var(--paper)]"><span className="font-editorial tracking-wide text-xl">PulsoMatematico</span></div></div>
          <div className="flex items-center gap-4">
            <span className="text-[17px] font-editorial">Splines {mode === "lineal" ? "Lineales" : "Cúbico Natural"}</span>
            <button onClick={()=>setShowInfo(s=>!s)} className="inline-flex items-center gap-2 text-[var(--copper-800)] hover:text-[var(--copper)] transition"><Info className="h-5 w-5"/><span>Info</span></button>
            <Link to="/informeCap3" className="book-link inline-flex items-center rounded-xl border border-[var(--line)] px-3 py-1.5 bg-[var(--card)] hover:shadow-soft transition">Ir al Informe</Link>
          </div>
        </div>
      </header>
      {showInfo && (<div className="border-b border-[var(--line)]"><div className="max-w-7xl mx-auto px-4 py-4"><div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-5 shadow-soft"><h3 className="text-lg font-semibold flex items-center gap-2"><HelpCircle className="h-5 w-5 text-[var(--copper)]"/>Splines</h3><p className="mt-3 text-[var(--ink-soft)]">Ajustes por tramos. Lineal une puntos con rectas; cúbico natural impone segunda derivada 0 en extremos.</p></div></div></div>)}
      <main className="py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-4 shadow-soft flex items-center gap-4">
              <span className="text-sm font-medium">Modo:</span>
              <button onClick={()=>setMode("lineal")} className={`px-3 py-1 rounded-lg border ${mode==="lineal"? 'bg-[var(--copper)] text-white':'bg-white'}`}>Lineal</button>
              <button onClick={()=>setMode("cubico")} className={`px-3 py-1 rounded-lg border ${mode==="cubico"? 'bg-[var(--copper)] text-white':'bg-white'}`}>Cúbico</button>
            </div>
            <PointsForm onSubmit={submit} isLoading={loading} error={err} methodName={mode==="lineal"?"Spline Lineal":"Spline Cúbico"} />
          </div>
          {out ? (
            <ResultsCard title="Resultados Spline">
              {out.x_eval && out.y_eval && (
                <InterpolationChart 
                  points={inputPoints} 
                  x_eval={out.x_eval} 
                  y_eval={out.y_eval}
                  methodName={mode==="lineal"?"Spline Lineal":"Spline Cúbico"}
                />
              )}
              {mode==="lineal" && out.segments && (<Table title="Segmentos" data={out.segments.map(s=>[`${s.interval[0]} - ${s.interval[1]}`, s.m, s.b])} />)}
              {mode==="cubico" && out.segments && (<Table title="Segmentos (a,b,c,d)" data={out.segments.map(s=>[`${s.interval[0]} - ${s.interval[1]}`, s.a, s.b, s.c, s.d])} />)}
              {out.x_eval && <Table title="Evaluaciones y(x)" data={out.y_eval.map((v,i)=>[out.x_eval[i], v])} />}
            </ResultsCard>
          ) : (<div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-8 flex items-center justify-center h-full shadow-soft"><div className="text-[var(--ink-soft)]">Sin resultados aún</div></div>)}
        </div>
      </main>
    </div>
  );
}
