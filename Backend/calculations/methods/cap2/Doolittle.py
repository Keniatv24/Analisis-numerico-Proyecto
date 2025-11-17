import numpy as np
from .LU_simple import forward_substitution, backward_substitution

def doolittle(A, b=None):
    """Factorización LU estilo Doolittle (diag(L)=1)."""
    results = {'L': None, 'U': None, 'solution': None, 'conclusion': None}
    A = np.array(A, dtype=float)
    n, m = A.shape
    if n != m:
        results['conclusion'] = "La matriz A debe ser cuadrada."
        return results

    L = np.eye(n)
    U = np.zeros_like(A)

    try:
        for i in range(n):
            for k in range(i, n):
                U[i, k] = A[i, k] - np.dot(L[i, :i], U[:i, k])
            for k in range(i+1, n):
                if U[i, i] == 0:
                    results['conclusion'] = "Pivote cero."
                    return results
                L[k, i] = (A[k, i] - np.dot(L[k, :i], U[:i, i])) / U[i, i]

        results['L'] = L
        results['U'] = U

        if b is not None:
            b = np.array(b, dtype=float)
            y = forward_substitution(L, b)
            x = backward_substitution(U, y)
            results['solution'] = x.tolist()

        results['conclusion'] = "OK"
        return results
    except Exception as e:
        results['conclusion'] = f"Error: {e}"
        return results
