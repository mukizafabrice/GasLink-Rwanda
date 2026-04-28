import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/apiResponse';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
};

export default notFoundHandler;
