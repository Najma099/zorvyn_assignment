import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../database";
import { signupAndGetTokens } from "../helpers/auth.helpers";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { tokenInfo } from "../../config";

console.log(tokenInfo);

beforeAll(async () => {
  await prisma.keystore.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Auth Flow", () => {
  it("should signup and return tokens", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({
        name: "Test",
        email: `test_${Date.now()}@test.com`,
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.tokens.accessToken).toBeDefined();
    expect(res.body.data.tokens.refreshToken).toBeDefined();
  });

  it("should create keystore entry in DB", async () => {
    const { user } = await signupAndGetTokens();

    const keystore = await prisma.keystore.findFirst({
      where: {
        clientId: user.id,
        status: true,
      },
    });

    expect(keystore).not.toBeNull();
  });

  it("should allow request with valid token", async () => {
    const { accessToken } = await signupAndGetTokens();

    const res = await request(app)
      .get("/records")
      .query({ skip: 0, take: 10 }) 
      .set("Authorization", `Bearer ${accessToken}`)

    expect(res.status).toBe(200);
  });

  it("should reject if keystore deleted", async () => {
    const { accessToken, user } = await signupAndGetTokens();

    await prisma.keystore.deleteMany({
      where: { clientId: user.id },
    });

    const res = await request(app)
      .get("/records")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(res.status).toBe(401);
  });

  it("should reject if keystore inactive", async () => {
    const { accessToken, user } = await signupAndGetTokens();

    await prisma.keystore.updateMany({
      where: { clientId: user.id },
      data: { status: false },
    });

    const res = await request(app)
      .get("/records")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(res.status).toBe(401);
  });
});