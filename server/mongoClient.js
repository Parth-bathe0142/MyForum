const { MongoClient } = require('mongodb')
require('dotenv').config()
let client = new MongoClient(process.env.CONNECTION_STRING)
let isConnected = false
async function connectDB() {
    try {
        if (isConnected) {
            return client
        } else {
            isConnected = true
            await client.connect()
            return client
        }
    } catch (error) {
        throw error
    }
}

function closeDB() {
    if (isConnected) {
        client.close()
    }
}

module.exports = { client, connectDB, closeDB }



process.on('SIGINT', async () => {
    console.log("Shutting down the server...");
    if (client) {
        closeDB()
        console.log("Database connection closed.");
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log("Received termination signal...");
    if (client) {
        closeDB()
        console.log("Database connection closed.");
    }
    process.exit(0);
});