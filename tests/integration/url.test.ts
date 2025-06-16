import request from "supertest";
import app from "../../src/config/express";

let token: string;

beforeAll(async () => {
  // Optionally, get a token if needed
  const res = await request(app)
    .post("/api/user/auth/register")
    .send({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "Test@1234",
    });
  token = res.body.token;
});

describe("URL Shortener API", () => {
  let shortCode: string;

  test("POST /api/url/shorten - should create a short URL", async () => {
    const response = await request(app)
      .post("/api/url/shorten")
      .set("Authorization", `Bearer ${token}`)
      .send({
        original_url: "https://example.com",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.short_code).toBeDefined();
    shortCode = response.body.data.short_code;
  });

  test("GET /api/url/:code - should redirect to the original URL", async () => {
    const response = await request(app).get(`/${shortCode}`).send();
    expect([301, 302]).toContain(response.status);
    expect(response.headers.location).toBe("https://example.com");
  });

  test("GET /api/url/analytics/:code - should return analytics data", async () => {
    const response = await request(app)
      .get(`/api/v1/analytics/${shortCode}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("short_code");
    expect(response.body.data).toHaveProperty("total_redirects");
    expect(response.body.data).toHaveProperty("last_accesses");
    expect(response.body.data).toHaveProperty("referrer_stats");
    expect(response.body.data).toHaveProperty("country_stats");
  });
});

// tests/integration/user.test.ts
// describe("User Auth API", () => {
//   let testEmail = `user${Date.now()}@test.com`;

//   test("POST /api/v1/auth/register - should register a user and return token", async () => {
//     const res = await request(app).post("/api/v1/auth/register").send({
//       name: "Test User",
//       email: testEmail,
//     });

//     expect(res.status).toBe(200);
//     expect(res.body.token).toBeDefined();
//   });

//   test("POST /api/v1/auth/login - should login and return token", async () => {
//     const res = await request(app).post("/api/v1/auth/login").send({
//       email: testEmail,
//     });

//     expect(res.status).toBe(200);
//     expect(res.body.token).toBeDefined();
//   });
// });
