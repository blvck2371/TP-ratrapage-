// Schemas de validation pour les métriques (Zod)

import { z } from 'zod';

// Écrire une métrique
export const createMetricSchema = z.object({
  body: z.object({
    measurement: z.enum(['api_request', 'user_activity', 'custom']),
    tags: z.record(z.string()),
    fields: z.record(z.union([z.number(), z.string(), z.boolean()])),
  }),
});

// Requêter les métriques
export const queryMetricsSchema = z.object({
  query: z.object({
    measurement: z.enum(['api_request', 'user_activity', 'custom']),
    range: z.string().default('-1h'),
  }),
});

export type CreateMetricInput = z.infer<typeof createMetricSchema>;
export type QueryMetricsInput = z.infer<typeof queryMetricsSchema>;
