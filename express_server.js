const express = require("express");
var cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3000;
const bodyParser = require("body-parser");

const { findUser, generateRandomString } = require("./helpers");

///////////////////////////////////////////////////////
// GENERATE RANDOM 6 DIGITS ----v
///////////////////////////////////////////////////////

app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["qierograndetequilacompadre"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },

  s9m5xK: {
    longURL: "http://www.google.com",
    userID: "user2RandomID",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    hashedPassword: bcrypt.hashSync("1234", 12),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    hashedPassword: bcrypt.hashSync("1234", 12),
  },
};

//VIEWS/ frontend routes
// homepage
app.get("/", (req, res) => {
  res.redirect("login");
});

// URLS/ views
// urls page
app.get("/urls", (req, res) => {
  const { user_id } = req.session;
  console.log(urlDatabase);
  if (!user_id) {
    return res.redirect(401).send("user not logged in");
  }

  const user = users[user_id];
  if (!user) {
    return res.status(401).send("user not valid");
  }

  let urls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === user_id) {
      urls[url] = urlDatabase[url];
    }
  }

  const templateVars = { urls, user };
  res.render("urls_index", templateVars);
});

//create new urls
app.get("/urls/new", (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.redirect("/login");
  }

  const user = users[user_id];
  if (!user) {
    return res.status(401).send("user not valid");
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// url details page
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  if (!urlDatabase[id]) {
    return res.status(400).send("URL does not exist");
  }
  const longURL = urlDatabase[id].longURL;
  const user = users[userId];
  const templateVars = { id, longURL, user };
  console.log(urlDatabase);
  if (!userId || !urlDatabase[id].longURL) {
    return res.status(401).send("Not Authorized");
  } else {
    res.render("urls_show", templateVars);
  }
});

//AUTHENTICATION VIEWS

app.get("/register", (req, res) => {
  const { user_id } = req.session;
  if (user_id) {
    return res.redirect("/urls");
  } else {
    user = null;
  }
  templateVars = { user };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  const { user_id } = req.session;
  if (user_id) {
    return res.redirect("/urls");
  }

  const templateVars = { user: null };
  res.render("login", templateVars);
});

// URLS REST API
//CRUD
//CREATE URL - POST
app.post("/urls", (req, res) => {
  const { user_id } = req.session;
  if (!user_id) {
    return res.status(401).send("user not logged in");
  }

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: user_id };

  res.redirect(`/urls/${shortURL}`);
});

// READ ALL - GET
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// READ ONE - GET
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.session.user_id;

  if (!userId || !urlDatabase[id].longURL) {
    return res.status(401).send("Not Authorized");
  }
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

//UPDATE
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.updatedURL;
  urlDatabase[id].longURL = longURL;

  res.redirect("/urls");
});

//DELETE URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];

  res.redirect("/urls");
});

//AUTHENTICATION REST API
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (email.length === 0 || password.length === 0) {
    return res.status(400).send("ERROR please provide an email and a password");
  }

  for (let user in users) {
    if (email === users[user].email) {
      return res.status(400).send("ERROR email already exists");
    }
  }

  const hashedPassword = bcrypt.hashSync(password, 12);

  users[id] = { id, email, password: hashedPassword };
  console.log(users);
  req.session.user_id = id;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = findUser(users, email);
  if (findUser(users, email)) {
    if (bcrypt.compareSync(`${password}`, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else {
      res.status(403).send("INCORRECT LOGIN CREDENTIALS");
    }
  }
  if (!findUser(users, email)) {
    res.status(403).send("USER DOES NOT EXIST!!!!");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
