const roles = ["admin", "deliveryGuy", "user"];

const checkAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "No user found" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  next();
};

const checkIfRoleExists = (req, res, next) => {
  if (!req.body.role) {
    req.body.role = "user";
  }
  if (!roles.includes(req.body.role)) {
    return res
      .status(400)
      .json({ message: `Available roles: ${roles.join(", ")}` });
  }
  next();
};

/**
 * Middleware to check if user exists
 * @param {Array} users - The array of users
 * @returns {function} - Middleware function
 */
const checkIfUserExists = (users) => (req, res, next) => {
  const { email } = req.body;
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  next();
};

module.exports = {
  checkAdmin,
  checkIfRoleExists,
  checkIfUserExists,
};
