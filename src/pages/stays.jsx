import StayCard from "../Compound/staycard";
import stays from "../data/stays";

function Stays() {
  return (
    <main className="stays-page">

      <div className="page-heading">
        <h1>Find your perfect stay</h1>
        <p>Explore our available accommodations.</p>
      </div>

      <div className="stay-grid">
        {stays.map((stay) => (
          <StayCard
            key={stay.id}
            stay={stay}
          />
        ))}
      </div>

    </main>
  );
}

export default Stays;