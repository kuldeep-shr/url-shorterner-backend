import * as express from "express";

import adminRoute from "./admin/admin.route";

const router = express.Router();

router.use("/", adminRoute);

export default router;
