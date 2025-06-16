import express from "express";
const morgan = require("morgan");
import * as bodyParser from "body-parser";
import application from "../constants/application";
import path from "path";

/*
    all routes
*/
import indexRoute from "../routes/index.route";
import adminRoute from "../routes/index-admin.route";

// import authenticate from "../middlewares/authenticate";
// import joiErrorHandler from "../middlewares/joiErrorHandler";
import * as errorHandler from "../middlewares/apiErrorHandler";

const app = express();

require("dotenv").config();
app.use(bodyParser.json());

app.use(morgan("dev"));

// app.use(authenticate);

// Router
app.use(application.url.base, indexRoute);
app.use(application.url.adminBase, adminRoute);

// Static files for CSS
app.use(express.static(path.join(__dirname, "../../public")));

// View engine setup
app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs");
// Joi Error Handler
// app.use(joiErrorHandler);
// Error Handler
app.use(errorHandler.notFoundErrorHandler);

app.use(errorHandler.errorHandler);

export default app;
