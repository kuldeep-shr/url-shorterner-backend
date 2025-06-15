import { DataSource } from "typeorm";
import { config } from "dotenv";
// import { User } from "../../entities/User";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  //   entities: [User],
  synchronize: true,
});
