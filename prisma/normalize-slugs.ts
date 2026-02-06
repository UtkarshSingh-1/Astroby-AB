import { prisma } from '../src/lib/prisma';

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

async function main() {
  const services = await prisma.service.findMany();
  for (const service of services) {
    const current = service.slug?.trim();
    if (!current) {
      await prisma.service.update({
        where: { id: service.id },
        data: { slug: toSlug(service.name) },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
