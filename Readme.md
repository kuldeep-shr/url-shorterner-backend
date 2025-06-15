# ✂️ TinyLink – The URL Shortener Backend (Made with ❤️ by Kuldeep)

> **Shrink it. Track it. Secure it.**  
> A blazing-fast, scalable Node.js + TypeScript backend boilerplate for shortening URLs, now with JWT authentication built-in!

<p align="center">
  <img src="https://img.shields.io/badge/Author-Kuldeep-blueviolet?style=flat-square"/>
  <img src="https://img.shields.io/badge/Built%20With-Node.js%2C%20Express%2C%20TypeScript%2C%20TypeORM-brightgreen?style=flat-square"/>
</p>

---

## ✨ Why TinyLink?

Because long URLs are boring.

This project gives you a ready-to-roll backend for a URL shortener service, including:

- 🔐 JWT-authenticated user login & registration
- 🔗 URL shortening with unique short codes
- 🚀 Instant redirect support
- 🎯 Production-ready structure (TypeORM, PM2, etc.)

---

## 🏗️ Built With

- ⚡ [Express](https://expressjs.com/) – Fast, unopinionated web framework
- 🧙 [TypeScript](https://www.typescriptlang.org/) – Strongly-typed JavaScript
- 🧱 [TypeORM](https://typeorm.io/) – Elegant TypeScript ORM
- 🔐 [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – JWT-based auth
- 🧠 Designed and developed by **Kuldeep**

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and add the following variables:

`PORT:`whatever you prefer but not 3000(it doesn't suits us 😆)

`JWT_SECRET:` your_super_secret_key

`DATABASE_URL:` postgres neon link

`NODE_ENV:` development or production

<br />

## 🚀 Getting Started

```
yarn install
yarn watch-ts
```

<br />

## 🏭 Production

```
# Compile TypeScript
yarn build

# Run the app
yarn start

```

## 🔌 Available APIs

    🔌 For Available APIs

    | Method | Endpoint                | Description           |
    | ------ | ----------------------- | --------------------- |
    | POST   | `/api/v1/auth/register` | Register a new user & token   |
    | POST   | `/api/v1/auth/login`    | Login & get JWT token |

    ✂️ URL Shortening

    | Method | Endpoint          | Description                       |
    | ------ | ----------------- | --------------------------------- |
    | POST   | `/api/url/shorten` | Shorten a URL (JWT required)      |
    | GET    | `api/url/:code`   | Redirect to the original long URL |

<br />

## 🧪 Postman Collection

Soon, I'll share the button which redirect to you on the postman

## ✅ TODO

<ul>
  <li>✅ JWT-based user authentication (Register + Login)</li>
  <li>✅ Secure URL shortening with unique codes</li>
  <li>✅ Public redirection endpoint</li>
  <li>⬜ Click analytics (track total hits)</li>
  <li>⬜ Redis-based caching for faster redirects</li>
  <li>⬜ Custom alias support for short codes</li>
  <li>⬜ Docker setup</li>
  <li>⬜ Test cases</li>
</ul>

✅ = Completed
⬜ = Pending

## 🧙 Author

Made with ❤️ by Kuldeep

“A great URL doesn't need to be long — just smart.” 🔗✨
