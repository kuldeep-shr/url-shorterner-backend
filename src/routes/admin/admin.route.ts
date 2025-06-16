import express from "express";
import { celebrate } from "celebrate";

import adminController from "../../controllers/adminController";
// import userSchema from "../../../schemas/user.schema";

const router = express.Router();

router.get("/dashboard", adminController.renderAdminDashboard);

export default router;
