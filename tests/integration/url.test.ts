import request from "supertest";
import app from "../../src/config/express";
import { AppDataSource } from "../../ormconfig";

let token: string;

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Optionally, get a token if needed
  const res = await request(app)
    .post("/api/user/auth/register")
    .send({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "Test@1234",
    });

  token = res.body.data.token;
});

describe("URL Shortener API", () => {
  let code: string;

  test("POST /api/url/shorten - should create a short URL", async () => {
    const response = await request(app)
      .post("/api/url/shorten")
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.short_code).toBeDefined();
    code = response.body.data.short_code;
  });

  test("GET /:code - should redirect to the original URL", async () => {
    const response = await request(app)
      .get(`/api/url/${code}`)
      .set("Authorization", `Bearer ${token}`);
    expect([301, 302]).toContain(response.status);
    expect(response.headers.location).toBe("https://example.com");
  });

  test("GET /api/url/analytics/:code - should return analytics data", async () => {
    const response = await request(app)
      .get(`/api/url/analytics/${code}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("short_code");
    expect(response.body.data).toHaveProperty("total_redirects");
    expect(response.body.data).toHaveProperty("last_accesses");
    expect(response.body.data).toHaveProperty("referrer_stats");
    expect(response.body.data).toHaveProperty("country_stats");
  });
});

describe("User Auth API", () => {
  let testEmail = `kuldeep${Date.now()}@test.com`;

  test("POST /api/user/auth/register - should register a user and return token", async () => {
    const res = await request(app).post("/api/user/auth/register").send({
      name: "Kuldeep",
      email: testEmail,
      password: "@12Kuldeep",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
  });

  test("POST /api/user/auth/login - should login and return token", async () => {
    const res = await request(app).post("/api/user/auth/login").send({
      email: testEmail,
      password: "@12Kuldeep",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});
