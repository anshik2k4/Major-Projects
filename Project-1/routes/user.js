const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user.js");

// Signup GET
router.get("/signup", (req, res) => {
    res.render("listing/signup.ejs");
});

// Signup POST
router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!username.trim() || !email.trim() || !password.trim()) {
            req.flash("error", "All fields are required!");
            return res.redirect("/signup");
        }

        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters!");
            return res.redirect("/signup");
        }

        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", `Welcome ${username}, You registered Successfully!`);
        res.redirect("/listing");

    } catch (err) {
        if (err.name === "UserExistsError") {
            req.flash("error", "Username already taken, try another!");
            return res.redirect("/signup");
        }
        if (err.code === 11000 && err.keyPattern.email) {
            req.flash("error", "Email already registered, try login!");
            return res.redirect("/signup");
        }
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// Login GET
router.get("/login", (req, res) => {
    res.render("listing/login.ejs");
});

// Login POST
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", `Welcome back ${req.user.username}!`);
    res.redirect("/listing");
});

// Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "Logged out successfully!");
        res.redirect("/listing");
    });
});

module.exports = router;