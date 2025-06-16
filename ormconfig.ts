import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./entities/user/User";
import { ShortUrl } from "./entities/url/ShortUrl";
import { UrlAccessLog } from "./entities/url/UrlAccessLog";
import { KGSKey } from "./entities/url/Kgs";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, ShortUrl, UrlAccessLog, KGSKey],
  synchronize: true,
  // logging: true,
  // logger: "advanced-console",
});
