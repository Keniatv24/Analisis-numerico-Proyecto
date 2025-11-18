// utils/cap4ReportStorage.js

const METHOD_LABELS = {
  lu: "LU simple",
  lu_pivoteo: "LU con pivoteo",
  crout: "Crout",
  doolittle: "Doolittle",
  cholesky: "Cholesky",
};

export function saveCap4DirectMethodResult({
  methodKey,
  A,
  b,
  solution,
  conclusion,
  runtimeMs,
}) {
  const methodName = METHOD_LABELS[methodKey] || methodKey;

  const stored = localStorage.getItem("cap4DirectMethodsReport");
  const list = stored ? JSON.parse(stored) : [];

  const filtered = list.filter((e) => e.method !== methodName);

  const newEntry = {
    method: methodName,
    A,
    b,
    solution,
    conclusion,
    runtimeMs: typeof runtimeMs === "number" ? runtimeMs : null,
    savedAt: new Date().toISOString(),
  };

  filtered.push(newEntry);

  localStorage.setItem(
    "cap4DirectMethodsReport",
    JSON.stringify(filtered)
  );
}
