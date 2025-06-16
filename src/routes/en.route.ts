import { Router } from 'express';
import { getAllExtensionNumbers, getAllRegisteredExtensionNumbers } from '../controllers';

const enRouter = Router();

enRouter.get("/", getAllExtensionNumbers);
enRouter.get("/registered", getAllRegisteredExtensionNumbers);

export { enRouter };