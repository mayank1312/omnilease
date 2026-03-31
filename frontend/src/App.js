import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreateListing from './pages/CreateListing';
import ListingDetails from './pages/ListingDetails';
import EditListing from './pages/EditListing';
import MyListings from './pages/MyListings';
import Success from './pages/Success';
import Messages from './pages/Messages';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/listing/:id" element={<ListingDetails />} />
        <Route path="/edit/:id" element={<EditListing />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;