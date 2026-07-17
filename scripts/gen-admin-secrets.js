// One-off helper: node scripts/gen-admin-secrets.js "your-new-admin-password"
// Prints an ADMIN_PASS_HASH and a SESSION_SECRET to paste into .env.local / Vercel env vars.
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/gen-admin-secrets.js "your-new-admin-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const sessionSecret = crypto.randomBytes(32).toString("hex");

console.log("\nADMIN_PASS_HASH=" + hash);
console.log("SESSION_SECRET=" + sessionSecret + "\n");
