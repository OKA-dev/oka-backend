import { Request, Response, NextFunction } from 'express'

export function logger(req: Request, res: Response, next: NextFunction) {
  const now = Date()
  console.log(`[LOG] ${now}=> ${req.method} ${req.url}`)
  next()
}
