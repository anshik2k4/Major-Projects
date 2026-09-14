require("dotenv").config();

const fs = require("fs");
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!isProduction) {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
}

const contactRouter = require("./routes/contact.js");
app.use("/api/contact", contactRouter);

const clientDist = path.join(__dirname, "Client", "dist");
const hasClientBuild = fs.existsSync(clientDist);

if (hasClientBuild) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api\/).*/, (req, res, next) => {
    if (req.path.includes(".")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(404).send("Page not found");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Rank & Ask server listening on port ${port}`);
  if (!hasClientBuild) {
    console.log("Run `npm run dev:client` for the React UI.");
  }
});
