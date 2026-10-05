import { useEffect, useState } from "react";

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useAsync(fetcher, arg) {
  const [state, setState] = useState({
    data: null,
    loading: !!arg,
    error: null,
  });

  useEffect(() => {
    if (!arg) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher(arg, ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) => {
        if (e.name === "AbortError") return;
        setState({
          data: null,
          loading: false,
          error: e.message || "Network error",
        });
      });
    return () => ctrl.abort();
  }, [fetcher, arg]);

  return state;
}
