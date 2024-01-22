"use strict";

// 13-35-00 ae track_detail ma lyrics valo part start thay chhe

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");

const login = require("./src/routes/login.route");
const auth = require("./src/routes/auth.route");
const authenticatedUser = require('./src/middlewares/auth_user.middleware')
const home = require('./src/routes/home.route')
const explore = require('./src/routes/explore.route')
const album = require('./src/routes/album.route')
const playlist = require('./src/routes/playlist.route')
const profile = require('./src/routes/profile.route')
const search = require('./src/routes/search.route')
const artist = require('./src/routes/artist.route')
const track = require('./src/routes/track.route')
const logout = require('./src/routes/logout.route')

const app = express();

app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));
app.use(cors()).use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.use("/login", login);
app.use("/auth", auth);
app.use(authenticatedUser)
app.use('/logout', logout)
app.use("/", home);
app.use("/explore", explore);
app.use("/album", album);
app.use("/playlist", playlist);
app.use("/me", profile);
app.use("/search", search);
app.use("/artist", artist);
app.use("/track", track);
app.use((req, res) => {
  res.render('./pages/404')
})

app.listen(5000, () => {
  console.log(`server is running on port 5000`);
});
