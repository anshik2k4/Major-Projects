// Requiring up packages
require('dotenv').config(); // ✅ Sabse pehle

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Routes import
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method"));

// Passport setup
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user.js");

// Session setup
const session = require("express-session");
const flash = require("connect-flash");

const onesession = {
    secret: process.env.Secret,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(onesession));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    res.locals.searchQuery = "";
    res.locals.selectedCategory = null;
    next();
});

// EJS setup
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

// Port
let port = 8080;
app.listen(port, () => {
    console.log("App is listening on port " + port);
});

// Database (local or MongoDB Atlas via ATLASDB_URL in .env)
const mongoose = require("mongoose");

const dbUrl = process.env.ATLASDB_URL && String(process.env.ATLASDB_URL).trim();
const useLocal = process.env.USE_LOCAL_DB === "true";

main().then(() => {
    console.log("Database Connection Successful");
}).catch((err) => {
    console.error("Error in Database connection:", err.message || err);
    if (err?.reason) console.error("Reason:", err.reason);
    process.exit(1);
});

async function main() {
    if (useLocal) {
        await mongoose.connect("mongodb://127.0.0.1:27017/StayHub");
        return;
    }
    if (!dbUrl) {
        throw new Error(
            "ATLASDB_URL missing in .env. Add your Atlas connection string, or set USE_LOCAL_DB=true for local MongoDB."
        );
    }
    await mongoose.connect(dbUrl, {
        serverSelectionTimeoutMS: 15000,
    });
}

// Error handling
const AppError = require("./public/js/Error.js");
const catchAsync = require("./public/js/wrapper.js");

// ✅ Routes use karo
app.use("/listing", listingRouter);                        // /listing
app.use("/listing/:listingId/reviews", reviewRouter);      // /listing/:listingId/reviews
app.use("/", userRouter);                                  // /signup /login /logout

// 404
app.use((req, res, next) => {
    res.status(404).send("Page not found");
});

// Global error middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some error occurred" } = err;
    console.error("Error:", err.stack);
    if (process.env.NODE_ENV === 'development') {
        res.status(status).send(`
            <h1>Error ${status}</h1>
            <p>${message}</p>
            <pre>${err.stack}</pre>
        `);
    } else {
        res.status(status).send(message);
    }
});
