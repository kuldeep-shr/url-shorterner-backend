import "reflect-metadata";
import { AppDataSource } from "../../ormconfig";

const initDB = async () => {
  try {
    await AppDataSource.initialize();
    const queryRunner = AppDataSource.createQueryRunner();

    const tables = await queryRunner.getTables([
      "user_auth",
      "short_urls",
      "url_access_logs",
    ]);

    if (tables.length === 3) {
      console.log("✅ Tables already exist. Skipping creation.");
    } else {
      console.log("📦 Creating missing tables...");
      await AppDataSource.synchronize();
      console.log("✅ Tables created or updated.");
    }

    await queryRunner.release();
    await AppDataSource.destroy();
  } catch (err) {
    console.error("❌ Error during DB initialization:", err);
    process.exit(1);
  }
};

initDB();
