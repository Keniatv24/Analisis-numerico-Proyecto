import numpy as np
from .LU_simple import forward_substitution, backward_substitution

def lu_pivoteo_parcial(A, b=None):
    """PA = LU con pivoteo parcial. Retorna P, L, U (+ solución si se envía b)."""
    results = {'P': None, 'L': None, 'U': None, 'solution': None, 'conclusion': None}
    A = np.array(A, dtype=float)
    n, m = A.shape
    if n != m:
        results['conclusion'] = "La matriz A debe ser cuadrada."
        return results

    P = np.eye(n)
    L = np.zeros((n, n), dtype=float)
    U = A.copy()

    try:
        for k in range(n):
            pivot = np.argmax(np.abs(U[k:, k])) + k
            if U[pivot, k] == 0:
                results['conclusion'] = "Matriz singular."
                return results
            if pivot != k:
                U[[k, pivot], :] = U[[pivot, k], :]
                P[[k, pivot], :] = P[[pivot, k], :]
                L[[k, pivot], :k] = L[[pivot, k], :k]

            L[k, k] = 1.0
            for i in range(k+1, n):
                L[i, k] = U[i, k] / U[k, k]
                U[i, k:] -= L[i, k] * U[k, k:]

        results['P'] = P
        results['L'] = L
        results['U'] = U

        if b is not None:
            b = np.array(b, dtype=float)
            if b.shape[0] != n:
                results['conclusion'] = "Dimensión de b incompatible con A."
                return results
            Pb = P @ b
            y = forward_substitution(L, Pb)
            x = backward_substitution(U, y)
            results['solution'] = x.tolist()

        results['conclusion'] = "OK"
        return results

    except Exception as e:
        results['conclusion'] = f"Error: {e}"
        return results
