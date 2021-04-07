const { register, login } = require("../controllers/user");
const { catchErrors } = require("../handlers/errorHandlers");
const { validateEmail, validatePassword } = require("../midlware/validators");
const router = require("express").Router();

router.post(
  "/register",
  validateEmail,
  validatePassword,
  catchErrors(register)
);
router.post("/login", validateEmail, validatePassword, catchErrors(login));

module.exports = router;
