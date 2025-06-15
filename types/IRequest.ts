import { Request } from "express";
import { User } from "../entities/user/User";

export default interface IRequest extends Request {
  user: User;
  dashboard: boolean;
}
