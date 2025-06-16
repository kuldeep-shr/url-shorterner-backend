const base: string = "/api";
const adminBase: string = "/admin";

export default {
  url: {
    base,
    adminBase,
  },
  timers: {
    userCookieExpiry: "720h",
  },
  env: {
    authSecret: process.env.TOKEN_SECRET_KEY || "test",
  },
  authorizationIgnorePath: [
    `${base}/user/auth/login`,
    `${base}/user/auth/register`,
    `${adminBase}/dashboard`, // Allow dashboard viewing without auth (if public)
  ],
};
