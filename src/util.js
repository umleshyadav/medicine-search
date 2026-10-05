export const toList = (v) =>
  (v == null ? [] : Array.isArray(v) ? v : [v]).filter(Boolean);
export const first = (v) => toList(v)[0];
export const join = (v) => toList(v).join(", ");
