import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  let array = [];
  for (let i = 0; i < 100; i++) {
    array.push({
      publicId: `test${i}`,
      name: `test${i}`,
      userId: "cltn0czcm000011zyer720k4s",
    });
  }
  const results = await db.album.createMany({
    data: array,
    skipDuplicates: true,
  });

  console.log(results);
}

main()
  .then(async () => {
    await db.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await db.$disconnect();

    process.exit(1);
  });
