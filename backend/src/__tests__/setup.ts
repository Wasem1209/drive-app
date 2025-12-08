// Jest test setup
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment defaults
process.env.NODE_ENV = 'test';
process.env.BLOCKFROST_KEY = process.env.BLOCKFROST_KEY || 'test_blockfrost_key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/autofy_test';
