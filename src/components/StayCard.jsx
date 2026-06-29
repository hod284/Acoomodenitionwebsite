import { Link } from "react-router-dom";
import { StarIcon } from "./icons/index.jsx";
import { won } from "../utils/format.js";

export default function StayCard({ stay }) {
  return (
    <Link to={`/stays/${stay.id}`} className="sn-card">
      <div className="sn-card-imgwrap">
        <img src={stay.cover} alt={stay.name} className="sn-card-img" />
        <span className="sn-card-tag">{stay.tag}</span>
      </div>
      <div className="sn-card-body">
        <div className="sn-card-toprow">
          <h3>{stay.name}</h3>
          <span className="sn-rating">
            <StarIcon className="sn-star" />
            {stay.rating}
          </span>
        </div>
        <p className="sn-card-region">
          {stay.region} · 후기 {stay.reviewCount}
        </p>
        <p className="sn-card-price">
          <strong>{won(stay.price)}</strong> / 1박
        </p>
      </div>
    </Link>
  );
}
