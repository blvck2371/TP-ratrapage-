// Service Metrics - logique pour les métriques InfluxDB

import { writeMetric, queryMetrics, MetricData, MetricType } from '../models/influxdb/metrics.model.js';

// Écrire une métrique
export const createMetric = async (data: MetricData) => {
  await writeMetric(data);
};

// Récupérer les métriques
export const getMetrics = async (measurement: MetricType, range: string) => {
  return queryMetrics(measurement, range);
};

// Récupérer les stats des requêtes API
export const getApiStats = async (range: string = '-1h') => {
  const results = await queryMetrics('api_request', range) as any[];
  
  if (results.length === 0) {
    return {
      totalRequests: 0,
      avgDuration: 0,
    };
  }

  const totalRequests = results.length;
  const totalDuration = results.reduce((sum, r) => sum + (r._value || 0), 0);

  return {
    totalRequests,
    avgDuration: Math.round(totalDuration / totalRequests),
  };
};
