import request from "supertest";
import { app } from "../../app";
import { signupAndGetTokens } from "../helpers/auth.helpers";
import { describe, expect, it } from "vitest";


describe("Dashboard", () => {
  it("should return balance", async () => {
    const user = await signupAndGetTokens();

    const res = await request(app)
      .get("/dashboard/balance")
      .set("Authorization", `Bearer ${user.accessToken}`)

    expect(res.status).toBe(200);
  });
});