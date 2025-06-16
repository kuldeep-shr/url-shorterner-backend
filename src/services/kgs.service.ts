import { AppDataSource } from "../../ormconfig";
import { KGSKey } from "../../entities/url/Kgs";

export class KGSService {
  static async getAvailableKey(): Promise<string | null> {
    const repoKeys = AppDataSource.getRepository(KGSKey);

    const key = await repoKeys
      .createQueryBuilder()
      .where("is_used = false")
      .orderBy("RANDOM()")
      .getOne();

    if (!key) return null;

    key.is_used = true;
    await repoKeys.save(key);

    return key.short_code;
  }
}
