const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

const seedFortyRentals = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Listing.deleteMany();

    const users = [
      { id: '69cb7aac048f9e7ed8ff978d', name: 'Rahul' },
      { id: '69cb7ac0048f9e7ed8ff9794', name: 'kumar' },
      { id: '69cb7ada048f9e7ed8ff979b', name: 'devansh' },
      { id: '69cb7afc048f9e7ed8ff97a2', name: 'Mayank Dhingra' }
    ];

    const allListings = [];

    const rahulItems = [
      { title: "Modern 2BHK Apartment", desc: "Spacious with city views and 24/7 security.", price: 150, cat: "Real Estate", loc: "Mumbai", imgs: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", "https://images.unsplash.com/photo-1484154218962-a197022b5858"], attrs: [{k:"BHK", v:"2"}, {k:"Type", v:"Studio"}] },
      { title: "Nintendo Switch OLED", desc: "Vibrant screen, includes Mario Kart.", price: 12, cat: "Gaming", loc: "Chennai", imgs: ["https://images.unsplash.com/photo-1578303372704-14f24fd24c13", "https://images.unsplash.com/photo-1612033448550-9d6f9c17f07d", "https://images.unsplash.com/photo-1616110515159-8664157a41ec"], attrs: [{k:"Model", v:"OLED"}, {k:"Storage", v:"64GB"}] },
      { title: "Vintage Film Camera", desc: "Working 35mm camera for enthusiasts.", price: 30, cat: "Computer", loc: "Kolkata", imgs: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32", "https://images.unsplash.com/photo-1452784444945-3f422708fe5e", "https://images.unsplash.com/photo-1495707902641-75cac588d2e9"], attrs: [{k:"Format", v:"35mm"}] },
      { title: "Electric Bass Guitar", desc: "Yamaha 4-string with deep, rich tones.", price: 25, cat: "Music", loc: "Pune", imgs: ["https://images.unsplash.com/photo-1564186763535-ebb21ef5277f", "https://images.unsplash.com/photo-1583000280873-bfa66418d953", "https://images.unsplash.com/photo-1598113082333-f44350051689"], attrs: [{k:"Brand", v:"Yamaha"}] },
      { title: "JavaScript Mastery Book", desc: "The definitive guide to modern JS.", price: 5, cat: "Books", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1516116216624-53e697fedbea", "https://images.unsplash.com/photo-1589998059171-988d887df646", "https://images.unsplash.com/photo-1544947950-fa07a98d237f"], attrs: [{k:"Language", v:"English"}] },
      { title: "DJI Mini 3 Pro Drone", desc: "Ultralight drone with 4K camera.", price: 45, cat: "Computer", loc: "Bangalore", imgs: ["https://images.unsplash.com/photo-1508614589041-895b88991e3e", "https://images.unsplash.com/photo-1527977966376-1c8418f9f108", "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9"], attrs: [{k:"Res", v:"4K"}] },
      { title: "Mechanical Keyboard", desc: "RGB backlighting with Cherry MX Switches.", price: 8, cat: "Computer", loc: "Mumbai", imgs: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae", "https://images.unsplash.com/photo-1595225402772-2f3483325679", "https://images.unsplash.com/photo-1541140532154-b024d715b909"], attrs: [{k:"Type", v:"Mechanical"}] },
      { title: "Acoustic Foam Set", desc: "12 pack of studio soundproofing.", price: 10, cat: "Music", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04", "https://images.unsplash.com/photo-1519665019068-b9c472fe2b73", "https://images.unsplash.com/photo-1525201548942-d8b8bb0973a5"], attrs: [{k:"Pcs", v:"12"}] },
      { title: "Harry Potter Box Set", desc: "Complete 7-book collector set.", price: 15, cat: "Books", loc: "Noida", imgs: ["https://images.unsplash.com/photo-1541963463532-d68292c34b19", "https://images.unsplash.com/photo-1512820790803-83ca734da794", "https://images.unsplash.com/photo-1532012197367-6849412618d1"], attrs: [{k:"Books", v:"7"}] },
      { title: "Logitech G Pro Mouse", desc: "Superlight wireless gaming mouse.", price: 7, cat: "Gaming", loc: "Pune", imgs: ["https://images.unsplash.com/photo-1615663248861-2446a95bb088", "https://images.unsplash.com/photo-1527814050087-3793815479db", "https://images.unsplash.com/photo-1527866959612-399447d63021"], attrs: [{k:"Weight", v:"63g"}] }
    ];

    const kumarItems = [
      { title: "Sony PlayStation 5", desc: "Latest console with 2 DualSense controllers.", price: 20, cat: "Gaming", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db", "https://images.unsplash.com/photo-1607853202273-797f1c22a38e", "https://images.unsplash.com/photo-1622239434273-d2801bd764ca"], attrs: [{k:"Storage", v:"825GB"}] },
      { title: "The Hobbit Signed Ed.", desc: "Rare first edition with signature.", price: 25, cat: "Books", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f", "https://images.unsplash.com/photo-1512820790803-83ca734da794", "https://images.unsplash.com/photo-1589998059171-988d887df646"], attrs: [{k:"Author", v:"Tolkien"}] },
      { title: "Baby Grand Piano", desc: "Beautiful acoustic piano in mint condition.", price: 200, cat: "Music", loc: "Mumbai", imgs: ["https://images.unsplash.com/photo-1520529986993-349013f9c636", "https://images.unsplash.com/photo-1552422535-c45813c61732", "https://images.unsplash.com/photo-1571974599782-87624638275e"], attrs: [{k:"Type", v:"Grand"}] },
      { title: "Xbox Series X", desc: "True 4K gaming powerhouse.", price: 18, cat: "Gaming", loc: "Gurgaon", imgs: ["https://images.unsplash.com/photo-1621259182978-f09e5e2ca091", "https://images.unsplash.com/photo-1605901309584-818e2596038f", "https://images.unsplash.com/photo-1605898960710-91185f02f90a"], attrs: [{k:"Storage", v:"1TB"}] },
      { title: "Beachfront Villa", desc: "3BHK with direct beach access.", price: 500, cat: "Real Estate", loc: "Goa", imgs: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"], attrs: [{k:"BHK", v:"3"}] },
      { title: "Action Camera 4K", desc: "GoPro style camera with waterproof case.", price: 15, cat: "Computer", loc: "Manali", imgs: ["https://images.unsplash.com/photo-1502982722883-0e2a5e2d3d00", "https://images.unsplash.com/photo-1520116468816-95b69fac0973", "https://images.unsplash.com/photo-1514339414275-c990a4242661"], attrs: [{k:"Res", v:"4K"}] },
      { title: "Electric Violin", desc: "Silent violin for practice or performance.", price: 30, cat: "Music", loc: "Kolkata", imgs: ["https://images.unsplash.com/photo-1460039230329-eb0ae2d47f1c", "https://images.unsplash.com/photo-1551033418-4034237d4536", "https://images.unsplash.com/photo-1582173111451-2487440ba39f"], attrs: [{k:"Type", v:"Silent"}] },
      { title: "Atomic Habits", desc: "Best-selling self-improvement book.", price: 3, cat: "Books", loc: "Pune", imgs: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c", "https://images.unsplash.com/photo-1592492159418-39f319320569"], attrs: [{k:"Author", v:"James Clear"}] },
      { title: "Curved Gaming Monitor", desc: "32 inch 144Hz curved display.", price: 25, cat: "Computer", loc: "Bangalore", imgs: ["https://images.unsplash.com/photo-1527443224154-c4a3942d349c", "https://images.unsplash.com/photo-1547082299-de196ea013d6", "https://images.unsplash.com/photo-1593642702821-c8da6a59f033"], attrs: [{k:"Size", v:"32\""}] },
      { title: "Oculus Quest 2", desc: "Standalone VR headset with touch controllers.", price: 35, cat: "Gaming", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac", "https://images.unsplash.com/photo-1617802690992-15d93263d3a9", "https://images.unsplash.com/photo-1635323491416-565406b3f7be"], attrs: [{k:"Type", v:"VR"}] }
    ];

    const devanshItems = [
      { title: "MacBook Pro M3 Max", desc: "64GB RAM performance powerhouse.", price: 90, cat: "Computer", loc: "Bangalore", imgs: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "https://images.unsplash.com/photo-1611186871348-b1ec696e523b", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef"], attrs: [{k:"RAM", v:"64GB"}] },
      { title: "Studio Office Space", desc: "Quiet workspace with high-speed WiFi.", price: 40, cat: "Real Estate", loc: "Gurgaon", imgs: ["https://images.unsplash.com/photo-1497366216548-37526070297c", "https://images.unsplash.com/photo-1497366811353-6870744d04b2", "https://images.unsplash.com/photo-1431540015161-0bf868a2d407"], attrs: [{k:"Seats", v:"2"}] },
      { title: "Roland V-Drums", desc: "Electronic drum kit with mesh heads.", price: 60, cat: "Music", loc: "Mumbai", imgs: ["https://images.unsplash.com/photo-1519892300165-cb5542fb47c7", "https://images.unsplash.com/photo-1543443258-92b04ad5ecf7", "https://images.unsplash.com/photo-1519098901909-b1553a1190af"], attrs: [{k:"Type", v:"Electronic"}] },
      { title: "Dune - Special Ed.", desc: "Hardcover edition of the sci-fi epic.", price: 8, cat: "Books", loc: "Lucknow", imgs: ["https://images.unsplash.com/photo-1589829085413-56de8ae18c73", "https://images.unsplash.com/photo-1544947950-fa07a98d237f", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c"], attrs: [{k:"Author", v:"F. Herbert"}] },
      { title: "4K Laser Projector", desc: "Cinema experience in your home.", price: 70, cat: "Computer", loc: "Noida", imgs: ["https://images.unsplash.com/photo-1535016120720-40c646bebbfc", "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4", "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c"], attrs: [{k:"Brightness", v:"3000lm"}] },
      { title: "Razer Iskur Chair", desc: "Ergonomic gaming chair with lumbar support.", price: 15, cat: "Gaming", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1598550476439-6847785fce66", "https://images.unsplash.com/photo-1550745165-9bc0b252726f", "https://images.unsplash.com/photo-1616423641454-e0b621a6ea66"], attrs: [{k:"Type", v:"Gaming"}] },
      { title: "Penthouse Apartment", desc: "Luxurious top-floor living.", price: 800, cat: "Real Estate", loc: "Dubai", imgs: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd", "https://images.unsplash.com/photo-1493809842364-78817add7ffb"], attrs: [{k:"BHK", v:"4"}] },
      { title: "iPad Pro 12.9 Inch", desc: "Powerful tablet for artists and designers.", price: 40, cat: "Computer", loc: "Bangalore", imgs: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0", "https://images.unsplash.com/photo-1585517585953-882247b9721d", "https://images.unsplash.com/photo-1551028150-64b9f398f678"], attrs: [{k:"Chip", v:"M2"}] },
      { title: "Retro Arcade Cabinet", desc: "Full size cabinet with 1000+ games.", price: 50, cat: "Gaming", loc: "Mumbai", imgs: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f", "https://images.unsplash.com/photo-1523875194681-bedd468c58bf", "https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0"], attrs: [{k:"Games", v:"1000+"}] },
      { title: "Electric Cello", desc: "Professional electric cello for solos.", price: 45, cat: "Music", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1516280440614-37939bbacd81", "https://images.unsplash.com/photo-1552422535-c45813c61732", "https://images.unsplash.com/photo-1520529986993-349013f9c636"], attrs: [{k:"Type", v:"Electric"}] }
    ];

    const mayankItems = [
      { title: "Gibson Les Paul", desc: "Classic electric guitar, rich tone.", price: 55, cat: "Music", loc: "Pune", imgs: ["https://images.unsplash.com/photo-1516924912137-969e1262a2af", "https://images.unsplash.com/photo-1550985616-10810253b84d", "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f"], attrs: [{k:"Brand", v:"Gibson"}] },
      { title: "RTX 4090 Gaming PC", desc: "4K ultra machine with 144Hz monitor.", price: 100, cat: "Computer", loc: "Hyderabad", imgs: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5", "https://images.unsplash.com/photo-1547082299-de196ea013d6"], attrs: [{k:"GPU", v:"RTX 4090"}] },
      { title: "Loft Apartment", desc: "Open concept loft in the heart of the city.", price: 200, cat: "Real Estate", loc: "Mumbai", imgs: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", "https://images.unsplash.com/photo-1484154218962-a197022b5858", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"], attrs: [{k:"Type", v:"Loft"}] },
      { title: "Steam Deck 512GB", desc: "Powerful handheld gaming computer.", price: 15, cat: "Gaming", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1651478235282-588725f778a8", "https://images.unsplash.com/photo-1650395780283-74b868612702", "https://images.unsplash.com/photo-1651214041113-1496a759020c"], attrs: [{k:"Storage", v:"512GB"}] },
      { title: "Microphone Bundle", desc: "Shure SM7B + Focusrite Scarlett interface.", price: 25, cat: "Computer", loc: "Bangalore", imgs: ["https://images.unsplash.com/photo-1590602847861-f357a9332bbc", "https://images.unsplash.com/photo-1594435606411-9f939e099615", "https://images.unsplash.com/photo-1589156206699-bc21e38c8a7d"], attrs: [{k:"Mic", v:"SM7B"}] },
      { title: "Yamaha Keyboard", desc: "88 weighted keys, perfect for learners.", price: 30, cat: "Music", loc: "Delhi", imgs: ["https://images.unsplash.com/photo-1552422535-c45813c61732", "https://images.unsplash.com/photo-1516280440614-37939bbacd81", "https://images.unsplash.com/photo-1520529986993-349013f9c636"], attrs: [{k:"Keys", v:"88"}] },
      { title: "1984 - G. Orwell", desc: "First edition hardcover of the masterpiece.", price: 10, cat: "Books", loc: "Pune", imgs: ["https://images.unsplash.com/photo-1589998059171-988d887df646", "https://images.unsplash.com/photo-1544947950-fa07a98d237f", "https://images.unsplash.com/photo-1512820790803-83ca734da794"], attrs: [{k:"Author", v:"Orwell"}] },
      { title: "Professional Tripod", desc: "Carbon fiber, supports up to 10kg.", price: 10, cat: "Computer", loc: "Manali", imgs: ["https://images.unsplash.com/photo-1516724562728-afc824a36e84", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32", "https://images.unsplash.com/photo-1520116468816-95b69fac0973"], attrs: [{k:"Material", v:"Carbon"}] },
      { title: "Racing Sim Cockpit", desc: "Logitech wheel + pedals + racing seat.", price: 40, cat: "Gaming", loc: "Hyderabad", imgs: ["https://images.unsplash.com/photo-1547394765-185e1e68f34e", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5", "https://images.unsplash.com/photo-1587202372775-e229f172b9d7"], attrs: [{k:"Wheel", v:"G29"}] },
      { title: "Farmhouse Estate", desc: "Acres of land with a luxury home.", price: 1200, cat: "Real Estate", loc: "Lonavala", imgs: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", "https://images.unsplash.com/photo-1500076656116-558758c991c1"], attrs: [{k:"Land", v:"5 Acres"}] }
    ];

    const compile = (items, userId) => items.map(i => ({
      title: i.title, description: i.desc, basePrice: i.price, location: i.loc,
      category: i.cat, owner: userId, images: i.imgs, attributes: i.attrs
    }));

    allListings.push(...compile(rahulItems, users[0].id));
    allListings.push(...compile(kumarItems, users[1].id));
    allListings.push(...compile(devanshItems, users[2].id));
    allListings.push(...compile(mayankItems, users[3].id));

    await Listing.insertMany(allListings);
    console.log("Database seeded with 40 diverse listings!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFortyRentals();