import { redis } from "../infra/redis";
import db from "../db/db";

afterAll(async () => {
  await redis.quit();
  await db.sequelize.close();
});
