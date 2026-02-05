// Middleware de validation avec Zod

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

// Factory pour créer un middleware de validation
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valide body, query et params
      const result = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Remplace par les données validées
      req.body = result.body;
      req.query = result.query as any;
      req.params = result.params as any;

      next();
    } catch (error) {
      next(error);
    }
  };
};
