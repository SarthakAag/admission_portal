const express = require("express");

const { getProfile, updateProfile } = require("../controllers/profile.controller");
const { authenticateToken } = require("../middleware/auth.middleware");

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;