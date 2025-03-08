# Coffee Store Server

A **RESTful API** for managing coffee products and users in the Coffee Store application. Built using **Node.js, Express, and MongoDB**, this server provides CRUD operations for coffee items and user management.

## Features
- **User Management** – Add and retrieve users from the database.
- **Coffee Management** – Create, read, update, and delete coffee items.
- **MongoDB Integration** – Uses **MongoDB Atlas** for database storage.
- **CORS Configuration** – Supports frontend requests from specified origins.

## Tech Stack
```json
{
  "Server": "Node.js, Express.js",
  "Database": "MongoDB Atlas",
  "Deployment": "Vercel"
}
```

## API Reference

### User Endpoints
#### Add a new user
```http
POST /users
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### Get all users
```http
GET /users
```

### Coffee Endpoints
#### Get all coffee items
```http
GET /cofees
```

#### Get a single coffee item
```http
GET /cofees/{id}
```

#### Add a new coffee item
```http
POST /cofees
```

**Request Body:**
```json
{
  "name": "Espresso",
  "price": 5.99,
  "category": "Black Coffee"
}
```

#### Update a coffee item
```http
PUT /cofees/{id}
```

**Request Body:**
```json
{
  "name": "Latte",
  "price": 6.99
}
```

#### Delete a coffee item
```http
DELETE /cofees/{id}
```

## Setup and Installation
```sh
# Clone the repository
git clone https://github.com/mojahid-t17/cofee-store-server.git

# Install dependencies
npm install

# Create a .env file and add MongoDB credentials
USER_NAME=yourMongoDBUsername
USER_PASS=yourMongoDBPassword
PORT=5000

# Start the server
nodemon index.js


```

## Deployment
This server deployed on **Vercel**.

## Demo
🔗 **Live Server**: [Coffee Store Server](https://cofee-store-server-roan.vercel.app)

