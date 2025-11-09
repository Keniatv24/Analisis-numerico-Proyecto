from django.urls import path
from .views import test_calculations, calculate_regla_falsa, calculate_secant, calculate_multiple_roots, calculate_biseccion
from .views import calculate_fixed_point, calculate_newton, calculate_jacobi, calculate_gaussSeidel, calculate_sor
from .views import calculate_lu_simple, calculate_lu_pivoteo, calculate_crout, calculate_doolittle, calculate_cholesky

urlpatterns = [
    path('test/', test_calculations, name='test_calculations'),
    path('reglaFalsa/', calculate_regla_falsa, name='calculate_regla_falsa'),
    path('secante/', calculate_secant, name='calculate_secant'),
    path('raicesMultiples/', calculate_multiple_roots, name='calculate_multiple_roots'),
    path('biseccion/', calculate_biseccion, name='calculate_biseccion'),
    path('puntoFijo/', calculate_fixed_point, name='calculate_fixed_point'),
    path('newton/', calculate_newton, name='calculate_newton'),
    path('cap2/jacobi/', calculate_jacobi, name='calculate_jacobi'),
    path('cap2/gaussSeidel/', calculate_gaussSeidel, name='calculate_gaussSeidel'),
    path('cap2/sor/', calculate_sor, name='calculate_sor'),
    path('cap2/lu/', calculate_lu_simple, name='calculate_lu_simple'),
    path('cap2/lu_pivoteo/', calculate_lu_pivoteo, name='calculate_lu_pivoteo'),
    path('cap2/crout/', calculate_crout, name='calculate_crout'),
    path('cap2/doolittle/', calculate_doolittle, name='calculate_doolittle'),
    path('cap2/cholesky/', calculate_cholesky, name='calculate_cholesky'),
    path('cap4/lu/', calculate_lu_simple, name='calculate_lu_simple_cap4'),
    path('cap4/lu_pivoteo/', calculate_lu_pivoteo, name='calculate_lu_pivoteo_cap4'),
    path('cap4/crout/', calculate_crout, name='calculate_crout_cap4'),
    path('cap4/doolittle/', calculate_doolittle, name='calculate_doolittle_cap4'),
    path('cap4/cholesky/', calculate_cholesky, name='calculate_cholesky_cap4'),
]