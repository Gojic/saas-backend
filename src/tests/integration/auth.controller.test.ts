import request from "supertest";
import app from "../../app";
import { sequelize } from "../../db/models";
import db from "../../db/db";
import { redis, ensureRedis } from "../../infra/redis";
//docker-compose -f docker-compose.dev.yml --profile test up --build --exit-code-from app-test

let email: string;

beforeAll(async () => {
  await ensureRedis();
});

beforeEach(async () => {
  await ensureRedis();
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  const models = sequelize.models;
  for (const modelName of Object.keys(models)) {
    await models[modelName].destroy({ where: {}, truncate: { cascade: true } });
  }
  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

  email = `test${Date.now()}@test.com`;
  await redis.flushAll();
});
describe("Auth Integration Tests", () => {
  /** RATE LIMIT TEST */
  it("should return 422/429 when rate limit is exceeded", async () => {
    for (let i = 0; i < 10; i++) {
      await request(app).post("/api/auth/login").send({
        email: email,
        password: "wrong-password",
      });
    }

    const res = await request(app).post("/api/auth/login").send({
      email: email,
      password: "wrong-password",
    });

    expect(res.status).toBe(429);
    expect(res.body.code).toBe("TOO_MANY_ATTEMPTS");
  });
});

afterAll(async () => {
  if (redis.isOpen) {
    await redis.quit();
  }
  await db.sequelize.close();
});
