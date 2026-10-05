import { memo } from "react";
import { Link } from "react-router-dom";
import { first, join } from "./util.js";

export default memo(function MedicineCard({ medicine }) {
  const o = medicine.openfda ?? {};
  const rows = [
    ["Generic", join(o.generic_name)],
    ["Manufacturer", join(o.manufacturer_name)],
    ["Route", join(o.route)],
  ].filter(([, v]) => v);

  return (
    <li>
      <Link to={`/medicine/${medicine.id}`} className="card">
        <div className="card-head">
          <h2>{first(o.brand_name) ?? "Unnamed medicine"}</h2>
          {first(o.product_type) && (
            <span className="badge">{first(o.product_type)}</span>
          )}
        </div>
        <dl>
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Link>
    </li>
  );
});
