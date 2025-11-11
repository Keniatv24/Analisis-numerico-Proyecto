from typing import List, Optional, Dict, Any
import numpy as np


def lagrange_interpolation(x: List[float], y: List[float], x_eval: Optional[List[float]] = None) -> Dict[str, Any]:
    """
    Polinomio de interpolación de Lagrange.

    Returns:
        dict:
            - basis: lista de coeficientes de cada polinomio base Li(x) (cada uno como lista mayor->menor)
            - coefficients: coeficientes del polinomio final (mayor->menor)
            - polynomial: representación en string del polinomio final
            - y_eval: si se dan puntos para evaluar
    """
    n = len(x)
    if n != len(y) or n == 0:
        raise ValueError("Listas x e y inválidas")
    if len(set(x)) != n:
        raise ValueError("Los nodos deben ser distintos")

    x_arr = np.asarray(x, dtype=float)
    y_arr = np.asarray(y, dtype=float)

    basis_coeffs = []
    P = np.poly1d([0.0])
    for i in range(n):
        # Construimos Li(x)
        Li = np.poly1d([1.0])
        denom = 1.0
        xi = x_arr[i]
        for j in range(n):
            if i == j:
                continue
            xj = x_arr[j]
            Li *= np.poly1d([1.0, -xj])  # (x - xj)
            denom *= (xi - xj)
        Li = Li / denom
        basis_coeffs.append(Li.c.tolist())
        P = P + y_arr[i] * Li

    coeffs = P.c  # mayor -> menor

    def _poly_to_str(c):
        terms = []
        deg = len(c) - 1
        for k, a in enumerate(c):
            if abs(a) < 1e-14:
                continue
            p = deg - k
            coef = f"{a:.10g}"
            if p == 0:
                terms.append(coef)
            elif p == 1:
                terms.append(f"{coef}·x")
            else:
                terms.append(f"{coef}·x^{p}")
        return " + ".join(terms) if terms else "0"

    res: Dict[str, Any] = {
        "basis": basis_coeffs,
        "coefficients": coeffs.tolist(),
        "polynomial": _poly_to_str(coeffs),
    }

    if x_eval is not None:
        xq = np.asarray(x_eval, dtype=float)
        yq = P(xq)
        res["x_eval"] = xq.tolist()
        res["y_eval"] = yq.tolist()

    return res
