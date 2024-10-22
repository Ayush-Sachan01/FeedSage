// lib/astraClient.ts
import { DataAPIClient } from '@datastax/astra-db-ts';
import dotenv from 'dotenv';

dotenv.config();

const client = new DataAPIClient(process.env.ASTRA_DB_APPLICATION_TOKEN as string);
export const db = client.db(process.env.ASTRA_DB_BASE_URL as string);
