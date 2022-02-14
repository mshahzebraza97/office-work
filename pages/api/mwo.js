import {
  getAllMWOs,
  deleteMWO,
  createMWO,
  updateMWO
} from '../../server/controllers/mwoController';

import connectDB from '../../server/config/config'
import nextConnect from 'next-connect';

connectDB();
const ncHandler = nextConnect()


ncHandler.get(getAllMWOs);
ncHandler.delete(deleteMWO);
ncHandler.post(createMWO);
ncHandler.patch(updateMWO)

export default ncHandler;
