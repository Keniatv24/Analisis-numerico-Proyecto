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

export default Table;
