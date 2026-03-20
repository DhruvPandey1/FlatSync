const express = require ("express");
const passport = require ("passport");
const pool = require ("../../db/db");

const router = express.Router();

router.get(
  "/googleAuth",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get("/googleAuth/callback", (req, res, next) => {
  passport.authenticate("google", async (err, googleUser) => {
    try {
      if (err || !googleUser) {
        return res.redirect(
          "http://localhost:3000/admin/login?error=Google login failed",
        );
      }

      const email = googleUser.email;
      const token=googleUser.token;

      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND role = $2",
        [email, "ADMIN"],
      );

      const admin = result.rows[0];

      if (!admin) {
        return res.redirect("http://localhost:3000/admin/login?error=User not found");
      }

      res.cookie("role", "ADMIN", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });

      res.cookie("email", admin.email, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
      });

      res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"none"
      })

      return res.redirect("http://localhost:3000/admin/dashboard");
    } catch (err) {
      return res.redirect("http://localhost:3000/admin/login?error=Server error");
    }
  })(req, res, next);
});

router.get("/me", (req, res) => {
  res.json(req.user || null);
});

module.exports=router;