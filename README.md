# iShop

iShop is a complete electronic e-commerce site, providing end-to-end functionality for browsing, filtering, and purchasing electronic products online.

## Features

- Browse products by category
- View detailed product specifications
- Responsive design for desktop and mobile
- Product filtering
- Built with React (frontend) and Node.js/Express/PostgreSQL (backend)

## Project Structure

- `frontend/` — React app (Vite)
- `backend/` — Express API server

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- PostgreSQL

### Frontend Setup

1. `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env` file in the `frontend/` directory with `VITE_BACKEND_URL=http://localhost:5000`
4. Start dev server: `npm run dev`

### Backend Setup

1. `cd backend`
2. Install dependencies: `npm install`
3. Configure your database in `backend/config/db.js`
4. Set up your backend `.env` file in the `backend/` directory with your PostgreSQL credentials (e.g., `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, `PGPORT`).
5. Start server: `npm run dev`

### Database Setup

Create a PostgreSQL database and a table named `products` with the following columns:

- `id` (SERIAL PRIMARY KEY): Unique identifier for each product.
- `name` (VARCHAR): Name of the product.
- `description` (TEXT): Short description of the product.
- `category` (VARCHAR): Category name (e.g., "laptops", "phones").
- `main_image` (VARCHAR): URL or path to the main product image.
- `price` (NUMERIC): Product price.

### Usage

- Visit `http://localhost:5173` to use the app.
- Click on a category from the homepage to view products.
- Click on a product for specifications.

## License

MIT
