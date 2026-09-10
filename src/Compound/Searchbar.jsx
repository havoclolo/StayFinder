function SearchBar() {
  return (
    <div className="search-box">

      <div>
        <label>Location</label>
        <input
          type="text"
          placeholder="Where do you want to stay?"
        />
      </div>

      <div>
        <label>Check in</label>
        <input type="date" />
      </div>

      <div>
        <label>Check out</label>
        <input type="date" />
      </div>

      <div>
        <label>Guests</label>
        <input
          type="number"
          placeholder="Guests"
          min="1"
        />
      </div>

      <button>Search</button>

    </div>
  );
}

export default SearchBar;