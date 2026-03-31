# OmniLease | Peer-to-Peer Rental Marketplace

OmniLease is a comprehensive full-stack marketplace application designed to facilitate the rental of high-end goods, real estate, and equipment within a community. It bridges the gap between owners with underutilized assets and individuals seeking short-term access to premium items without the burden of full ownership.

---

## Technical Stack

### Frontend
* **React.js**: Functional components with Hooks for state and lifecycle management.
* **React Router DOM**: Client-side routing for seamless navigation.
* **Lucide React**: Vector-based iconography for a clean, modern interface.
* **Socket.io-client**: Real-time bidirectional communication for instant messaging.
* **CSS Modules**: Scoped styling to prevent global namespace pollution and ensure component-level styling integrity.

### Backend
* **Node.js and Express**: High-performance server environment and RESTful API routing.
* **MongoDB and Mongoose**: NoSQL database for flexible data modeling and efficient querying.
* **Socket.io**: Server-side WebSocket integration for real-time updates and notification dispatching.
* **JWT (JSON Web Tokens)**: Secure, stateless authentication for user sessions.
* **Bcrypt.js**: Industry-standard password hashing for sensitive data protection.

### Third-Party Integrations
* **Stripe API**: Secure payment processing and automated checkout sessions.
* **Cloudinary**: Cloud-based storage and optimization for listing images.

---

## Core Features

### 1. Dynamic Marketplace and Discovery
The home page features a sophisticated filtering and sorting system. Users can browse listings by category (Real Estate, Gaming, Music, Tech, Books) and sort items by price or date created. The search functionality allows for real-time querying of the database to find specific items.

### 2. Intelligent Listing Management
Owners can list items through a multi-step form that adapts based on the selected category. For example, selecting "Real Estate" triggers fields for BHK and Furnishing, while "Music" requests Instrument Type and Brand.

### 3. Contextual Real-Time Messaging
A unified messaging system allows buyers and sellers to communicate. The system is designed to group conversations by participant while maintaining the context of the specific product being discussed. Instant unread badges and real-time socket updates keep users engaged.

### 4. Secure Booking and Payments
Integration with Stripe ensures that financial transactions are handled securely. The booking modal calculates total costs based on selected dates, including a platform service fee, before generating a secure checkout URL.

### 5. Personal Dashboard
The Dashboard serves as a command center where users can:
* Manage their active inventory (Edit/Delete listings).
* Track their current rentals from other owners.
* View recent activity and notifications regarding bookings or messages.

---

## System Architecture and Workflow

### User Authentication Workflow
1. User provides credentials through the Auth component.
2. Backend validates data and hashes passwords for new accounts.
3. A JWT is generated and returned to the client.
4. The token is stored in LocalStorage and attached to the Authorization header for all subsequent private API calls.

### Listing Creation Workflow
1. User fills out the dynamic form and selects local images.
2. Images are uploaded directly to Cloudinary; the server receives only the secure URLs.
3. The listing object, including category-specific attributes, is saved to MongoDB.
4. The marketplace grid updates to include the new item.

### Rental and Notification Workflow
1. A buyer selects dates and initiates the Stripe Checkout.
2. Upon successful payment, Stripe redirects the user to the Success page.
3. The backend updates the rental records and triggers a Socket.io event.
4. The owner receives a real-time notification in their dashboard and a badge update in their navbar.

---

## Installation and Setup

### Prerequisites
* Node.js (v16.0 or higher)
* MongoDB Atlas Account or Local MongoDB Instance
* Cloudinary Account
* Stripe Account

### Backend Setup
1. Navigate to the backend directory.
2. Create a .env file with the following keys:
   * MONGO_URI
   * JWT_SECRET
   * STRIPE_SECRET_KEY
   * CLOUDINARY_CLOUD_NAME
   * CLOUDINARY_UPLOAD_PRESET
3. Run `npm install` followed by `npm start`.

### Frontend Setup
1. Navigate to the frontend directory.
2. Create a .env file with the following keys:
   * REACT_APP_STRIPE_PUBLISHABLE_KEY
   * REACT_APP_CLOUDINARY_CLOUD_NAME
   * REACT_APP_CLOUDINARY_UPLOAD_PRESET
3. Run `npm install` followed by `npm start`.
