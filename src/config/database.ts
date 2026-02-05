// Connexions aux bases de données MongoDB et InfluxDB

import mongoose from 'mongoose';
import { InfluxDB, WriteApi, QueryApi } from '@influxdata/influxdb-client';
import { env } from './env.js';

// === MongoDB avec Mongoose ===

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur connexion MongoDB:', error);
    throw error;
  }
};

// === InfluxDB ===

const influxClient = new InfluxDB({
  url: env.INFLUXDB_URL,
  token: env.INFLUXDB_TOKEN,
});

let writeApi: WriteApi | null = null;
let queryApi: QueryApi | null = null;

export const connectInfluxDB = () => {
  writeApi = influxClient.getWriteApi(env.INFLUXDB_ORG, env.INFLUXDB_BUCKET, 'ns');
  queryApi = influxClient.getQueryApi(env.INFLUXDB_ORG);
  console.log('InfluxDB connecté');
};

export const getInfluxWriteApi = () => {
  if (!writeApi) throw new Error('InfluxDB non connecté');
  return writeApi;
};

export const getInfluxQueryApi = () => {
  if (!queryApi) throw new Error('InfluxDB non connecté');
  return queryApi;
};

// Fermer les connexions proprement
export const closeDatabases = async () => {
  await mongoose.connection.close();
  if (writeApi) await writeApi.close();
  console.log('Connexions fermées');
};
