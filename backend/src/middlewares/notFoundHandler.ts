import { Request, Response, NextFunction } from 'express';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
};

export default notFoundHandler;