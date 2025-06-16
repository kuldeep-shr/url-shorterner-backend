import express from "express";

import { authenticateToken } from "../../middlewares/authenticate";
import { customRateLimiter } from "../../middlewares/rateLimiter";
import { redisMemoMiddleware } from "../../middlewares/cacheMiddleware";

import urlController from "../../controllers/url.controller";
import redirectUrlController from "../../controllers/redirect.controller";
import analyticsUrlController from "../../controllers/analytics.controller";

// import urlSchema from "../../../schemas/user.schema";

const router = express.Router();

router.post(
  "/shorten",
  authenticateToken,
  customRateLimiter,
  urlController.handleShortenUrl
);

router.get(
  "/:code",
  redisMemoMiddleware,
  authenticateToken,
  customRateLimiter,
  redirectUrlController.redirectToOriginal
);
router.get(
  "/analytics/:code",
  redisMemoMiddleware,
  authenticateToken,
  customRateLimiter,
  analyticsUrlController.getAnalytics
);

export default router;
