import express from "express";

import urlController from "../../controllers/url.controller";
// import urlSchema from "../../../schemas/user.schema";

const router = express.Router();

router.post("/shorten", urlController.handleShortenUrl);

export default router;
