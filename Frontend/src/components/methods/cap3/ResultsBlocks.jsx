import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

function Table({ title, data }){
  if(!data) return null;
  const isVector = Array.isArray(data) && !Array.isArray(data[0]);
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-[var(--line)]">
      {title && <h4 className="font-semibold mb-3">{title}</h4>}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <tbody>
            {isVector ? (
              <tr>{data.map((v,j)=> <td key={j} className="border px-3 py-2">{Number(v).toPrecision(8)}</td>)}</tr>
            ) : (
              data.map((row,i)=> (
                <tr key={i}>
                  {row.map((v,j)=> <td key={j} className="border px-3 py-2">{typeof v==="number"? Number(v).toPrecision(8) : String(v)}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ResultsCard({ children, title }){
  return (
    <div className="rounded-xxl border border-[var(--line)] bg-[var(--card)] p-6 shadow-soft">
      {title && <h3 className="text-xl font-editorial mb-4">{title}</h3>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Poly({ label="Polinomio", text }){
  if(!text) return null;
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-[var(--line)]">
      <h4 className="font-semibold mb-2">{label}</h4>
      <code className="text-[15px] break-words">{text}</code>
    </div>
  );
}

export function InterpolationChart({ points, x_eval, y_eval, methodName = "Interpolación" }) {
  if (!x_eval || !y_eval || x_eval.length === 0) return null;

  // Preparar datos para la gráfica
  const interpolationData = x_eval.map((x, i) => ({
    x: x,
    y: y_eval[i]
  }));

  const pointsData = points?.map(p => ({
    x: p[0],
    y: p[1]
  })) || [];

  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-[var(--line)]">
      <h4 className="font-semibold mb-3">Gráfica de {methodName}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="x" type="number" domain={['auto', 'auto']} stroke="#6b7280" />
          <YAxis dataKey="y" type="number" domain={['auto', 'auto']} stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value) => Number(value).toFixed(6)}
          />
          <Legend />
          <Line 
            data={interpolationData} 
            type="monotone" 
            dataKey="y" 
            stroke="#92400e" 
            strokeWidth={2}
            name="Interpolación"
            dot={false}
          />
          <Scatter 
            data={pointsData} 
            fill="#365314" 
            name="Puntos originales"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Table;
