const express = require("express");
const helmet = require('helmet');
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const { connectDB } = require("./config/dbConnection")
const { googleStrategy, facebookStrategy, twitterStrategy, githubStrategy, serializeUser, deserializeUser, sessionOptions } = require("./config/passportConfig")
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const CLIENT_APP_URL = process.env.CLIENT_APP_URL || "http://localhost:3000";

passport.use(googleStrategy);
passport.use(facebookStrategy);
passport.use(twitterStrategy);
passport.use(githubStrategy);

passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

const app = express();

app.use(morgan("combined"));
app.use(helmet());

app.set("trust proxy", 1);
app.use(cors({
    origin: CLIENT_APP_URL,
    credentials: true,
}));
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate("google", {scope: ["email", "profile"]}));
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/twitter", passport.authenticate("twitter"));
app.get("/auth/github", passport.authenticate("github", {scope: ["user:email"]}));

app.get("/auth/google/callback", passport.authenticate("google", {successRedirect: CLIENT_APP_URL, failureRedirect: `${CLIENT_APP_URL}/sign-in-failure`}));
app.get("/auth/facebook/callback", passport.authenticate("facebook", {successRedirect: CLIENT_APP_URL, failureRedirect: `${CLIENT_APP_URL}/sign-in-failure`}));
app.get("/auth/twitter/callback", passport.authenticate("twitter", {successRedirect: CLIENT_APP_URL, failureRedirect: `${CLIENT_APP_URL}/sign-in-failure`}));
app.get("/auth/github/callback", passport.authenticate("github", {successRedirect: CLIENT_APP_URL, failureRedirect: `${CLIENT_APP_URL}/sign-in-failure`}));

app.get("/auth/log-out", (req, res, next) => {
    if(req.user) {
        req.logout((err) => {
            err ? next(err) : res.send("Logged Out");
        })
    }
});

app.get("/auth/user", (req, res, next) => {
    res.send(req.user);
})

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running. PORT: ${PORT}`);
})
