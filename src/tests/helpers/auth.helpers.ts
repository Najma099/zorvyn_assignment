import request from "supertest";
import { app } from "../../app";


export async function signupAndGetTokens() {
  const password = "password123";
  const email = `test_${Date.now()}@test.com`;
  const res = await request(app)
    .post("/auth/signup")
    .send({ name: "Test", email, password });

  return {
    user: res.body.data.user,
    accessToken: res.body.data.tokens.accessToken,
    refreshToken: res.body.data.tokens.refreshToken,
    email,    
    password,   
  };
}