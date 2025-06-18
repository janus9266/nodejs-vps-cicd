import { Router, Request, Response } from 'express';
import { enRouter } from './en.route';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use("/en", enRouter);

export { router }; 