import { Link } from "react-router-dom";

function StayCard({ stay }) {
  return (
    <div className="stay-card">
      <img src={stay.image} alt={stay.name} />

      <div className="stay-info">
        <h3>{stay.name}</h3>

        <p className="location">📍 {stay.location}</p>

        <p>{stay.description}</p>

        <div className="stay-bottom">
          <strong>₦{stay.price.toLocaleString()}</strong>

          <span>⭐ {stay.rating}</span>
        </div>

        <Link to={`/stay/${stay.id}`} className="stay-card-link">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default StayCard;