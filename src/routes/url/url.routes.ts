import express from "express";

import { authenticateToken } from "../../middlewares/authenticate";

import urlController from "../../controllers/url.controller";
import redirectUrlController from "../../controllers/redirect.controller";
import analyticsUrlController from "../../controllers/analytics.controller";

// import urlSchema from "../../../schemas/user.schema";

const router = express.Router();

router.post("/shorten", authenticateToken, urlController.handleShortenUrl);

router.get(
  "/:code",
  authenticateToken,
  redirectUrlController.redirectToOriginal
);
router.get(
  "/analytics/:code",
  authenticateToken,
  analyticsUrlController.getAnalytics
);

export default router;
