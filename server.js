require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/wishlist', async (req, res) => {
    try {
        const { codename, wishlist } = req.body;
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
        const database = client.db('christmas_gift_exchange');
        const collection = database.collection('wishlists');

        const wishlistItems = await collection.find().toArray();
        res.json(wishlistItems);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Failed to fetch wishlist' });
    }
});

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});