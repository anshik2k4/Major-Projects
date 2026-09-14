require("dotenv").config();

const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");

const isProduction = process.env.NODE_ENV === "production";
app.set("trust proxy", 1);

app.use((req, res, next) => {
    if (process.env.SERVER_NAME) {
        res.setHeader("X-Server-Name", process.env.SERVER_NAME);
        console.log(`[${process.env.SERVER_NAME}] Handled request: ${req.method} ${req.url}`);
    }
    next();
});

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./model/user.js");
const session = require("express-session");

const onesession = {
    secret: process.env.Secret,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
    },
};

app.use(session(onesession));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

if (!isProduction) {
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        })
    );
}

app.use(express.static(path.join(__dirname, "public")));

const clientDist = path.join(__dirname, "client", "dist");
const hasClientBuild = fs.existsSync(clientDist);

if (hasClientBuild) {
    app.use(express.static(clientDist));
}

const mongoose = require("mongoose");
const dbUrl = process.env.ATLASDB_URL && String(process.env.ATLASDB_URL).trim();
const useLocal = process.env.USE_LOCAL_DB === "true";

main()
    .then(() => {
        console.log("Database Connection Successful");
    })
    .catch((err) => {
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

app.use("/listing", listingRouter);
app.use("/listing/:listingId/reviews", reviewRouter);
app.use("/", userRouter);

if (hasClientBuild) {
    app.get(/^(?!\/listing\/api)(?!\/api\/).*/, (req, res, next) => {
        if (req.path.includes(".")) {
            return next();
        }
        res.sendFile(path.join(clientDist, "index.html"));
    });
}

app.use((req, res) => {
    if (
        req.path.startsWith("/listing/api") ||
        req.path.startsWith("/api/")
    ) {
        return res.status(404).json({ error: "Not found" });
    }
    res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Some error occurred";
    console.error("Error:", err.stack);

    if (
        req.headers.accept?.includes("application/json") ||
        req.path.startsWith("/listing/api") ||
        req.path.startsWith("/api/")
    ) {
        return res.status(status).json({ error: message, message });
    }

    res.status(status).send(message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("App is listening on port " + port);
    if (!hasClientBuild) {
        console.log(
            "React build not found. Run `npm run build` or use `npm run dev:client` for the UI."
        );
    }
});
