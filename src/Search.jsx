import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMedicines } from "./api.js";
import { useAsync, useDebounce } from "./hooks.js";
import MedicineCard from "./MedicineCard.jsx";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get("q") ?? "";
  const [input, setInput] = useState(urlQuery);
  const debounced = useDebounce(input.trim());

  useEffect(() => {
    if (debounced !== urlQuery)
      setParams(debounced ? { q: debounced } : {}, { replace: true });
  }, [debounced]);

  const { data: results, loading, error } = useAsync(searchMedicines, urlQuery);

  return (
    <>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(input.trim() ? { q: input.trim() } : {}, { replace: true });
        }}
      >
        <input
          type="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by brand name, e.g. Advil"
          aria-label="Search medicines by brand name"
          autoFocus
        />
      </form>

      <div aria-live="polite">
        {!urlQuery && (
          <p className="state">Type a brand name to find medicines.</p>
        )}
        {loading && (
          <p className="state">
            <span className="spinner" /> Searching…
          </p>
        )}
        {error && (
          <p className="state error" role="alert">
            ⚠️ {error}
          </p>
        )}
        {!loading && !error && urlQuery && results?.length === 0 && (
          <p className="state">
            No results found for “{urlQuery}”. Check the spelling or try another
            brand.
          </p>
        )}
      </div>

      {!loading && results?.length > 0 && (
        <>
          <p className="count">
            {results.length} result{results.length > 1 ? "s" : ""}
          </p>
          <ul className="grid">
            {results.map((m) => (
              <MedicineCard key={m.id} medicine={m} />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
