import { Request, Response } from "express";

export default interface IController {
  (req: Request, res: Response): void;
}
