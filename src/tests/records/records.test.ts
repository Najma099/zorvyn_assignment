import request from "supertest";
import { app } from "../../app";
import { signupAndGetTokens } from "../helpers/auth.helpers";
import { describe, expect, it } from "vitest";
import { prisma } from "../../database";


describe("Records API", () => {
  it("admin can create record", async () => {
    const user = await signupAndGetTokens();

    await prisma.user.update({
      where: { id: user.user.id },
      data: { role: "ADMIN" },
    });

    // 🔥 re-login to get fresh token
    const login = await request(app)
      .post("/auth/signin")
      .send({ email: user.email, password: user.password });

    const accessToken = login.body.data.tokens.accessToken;

    const res = await request(app)
      .post("/records")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        amount: 100,
        category: "FOOD",
        recordType: "EXPENSE",
        notes: "test",
        date: new Date().toISOString(),
      });

    expect(res.status).toBe(200);
  });

  it("viewer cannot create record", async () => {
    const user = await signupAndGetTokens();

    const res = await request(app)
      .post("/records")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({
        amount: 100,
        category: "FOOD",
        recordType: "EXPENSE",
      });

    expect(res.status).toBe(403);
  });

  it("unauthenticated user cannot create record", async () => {
    const res = await request(app)
      .post("/records")
      .send({
        amount: 100,
        category: "FOOD",
        recordType: "EXPENSE",
      });

    expect(res.status).toBe(400); 
  });
});