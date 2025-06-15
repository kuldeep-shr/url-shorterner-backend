import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./entities/user/User";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: true,
});
