import request from "supertest";
import { app } from "../../app";
import { prisma } from "../../database";
import { signupAndGetTokens } from "../helpers/auth.helpers";
import { describe, expect, it } from "vitest";


describe("Admin Role", () => {
  it("admin should update role", async () => {
    const admin = await signupAndGetTokens();
    const user = await signupAndGetTokens();

    await prisma.user.update({
      where: { id: admin.user.id },
      data: { role: "ADMIN" },
    });

    const login = await request(app)
      .post("/auth/signin")
      .send({
        email: admin.user.email,
        password: "password123",
      });

    const accessToken = login.body.data.tokens.accessToken;

    const res = await request(app)
      .patch(`/admin/${user.user.id}/role`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ role: "ANALYST" });

    expect(res.status).toBe(200);
  });

  it("viewer should NOT update role", async () => {
    const viewer = await signupAndGetTokens();
    const user = await signupAndGetTokens();

    const res = await request(app)
      .patch(`/admin/${user.user.id}/role`)
      .set("Authorization", `Bearer ${viewer.accessToken}`)
      .send({ role: "ADMIN" });

    expect(res.status).toBe(403);
  });
});