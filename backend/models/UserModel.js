const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
}

async function findByEmail(email) {
  return User.findOne({ email: String(email).toLowerCase().trim() });
}

async function validateCredentials(email, password) {
  const user = await findByEmail(email);
  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(String(password), user.password);
  return isMatch ? user : null;
}

async function createUser(email, password, role = "user") {
  const normalizedEmail = String(email).toLowerCase().trim();
  if (!normalizedEmail || !password) {
    return { error: "Email and password are required." };
  }

  const existing = await findByEmail(normalizedEmail);
  if (existing) {
    return { error: "User already exists." };
  }

  const hashedPassword = await bcrypt.hash(String(password), 10);
  const user = await User.create({
    email: normalizedEmail,
    password: hashedPassword,
    role,
  });

  return { user };
}

async function getUserById(id) {
  return User.findById(id);
}

async function getAllUsersSafe() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(sanitizeUser);
}

async function seedDefaultUsers() {
  if (process.env.ENABLE_DEFAULT_USER_SEED !== "true") {
    return;
  }

  const adminEmail = "admin@legalconnect.com";
  const userEmail = "user@legalconnect.com";
  const adminPassword = String(process.env.DEFAULT_ADMIN_PASSWORD || "").trim();
  const userPassword = String(process.env.DEFAULT_USER_PASSWORD || "").trim();

  if (adminPassword && !(await findByEmail(adminEmail))) {
    await createUser(adminEmail, adminPassword, "admin");
  }

  if (userPassword && !(await findByEmail(userEmail))) {
    await createUser(userEmail, userPassword, "user");
  }
}

module.exports = {
  findByEmail,
  validateCredentials,
  createUser,
  getUserById,
  getAllUsersSafe,
  sanitizeUser,
  seedDefaultUsers,
};
