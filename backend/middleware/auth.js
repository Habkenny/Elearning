const jwt = require("jsonwebtoken");

// Like Django's login_required: proves WHO you are
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, isAdmin } — available in every route after this
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

// Like Django's staff_member_required: proves you're an admin
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };