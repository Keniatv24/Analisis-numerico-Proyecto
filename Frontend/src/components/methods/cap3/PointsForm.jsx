import { useState } from "react";
import fractalHeader from "../../fractalHeader";

export default function PointsForm({
  onSubmit,
  isLoading=false,
  error=null,
  methodName="Interpolación",
  initialPoints=[[0,0],[1,1],[2,4]],
  initialXEval="",
  rememberKey="cap3_last_problem"
}){
  // Intentar cargar último problema almacenado
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(rememberKey)||'null'); } catch(_) {}
  const [points, setPoints] = useState(stored?.points || initialPoints);
  const [xEval, setXEval] = useState(stored?.x_eval ? stored.x_eval.join(', ') : initialXEval);

  const addRow = ()=> setPoints(p=>[...p,[0,0]]);
  const removeRow = (i)=> setPoints(p=> p.length>2 ? p.filter((_,k)=>k!==i) : p);
  const update = (i,j,val)=> setPoints(p=> p.map((row,k)=> k===i ? row.map((v,t)=> t===j ? Number(val) : v) : row));

  const handleSubmit = (e)=>{
    e.preventDefault();
    const x_eval = xEval.trim()==="" ? undefined : xEval.split(/[\,\s;]+/).filter(Boolean).map(Number);
    // Persistir el problema para reutilizarlo en el informe
    try { localStorage.setItem(rememberKey, JSON.stringify({ points, x_eval })); } catch(_) {}
    onSubmit({ points, x_eval });
  };

  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] shadow-soft overflow-hidden">
      <div className="px-6 py-4">
        <fractalHeader />
        <div className="mt-2 rounded-t-xxl h-2 w-full bg-[var(--copper)]" />
        <h2 className="mt-3 text-xl font-editorial">{methodName}</h2>
        <p className="text-[var(--ink-soft)] text-sm">Ingrese puntos (x, y). Deben tener x distintos.</p>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <button type="button" onClick={addRow} className="px-3 py-1 rounded-xl border border-[var(--line)] bg-white">+ Punto</button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {points.map((row,i)=> (
            <div key={i} className="grid grid-cols-5 gap-3 items-center">
              <label className="text-sm text-[var(--ink-soft)] col-span-1">P{i+1}</label>
              <input type="number" step="any" value={row[0]}
                     onChange={e=>update(i,0,e.target.value)}
                     className="col-span-2 w-full px-3 py-2 bg-white border border-[var(--line)] rounded-xl" placeholder="x" />
              <input type="number" step="any" value={row[1]}
                     onChange={e=>update(i,1,e.target.value)}
                     className="col-span-2 w-full px-3 py-2 bg-white border border-[var(--line)] rounded-xl" placeholder="y" />
              <div className="col-span-5 -mt-1">
                <button type="button" onClick={()=>removeRow(i)} className="text-sm text-red-600 hover:underline">Eliminar</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <label className="block text-sm font-medium">Puntos a evaluar (opcional, separados por coma)</label>
          <input type="text" value={xEval} onChange={e=>setXEval(e.target.value)}
                 className="w-full px-4 py-2 bg-white border border-[var(--line)] rounded-xl" placeholder="0, 0.5, 1.2" />
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl border border-[var(--line)] bg-red-50 text-red-700">{error}</div>
        )}

        <div className="pt-4">
          <button type="button" onClick={handleSubmit} disabled={isLoading}
                  className="w-full py-2.5 px-4 btn-copper rounded-2xl shadow-card">
            {isLoading ? "Procesando..." : "Calcular"}
          </button>
        </div>
      </div>
    </div>
  );
}
