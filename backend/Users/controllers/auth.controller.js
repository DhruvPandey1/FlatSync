const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userLoginService } = require("../../db/services/auth.service");

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRes = await userLoginService(email);
        if (userRes.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = userRes.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.json({
            message: "Login successful",
            token,
        });

    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports={
    login
}