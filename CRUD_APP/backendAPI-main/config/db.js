import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.DB_PORT || '27017';
const dbName = process.env.DB_DATABASE || 'prueba';
const dbUri = process.env.MONGODB_URI || `mongodb://${dbHost}:${dbPort}/${dbName}`;

// Construir la URI de MongoDB
const uri = dbUri;
console.log('MongoDB URI:', dbUri);

const client = new MongoClient(dbUri, {
  maxPoolSize: 50,
  connectTimeoutMS: 20000,
  socketTimeoutMS: 45000,
  waitQueueTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB database');
    return client.db(dbName);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

client.on('error', (err) => {
  console.error('MongoDB Error:', err);
});

process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

export { client, connectDB };