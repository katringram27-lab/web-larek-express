import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Внутренняя ошибка сервера'
    : err.message;
  res.status(statusCode).json({
    message,
  });
};

export default errorHandler;
