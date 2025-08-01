require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const {
  checkAdmin,
  checkIfRoleExists,
  checkIfUserExists,
} = require("./middlewares");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const users = [];

const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });
  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await users.find((u) => u.email === decoded.email);
    if (!user) return res.status(401).json({ message: "User not found" });

    const { password, ...userData } = user;

    req.user = userData;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.post(
  "/register",
  checkIfUserExists(users),
  checkIfRoleExists,
  async (req, res) => {
    const { email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    users.push({ email, password: hashed, role });
    res.status(201).json({ message: "User registered" });
  }
);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
});

app.put(
  "/updateRole",
  authMiddleware,
  checkAdmin,
  checkIfRoleExists,
  async (req, res) => {
    const { role, email } = req.body;
    const rootPassword = req.headers["cupcake"];
    const user = users.find((u) => u.email === email);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === role)
      return res.status(400).json({ message: "User already has this role" });
    if (user.role === "admin" && rootPassword !== process.env.ROOT_PASSWORD)
      return res.status(403).json({ message: "Cannot change admin role" });

    user.role = role;
    res.status(200).json({ message: "User role updated successfully" });
  }
);

app.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

app.get("/", authMiddleware, checkAdmin, (req, res) => {
  const usersWithoutPassword = users.map(({ password, ...user }) => user);

  res.json(
    usersWithoutPassword.length > 0
      ? usersWithoutPassword
      : { message: "No users found" }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));

module.exports = users;
