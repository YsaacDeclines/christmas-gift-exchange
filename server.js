const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let cachedClient = null;

async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        cachedClient = client;
        return client;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/wishlist', async (req, res) => {
    try {
        const { codename, wishlist } = req.body;
        const client = await connectToDatabase();
        const database = client.db('christmas_gift_exchange');
        const collection = database.collection('wishlists');

        await collection.insertOne({ codename, wishlist });
        res.status(201).json({ message: 'Wishlist added successfully' });
    } catch (error) {
        console.error('Error adding wishlist:', error);
        res.status(500).json({ message: 'Failed to add wishlist' });
    }
});

app.get('/api/wishlist', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const database = client.db('christmas_gift_exchange');
        const collection = database.collection('wishlists');

        const wishlistItems = await collection.find().toArray();
        res.json(wishlistItems);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
});

// Test MongoDB connection
app.get('/test-db', async (req, res) => {
    try {
        await connectToDatabase();
        res.json({ message: 'Database connection successful' });
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
});

module.exports = app;
