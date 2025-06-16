import express from "express";

import { authenticateToken } from "../../middlewares/authenticate";
import { rateLimiter } from "../../middlewares/rateLimiter";
import { redisMemoMiddleware } from "../../middlewares/cacheMiddleware";

import urlController from "../../controllers/url.controller";
import redirectUrlController from "../../controllers/redirect.controller";
import analyticsUrlController from "../../controllers/analytics.controller";

// import urlSchema from "../../../schemas/user.schema";

const router = express.Router();

router.post(
  "/shorten",
  authenticateToken,
  rateLimiter,
  urlController.handleShortenUrl
);

router.get(
  "/:code",
  redisMemoMiddleware,
  authenticateToken,
  rateLimiter,
  redirectUrlController.redirectToOriginal
);
router.get(
  "/analytics/:code",
  redisMemoMiddleware,
  authenticateToken,
  rateLimiter,
  analyticsUrlController.getAnalytics
);

export default router;
