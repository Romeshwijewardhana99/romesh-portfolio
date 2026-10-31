import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";
import { slugify } from "../src/lib/slugify.js";

const technologies = [
  { name: "React", category: "FRONTEND", sortOrder: 10 },
  { name: "Next.js", category: "FRONTEND", sortOrder: 20 },
  { name: "Tailwind CSS", category: "FRONTEND", sortOrder: 30 },
  { name: "Node.js", category: "BACKEND", sortOrder: 40 },
  { name: "MySQL", category: "DATABASE", sortOrder: 50 },
  { name: "Prisma", category: "DATABASE", sortOrder: 60 },
  { name: "Git", category: "TOOL", sortOrder: 70 },
];

async function main() {
  const results = await prisma.$transaction(async (tx) => {
    const saved = [];

    for (const technology of technologies) {
      const slug = slugify(technology.name);
      const existing = await tx.technology.findFirst({
        where: { OR: [{ name: technology.name }, { slug }] },
      });

      saved.push(
        existing
          ? await tx.technology.update({
              where: { id: existing.id },
              data: technology,
            })
          : await tx.technology.create({
              data: { ...technology, slug, isVisible: true },
            }),
      );
    }

    return saved;
  });

  console.table(
    results.map(({ name, category, sortOrder }) => ({ name, category, sortOrder })),
  );
}

main()
  .catch((error) => {
    console.error("Technology seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
