import api from "./config";

export const postVandermonde = async ({ points, x_eval }) => {
  const { data } = await api.post("calculations/cap3/vandermonde/", { points, x_eval });
  return data;
};

export const postNewtonInterpolante = async ({ points, x_eval }) => {
  const { data } = await api.post("calculations/cap3/newton/", { points, x_eval });
  return data;
};

export const postLagrange = async ({ points, x_eval }) => {
  const { data } = await api.post("calculations/cap3/lagrange/", { points, x_eval });
  return data;
};

export const postSplineLineal = async ({ points, x_eval }) => {
  const { data } = await api.post("calculations/cap3/spline_lineal/", { points, x_eval });
  return data;
};

export const postSplineCubico = async ({ points, x_eval }) => {
  const { data } = await api.post("calculations/cap3/spline_cubico/", { points, x_eval });
  return data;
};
