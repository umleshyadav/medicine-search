import { Link, useNavigate, useParams } from "react-router-dom";
import { getMedicine } from "./api.js";
import { useAsync } from "./hooks.js";
import { first, join, toList } from "./util.js";

const TEXT_SECTIONS = [
  ["purpose", "Purpose"],
  ["indications_and_usage", "Indications & usage"],
  ["active_ingredient", "Active ingredient"],
  ["dosage_and_administration", "Dosage & administration"],
  ["warnings", "Warnings"],
  ["do_not_use", "Do not use"],
  ["ask_doctor", "Ask a doctor before use"],
  ["stop_use", "Stop use and ask a doctor if"],
  ["contraindications", "Contraindications"],
  ["adverse_reactions", "Adverse reactions"],
  ["inactive_ingredient", "Inactive ingredients"],
  ["storage_and_handling", "Storage & handling"],
];

const OPENFDA_FIELDS = [
  ["generic_name", "Generic name"],
  ["substance_name", "Substance"],
  ["manufacturer_name", "Manufacturer"],
  ["product_type", "Product type"],
  ["route", "Route"],
  ["pharm_class_epc", "Pharmacologic class"],
  ["application_number", "Application no."],
  ["rxcui", "RxCUI"],
  ["unii", "UNII"],
];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  
  const { data: m, loading, error } = useAsync(getMedicine, id);

  const goBack = () =>
    window.history.state?.idx > 0 ? navigate(-1) : navigate("/");

  return (
    <>
      <button type="button" className="back" onClick={goBack}>
        ← Back to results
      </button>

      {loading && (
        <p className="state">
          <span className="spinner" /> Loading…
        </p>
      )}
      {error && (
        <p className="state error" role="alert">
          ⚠️ {error}
        </p>
      )}
      {!loading && !error && m === null && (
        <p className="state">
          Medicine not found. <Link to="/">Search again</Link>
        </p>
      )}

      {m && <Body m={m} />}
    </>
  );
}

function Body({ m }) {
  const o = m.openfda ?? {};
  const facts = OPENFDA_FIELDS.map(([k, label]) => [label, join(o[k])]).filter(
    ([, v]) => v,
  );
  const sections = TEXT_SECTIONS.map(([k, label]) => [
    label,
    toList(m[k]),
  ]).filter(([, v]) => v.length);

  return (
    <article>
      <h1>{first(o.brand_name) ?? "Unnamed medicine"}</h1>
      {toList(o.brand_name).length > 1 && (
        <p className="muted">
          Also: {toList(o.brand_name).slice(1).join(", ")}
        </p>
      )}

      {facts.length > 0 && (
        <dl className="facts">
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {sections.map(([label, paras], i) => (
        <details key={label} open={i < 2}>
          <summary>{label}</summary>
          {paras.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </details>
      ))}
      {sections.length === 0 && (
        <p className="muted">
          No additional label text is available for this medicine.
        </p>
      )}
    </article>
  );
}
