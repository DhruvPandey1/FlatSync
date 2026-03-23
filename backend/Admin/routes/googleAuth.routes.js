const express = require ("express");
const passport = require ("passport");
const jwt=require('jsonwebtoken');
const { getAdminByEmailService } = require('../../db/services/auth.service');


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

      const result = await getAdminByEmailService(email);

      const admin = result.rows[0];

      if (!admin) {
        return res.redirect("http://localhost:3000/admin/login?error=User not found");
      }


      const token=jwt.sign(
        {
          id:admin.id,
          email:admin.email,
          role:"ADMIN"
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
      );

      res.cookie("admin_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      return res.redirect("http://localhost:3000/admin/dashboard");
    } catch (err) {
      return res.redirect("http://localhost:3000/admin/login?error=Server error");
    }
  })(req, res, next);
});


module.exports=router;