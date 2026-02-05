// Middleware de gestion des erreurs

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Middleware pour gérer toutes les erreurs
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erreur:', err);

  // Erreur de validation Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Erreur de validation',
      details: err.errors,
    });
  }

  // Erreur MongoDB duplicate key
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'Donnée déjà existante',
    });
  }

  // Erreur par défaut
  res.status(500).json({
    success: false,
    error: 'Erreur serveur',
  });
};

// Middleware pour les routes non trouvées
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} non trouvée`,
  });
};
