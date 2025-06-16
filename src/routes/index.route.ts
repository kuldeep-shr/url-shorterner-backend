import * as express from "express";

import userAuth from "./user/auth.route";
import urlAuth from "./url/url.routes";

const router = express.Router();

router.use("/user/auth", userAuth);
router.use("/url", urlAuth);

export default router;
