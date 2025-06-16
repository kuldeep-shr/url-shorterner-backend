import { AppDataSource } from "../../ormconfig";

async function truncateAllTables() {
  try {
    const connection = await AppDataSource.initialize();
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      const tableName = entity.tableName;

      await repository.query(
        `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`
      );
      console.log(`✅ Truncated table: ${tableName}`);
    }

    console.log("🎉 All tables truncated successfully.");
    await connection.destroy();
  } catch (error) {
    console.error("❌ Error truncating tables:", error);
    process.exit(1);
  }
}

truncateAllTables();
