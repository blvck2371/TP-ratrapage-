// Validation des variables d'environnement avec Zod

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Schema pour valider les variables d'env
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  
  // MongoDB
  MONGODB_URI: z.string().default('mongodb://localhost:27017/api_database'),
  
  // InfluxDB
  INFLUXDB_URL: z.string().default('http://localhost:8086'),
  INFLUXDB_TOKEN: z.string().min(1),
  INFLUXDB_ORG: z.string().default('my-org'),
  INFLUXDB_BUCKET: z.string().default('metrics'),
});

// On valide et on exporte
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Erreur config environnement:', result.error.format());
  process.exit(1);
}

export const env = result.data;
