import { useParams, Link } from "react-router-dom";
import stays from "../data/stays";

function StayDetails() {

  const { id } = useParams();

  const stay = stays.find(
    (item) => item.id === Number(id)
  );

  if (!stay) {
    return <h2>Stay not found</h2>;
  }

  return (
    <main className="details-page">

      <img
        src={stay.image}
        alt={stay.name}
        className="details-image"
      />

      <div className="details-content">

        <div>
          <h1>{stay.name}</h1>

          <p className="location">
            📍 {stay.location}
          </p>

          <p>
            ⭐ {stay.rating}
          </p>

          <h2>
            ₦{stay.price.toLocaleString()} / night
          </h2>

          <p>
            {stay.description}
          </p>

          <h3>Amenities</h3>

          <div className="amenities">
            {stay.amenities.map((amenity) => (
              <span key={amenity}>
                ✓ {amenity}
              </span>
            ))}
          </div>

        </div>

        <div className="booking-card">

          <h2>
            ₦{stay.price.toLocaleString()}
          </h2>

          <p>per night</p>

          <Link
            to={`/booking/${stay.id}`}
            className="book-button"
          >
            Book Now
          </Link>

        </div>

      </div>

    </main>
  );
}

export default StayDetails;