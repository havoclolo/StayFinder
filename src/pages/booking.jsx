import { useParams } from "react-router-dom";
import { useState } from "react";
import stays from "../data/stays";

function Booking() {

  const { id } = useParams();

  const stay = stays.find(
    (item) => item.id === Number(id)
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {

    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function handleSubmit(event) {

    event.preventDefault();

    setMessage(
      "Your booking request has been submitted successfully!"
    );
  }

  if (!stay) {
    return <h2>Stay not found</h2>;
  }

  return (
    <main className="booking-page">

      <div className="booking-container">

        <div className="booking-form">

          <h1>Book your stay</h1>

          <p>
            {stay.name}
          </p>

          <form onSubmit={handleSubmit}>

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />


            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />


            <label>
              Check-in
            </label>

            <input
              type="date"
              name="checkIn"
              value={form.checkIn}
              onChange={handleChange}
              required
            />


            <label>
              Check-out
            </label>

            <input
              type="date"
              name="checkOut"
              value={form.checkOut}
              onChange={handleChange}
              required
            />


            <label>
              Number of Guests
            </label>

            <input
              type="number"
              name="guests"
              min="1"
              value={form.guests}
              onChange={handleChange}
              required
            />


            <button type="submit">
              Confirm Booking
            </button>

          </form>

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

        </div>


        <div className="booking-summary">

          <img
            src={stay.image}
            alt={stay.name}
          />

          <h2>{stay.name}</h2>

          <p>📍 {stay.location}</p>

          <h3>
            ₦{stay.price.toLocaleString()} / night
          </h3>

          <p>
            ⭐ {stay.rating}
          </p>

        </div>

      </div>

    </main>
  );
}

export default Booking;