const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Listing = require('./models/Listing');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const mockListings = [
  {
    title: "Eco-Friendly Treehouse",
    description: "A sustainable luxury stay in the heart of the forest.",
    category: "Real Estate",
    basePrice: 120,
    location: "Uluwatu, Bali",
    images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"],
    attributes: [
      { k: "Building type", v: "Treehouse" },
      { k: "Floors", v: "2" },
      { k: "Bedrooms", v: "1 Bedroom, 1 Bed" }
    ]
  },
  {
    title: "Sony PlayStation 5 Pro",
    description: "Experience the next generation of gaming with 8K support.",
    category: "Gaming",
    basePrice: 15,
    location: "New Delhi, DL",
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3"],
    attributes: [
      { k: "Platform", v: "PS5 Pro" },
      { k: "Storage", v: "2TB SSD" },
      { k: "Controllers", v: "2x DualSense Edge" }
    ]
  },
  {
    title: "Modern Condo - City Center",
    description: "Minimalist living with a panoramic view of the skyline.",
    category: "Real Estate",
    basePrice: 85,
    location: "George Town",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750"],
    attributes: [
      { k: "Building type", v: "Condo" },
      { k: "Floors", v: "1" },
      { k: "Bedrooms", v: "2 Bedrooms, 2 Beds" }
    ]
  },
  {
    title: "Fender Stratocaster 1964",
    description: "Vintage sound for professional recordings.",
    category: "Music",
    basePrice: 45,
    location: "Mumbai, MH",
    images: ["https://images.unsplash.com/photo-1550291652-6ea9114a47b1"],
    attributes: [
      { k: "Instrument", v: "Electric Guitar" },
      { k: "Condition", v: "Vintage" },
      { k: "Case", v: "Hard Shell Included" }
    ]
  }
];

const importData = async () => {
  try {
    await Listing.deleteMany();
    
    const adminUser = await User.findOne(); // Assigns these to the first user found in DB
    
    if (!adminUser) {
      console.log("Error: Create a user first via Hoppscotch!");
      process.exit();
    }

    const sampleListings = mockListings.map(listing => {
      return { ...listing, owner: adminUser._id };
    });

    await Listing.insertMany(sampleListings);
    console.log('Mock Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();