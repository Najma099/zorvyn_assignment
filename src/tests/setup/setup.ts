import { beforeEach } from "vitest";
import { prisma } from "../../database/index";

beforeEach(async () => {
  await prisma.keystore.deleteMany();
  await prisma.financeRecord.deleteMany();
  await prisma.user.deleteMany();
});