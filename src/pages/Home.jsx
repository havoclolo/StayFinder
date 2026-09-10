import SearchBar from "../Compound/searchbar";
import StayCard from "../Compound/staycard";
import stays from "../data/stays";

function Home() {
  return (
    <main>

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">
          <h1>Find your perfect stay</h1>

          <p>
            Discover beautiful homes, apartments and hotels
            for your next trip.
          </p>
        </div>

        <SearchBar />

      </section>


      {/* Popular Stays */}
      <section className="popular">

        <div className="section-heading">
          <h2>Popular stays</h2>

          <p>
            Explore some of our most popular accommodations.
          </p>
        </div>


        <div className="stay-grid">

          {stays.map((stay) => (
            <StayCard
              key={stay.id}
              stay={stay}
            />
          ))}

        </div>

      </section>

    </main>
  );
}

export default Home;