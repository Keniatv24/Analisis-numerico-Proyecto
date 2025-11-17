import numpy as np
from .LU_simple import forward_substitution, backward_substitution

def crout(A, b=None):
    """Factorización LU estilo Crout (diag(U)=1)."""
    results = {'L': None, 'U': None, 'solution': None, 'conclusion': None}
    A = np.array(A, dtype=float)
    n, m = A.shape
    if n != m:
        results['conclusion'] = "La matriz A debe ser cuadrada."
        return results

    L = np.zeros_like(A)
    U = np.eye(n)

    try:
        for j in range(n):
            for i in range(j, n):
                L[i, j] = A[i, j] - np.dot(L[i, :j], U[:j, j])
            for i in range(j+1, n):
                if L[j, j] == 0:
                    results['conclusion'] = "Pivote cero en L."
                    return results
                U[j, i] = (A[j, i] - np.dot(L[j, :j], U[:j, i])) / L[j, j]

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
