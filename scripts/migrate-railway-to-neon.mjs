import { PrismaClient } from "@prisma/client";

const sourceUrl = process.env.SOURCE_DATABASE_URL;
const targetUrl = process.env.TARGET_DATABASE_URL;

if (!sourceUrl || !targetUrl) {
  console.error(
    "Missing env vars. Set SOURCE_DATABASE_URL and TARGET_DATABASE_URL."
  );
  process.exit(1);
}

const source = new PrismaClient({ datasources: { db: { url: sourceUrl } } });
const target = new PrismaClient({ datasources: { db: { url: targetUrl } } });

const tables = [
  ["user", "User"],
  ["service", "Service"],
  ["verificationToken", "VerificationToken"],
  ["otp", "Otp"],
  ["account", "Account"],
  ["session", "Session"],
  ["userProfile", "UserProfile"],
  ["consultation", "Consultation"],
  ["consultationReport", "ConsultationReport"],
  ["kundliCalculation", "KundliCalculation"],
];

const chunk = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

try {
  for (const [delegate, label] of tables) {
    const sourceCount = await source[delegate].count();
    if (sourceCount === 0) {
      console.log(`${label}: source=0, inserted=0`);
      continue;
    }

    const rows = await source[delegate].findMany();
    let inserted = 0;

    for (const batch of chunk(rows, 200)) {
      const res = await target[delegate].createMany({
        data: batch,
        skipDuplicates: true,
      });
      inserted += res.count;
    }

    const targetCount = await target[delegate].count();
    console.log(
      `${label}: source=${sourceCount}, inserted=${inserted}, target_total=${targetCount}`
    );
  }

  console.log("DATA_MIGRATION_COMPLETED");
} catch (err) {
  console.error("DATA_MIGRATION_FAILED");
  console.error(err);
  process.exitCode = 1;
} finally {
  await source.$disconnect();
  await target.$disconnect();
}
