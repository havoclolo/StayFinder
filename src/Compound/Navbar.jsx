import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/home" className="brand">StayFinder</Link>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/stays">Stays</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <button>Sign In</button>
    </nav>
  );
}

export default Navbar;