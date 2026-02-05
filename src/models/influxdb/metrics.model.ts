// Gestion des métriques avec InfluxDB

import { Point } from '@influxdata/influxdb-client';
import { getInfluxWriteApi, getInfluxQueryApi } from '../../config/database.js';
import { env } from '../../config/env.js';

export type MetricType = 'api_request' | 'user_activity' | 'custom';

export interface MetricData {
  measurement: MetricType;
  tags: Record<string, string>;
  fields: Record<string, number | string | boolean>;
}

// Écrire une métrique
export const writeMetric = async (data: MetricData) => {
  const writeApi = getInfluxWriteApi();
  const point = new Point(data.measurement);

  // Ajouter les tags
  Object.entries(data.tags).forEach(([key, value]) => {
    point.tag(key, value);
  });

  // Ajouter les champs
  Object.entries(data.fields).forEach(([key, value]) => {
    if (typeof value === 'number') {
      point.floatField(key, value);
    } else if (typeof value === 'boolean') {
      point.booleanField(key, value);
    } else {
      point.stringField(key, value);
    }
  });

  writeApi.writePoint(point);
  await writeApi.flush();
};

// Enregistrer une requête API (pour les stats)
export const recordApiRequest = async (
  method: string,
  path: string,
  statusCode: number,
  duration: number
) => {
  try {
    await writeMetric({
      measurement: 'api_request',
      tags: { method, path, status: statusCode.toString() },
      fields: { duration, count: 1 },
    });
  } catch (err) {
    // On log l'erreur mais on ne bloque pas la requête
    console.error('Erreur enregistrement métrique:', err);
  }
};

// Enregistrer une activité utilisateur
export const recordUserActivity = async (userId: string, action: string) => {
  try {
    await writeMetric({
      measurement: 'user_activity',
      tags: { userId, action },
      fields: { count: 1 },
    });
  } catch (err) {
    console.error('Erreur enregistrement activité:', err);
  }
};

// Requêter les métriques
export const queryMetrics = async (measurement: MetricType, range: string = '-1h') => {
  const queryApi = getInfluxQueryApi();
  const results: any[] = [];

  const query = `
    from(bucket: "${env.INFLUXDB_BUCKET}")
      |> range(start: ${range})
      |> filter(fn: (r) => r._measurement == "${measurement}")
  `;

  return new Promise((resolve, reject) => {
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        results.push(tableMeta.toObject(row));
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(results);
      },
    });
  });
};
