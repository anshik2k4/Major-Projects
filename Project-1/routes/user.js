const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user.js");

function userPayload(user) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
    };
}

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters!" });
        }

        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        res.status(201).json({
            user: userPayload(registeredUser),
            message: `Welcome ${username}, You registered Successfully!`,
        });
    } catch (err) {
        let message = err.message;

        if (err.name === "UserExistsError") {
            message = "Username already taken, try another!";
        } else if (err.code === 11000 && err.keyPattern?.email) {
            message = "Email already registered, try login!";
        }

        res.status(400).json({ error: message });
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            const message = info?.message || "Invalid username or password";
            return res.status(401).json({ error: message });
        }

        req.logIn(user, (loginErr) => {
            if (loginErr) return next(loginErr);

            res.json({
                user: userPayload(user),
                message: `Welcome back ${user.username}!`,
            });
        });
    })(req, res, next);
});

router.get("/api/auth/me", (req, res) => {
    if (!req.user) {
        return res.json({ user: null });
    }
    res.json({ user: userPayload(req.user) });
});

router.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: "Logged out successfully!" });
    });
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

module.exports = router;
