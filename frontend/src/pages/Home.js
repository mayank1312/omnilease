import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import ListingCard from '../components/ListingCard';
import styles from './Home.module.css';
import { Search } from 'lucide-react';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [sortType, setSortType] = useState('Newest First');
  const { categoryName } = useParams(); 
  const [searchInput, setSearchInput] = useState('');

  const fetchListings = async (searchQuery = '') => {
    try {
      let endpoint = '/listings?';
      if (categoryName) endpoint += `category=${categoryName}&`;
      if (searchQuery) endpoint += `search=${searchQuery}`;
      
      const { data } = await API.get(endpoint);
      setListings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [categoryName]); 

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(searchInput);
  };

  const sortedListings = useMemo(() => {
    let sortable = [...listings];
    switch (sortType) {
      case 'Price: Low to High':
        return sortable.sort((a, b) => a.basePrice - b.basePrice);
      case 'Price: High to Low':
        return sortable.sort((a, b) => b.basePrice - a.basePrice);
      case 'Newest First':
        return sortable.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sortable;
    }
  }, [listings, sortType]);

  return (
    <div className={styles.container}>
      {!categoryName && (
        <header className={styles.hero}>
          <h1>Everything you need,<br /><span>without the commitment.</span></h1>
          <p>Rent high-end gear, homes, and tools from people in your community.</p>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <div className={styles.inputWrapper}>
              <Search size={20} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button className={styles.searchButton} type="submit">Search</button>
          </form>
        </header>
      )}
      
      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className="serif">
            {categoryName ? `${categoryName} Rentals` : 'Featured Rentals'}
          </h2>
        </div>
        
        <div className={styles.controlBar}>
          <span className={styles.itemCount}>{listings.length} items available</span>
          <select 
            className={styles.sortSelect}
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="Newest First">Newest First</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>

        {sortedListings.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No items found. Try a different search or category.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {sortedListings.map(item => (
              <ListingCard key={item._id} listing={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;