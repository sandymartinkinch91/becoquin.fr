# Software Licensing API (Node.js + Express)

HWID-locked licensing backend built with **Node.js + Express + Sequelize**.

- Single activation per license key  
- HWID binding (SHA-256 hashed)  
- Always-online validation  
- No expiration dates  
- Admin-protected endpoints for generating and revoking keys  

---

## Features

| Endpoint                  | Method | Auth          | Description                          |
|---------------------------|--------|---------------|--------------------------------------|
| `/licenses/generate`      | POST   | Admin API Key | Generate one or more license keys    |
| `/licenses/activate`      | POST   | None          | Bind a license to a HWID             |
| `/licenses/validate`      | POST   | None          | Check if license + HWID is valid     |
| `/licenses/:key`          | GET    | Admin API Key | Get license details                  |
| `/licenses/:key/revoke`   | POST   | Admin API Key | Revoke a license                     |

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and set a strong ADMIN_API_KEY

# 3. Run the server
npm start
# or with auto-reload (Node 18+)
npm run dev
```

Server runs at: http://localhost:3000

---

## Deploy on Render

1. Push this project to a GitHub repository.
2. Go to [render.com](https://render.com) → **New +** → **Web Service**.
3. Connect your repository.
4. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Create a **PostgreSQL** database (free tier works).
6. Add Environment Variables:
   - `DATABASE_URL` → copy the **Internal Database URL** from the PostgreSQL service  
     (Render usually provides it with `?sslmode=require` — the code handles SSL automatically)
   - `ADMIN_API_KEY` → generate a strong random string (`openssl rand -hex 32`)
7. Deploy.

---

## Usage Examples

### Generate licenses (Admin)
```bash
curl -X POST "https://your-app.onrender.com/licenses/generate" \
  -H "X-Admin-API-Key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"count": 5, "notes": "Customer XYZ"}'
```

### Activate a license
```bash
curl -X POST "https://your-app.onrender.com/licenses/activate" \
  -H "Content-Type: application/json" \
  -d '{"key": "ABCD-EFGH-IJKL-MNOP", "hwid": "your-machine-hwid"}'
```

### Validate a license
```bash
curl -X POST "https://your-app.onrender.com/licenses/validate" \
  -H "Content-Type: application/json" \
  -d '{"key": "ABCD-EFGH-IJKL-MNOP", "hwid": "your-machine-hwid"}'
```

---

## Client-side HWID example (Node.js)

```js
const os = require("os");
const crypto = require("crypto");
const axios = require("axios"); // or use fetch

function getHwid() {
  // Simple example – you can make this stronger
  const networkInterfaces = os.networkInterfaces();
  const macs = Object.values(networkInterfaces)
    .flat()
    .filter((i) => i && i.mac && i.mac !== "00:00:00:00:00:00")
    .map((i) => i.mac);
  return macs[0] || os.hostname();
}

const API_URL = "https://your-app.onrender.com";

async function activate(key) {
  const res = await axios.post(`${API_URL}/licenses/activate`, {
    key,
    hwid: getHwid(),
  });
  console.log(res.data);
}

async function isValid(key) {
  const res = await axios.post(`${API_URL}/licenses/validate`, {
    key,
    hwid: getHwid(),
  });
  return res.data.success === true;
}
```

---

## Security Notes

- Always use a strong `ADMIN_API_KEY`.
- HWIDs are stored as SHA-256 hashes.
- Restrict CORS origins in production if needed.
- Consider adding rate limiting for the public endpoints.
