const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

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

        // Check if a wishlist with the same codename already exists
        const existingWishlist = await collection.findOne({ codename });

        if (existingWishlist) {
            // If it exists, update the wishlist
            await collection.updateOne(
                { codename },
                { $set: { wishlist } }
            );
            res.status(200).json({ message: 'Wishlist updated successfully' });
        } else {
            // If it doesn't exist, insert a new wishlist
            await collection.insertOne({ codename, wishlist });
            res.status(201).json({ message: 'Wishlist added successfully' });
        }
    } catch (error) {
        console.error('Error adding/updating wishlist:', error);
        res.status(500).json({ message: 'Failed to add/update wishlist' });
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
