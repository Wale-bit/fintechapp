import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

console.log('Database Config:', {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD, // Check if this is undefined
  database: process.env.DATABASE_NAME,
});

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'new_password', // Default fallback
  database: process.env.DATABASE_NAME || 'fintech_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
});

export default AppDataSource;