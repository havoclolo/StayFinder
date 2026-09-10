import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Compound/Navbar";
import Footer from "./Compound/footer";

import Home from "./pages/home";
import Stays from "./pages/stays";
import StayDetails from "./pages/staysdetails";
import Booking from "./pages/booking";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stays" element={<Stays />} />
        <Route path="/stay/:id" element={<StayDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;