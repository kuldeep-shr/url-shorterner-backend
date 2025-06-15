import express from "express";

import { authenticateToken } from "../../middlewares/authenticate";

import urlController from "../../controllers/url.controller";
import redirectUrlController from "../../controllers/redirect.controller";

// import urlSchema from "../../../schemas/user.schema";

const router = express.Router();

router.get("/:code", redirectUrlController.redirectToOriginal);
router.post("/shorten", authenticateToken, urlController.handleShortenUrl);

export default router;
