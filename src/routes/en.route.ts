import { Router } from 'express';
import { getAllExtensionNumbers, getAllRegisteredExtensionNumbers, checkExtensionNumberIsRegistered } from '../controllers';

const enRouter = Router();

enRouter.get("/", getAllExtensionNumbers);
enRouter.get("/registered/:extension", checkExtensionNumberIsRegistered);
enRouter.get("/registered", getAllRegisteredExtensionNumbers);

export { enRouter };