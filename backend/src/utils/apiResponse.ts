import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {})
  };

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
) => {
  const payload: ApiResponse = {
    success: false,
    message,
    ...(error ? { error } : {})
  };

  return res.status(statusCode).json(payload);
};
