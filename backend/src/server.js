require("dotenv").config();

const app = require("./app");
const prisma = require("./prisma/client");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("----------------------------------");
  console.log(" College Admission Portal Backend");
  console.log("----------------------------------");
  console.log(` Server: http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
async function shutdown() {
  console.log("\nShutting down server...");

  server.close(async () => {
    await prisma.$disconnect();
    console.log("Database disconnected.");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);