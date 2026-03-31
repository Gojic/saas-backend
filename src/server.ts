import "dotenv/config";
import app from "./app";
import { ensureRedis } from "./infra/redis";
//docker compose --profile dev up --build

/*process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED_REJECTION", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT_EXCEPTION", err);
  process.exit(1);
}); */

const PORT = parseInt(process.env.PORT || "8080", 10);
(async () => {
  try {
    await ensureRedis();
    console.log("✅ Redis connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error(" connection error:", error);
    process.exit(1);
  }
})();
