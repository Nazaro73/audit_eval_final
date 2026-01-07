import { Request, Response, NextFunction } from "express";
import pool from "../config/database";

export async function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();

  // Capturer la méthode de fin de réponse originale
  const originalSend = res.send;

  res.send = function (data?: any): Response {
    const endTime = Date.now();
    const responseTimeMs = endTime - startTime;

    // Enregistrer les métriques en async (ne pas bloquer la réponse)
    const userId = (req as any).userId || null;
    const endpoint = req.originalUrl.split('?')[0]; // Enlever les query params
    const method = req.method;
    const statusCode = res.statusCode;

    // Enregistrement asynchrone des métriques
    pool
      .query(
        `INSERT INTO api_metrics (endpoint, method, status_code, response_time_ms, user_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [endpoint, method, statusCode, responseTimeMs, userId]
      )
      .catch((err) => {
        console.error("Failed to log metrics:", err);
      });

    // Appeler la méthode originale
    return originalSend.call(this, data);
  };

  next();
}
