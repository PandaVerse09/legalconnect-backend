const jwt = require("jsonwebtoken");
const revokedTokens = new Set();

const NODE_ENV = process.env.NODE_ENV || "development";
const envJwtSecret = String(process.env.JWT_SECRET || "").trim();
if (!envJwtSecret) {
  throw new Error("JWT_SECRET must be set in environment variables.");
}

const JWT_SECRET = envJwtSecret;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || "").trim();
if (!ADMIN_PASSWORD && NODE_ENV !== "development") {
  throw new Error("ADMIN_PASSWORD must be set in non-development environments.");
}

function readToken(req) {
  const headerToken = req.headers["x-auth-token"];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  return headerToken || bearerToken;
}

function createToken(user) {
  return jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

async function getAuthenticatedUser(req) {
  const token = readToken(req);
  if (!token || revokedTokens.has(token)) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin" || payload.username !== ADMIN_USERNAME) {
      return null;
    }

    return {
      username: payload.username,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}

function getLoginInfo(req, res) {
  return res.json({
    message: "Use POST /api/auth/login with username and password.",
    usernameHint: "admin",
  });
}

async function postLogin(req, res) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ message: "Server auth is not configured." });
  }

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (String(username).trim() !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Login failed: invalid username or password." });
  }

  const token = createToken({ username: ADMIN_USERNAME, role: "admin" });
  return res.json({
    message: "Login successful.",
    token,
    user: {
      username: ADMIN_USERNAME,
      role: "admin",
    },
  });
}

function postLogout(req, res) {
  const token = readToken(req);
  if (!token) {
    return res.status(400).json({ message: "Logout failed: invalid token." });
  }

  revokedTokens.add(token);
  return res.json({ message: "Logout successful." });
}

async function requireAdmin(req, res, next) {
  const user = await getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized. Login required." });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admin access only." });
  }

  req.user = user;
  return next();
}

function getSignInPage(req, res) {
  return getLoginPage(req, res);
}

function getLogInPage(req, res) {
  return getLoginPage(req, res);
}

function postSignIn(req, res) {
  return postLogin(req, res);
}

function postLogIn(req, res) {
  return postLogin(req, res);
}

module.exports = {
  getLoginInfo,
  postLogin,
  postLogout,
  requireAdmin,
  postSignIn,
  postLogIn,
};
