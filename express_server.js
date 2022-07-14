const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

///////////////////////////////////////////////////////
// GENERATE RANDOM 6 DIGITS ----v
///////////////////////////////////////////////////////

function generateRandomString() {
  result = [];
  for (i = 0; i < 6; i++) {

    result.push(Math.ceil(Math.random() * 6));
  }
  let randomString = `${result[0]}${result[1]}${result[2]}${result[3]}${result[4]}${result[5]}`;

  return randomString;
}

// const findUser = function(usersObj, emailObj) {

//   for (let id in users) {
//     if (email === users[id].email) {
//       return users[id]['id'];
//     }

//   }
// };

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const templateVars = {
    urls: urlDatabase,
    user
  };

  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_id'];
  const user = users[userId];
  const templateVars = {
    urls: urlDatabase,
    user
  };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    user: null
  };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    user: null
  };
  res.render("login", templateVars);
});


///////////////////////////////////////////////////////
// PROVIDE URLS_SHOW W VARIABLES----v
///////////////////////////////////////////////////////
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies['user_id'];
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const user = users[userId];

  res.cookie('user_id', id);
  const templateVars = {
    id,
    longURL,
    user
  };
  res.render("urls_show", templateVars);
});

///////////////////////////////////////////////////////
// REDIRECT TO LONG URL----v
///////////////////////////////////////////////////////

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

///////////////////////////////////////////////////////
// REGISTRATION----v
///////////////////////////////////////////////////////

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  users[id] = { id, email, password };

  res.cookie('user_id', id);
  console.log(users);

  if (email.length === 0 || password.length === 0) {
    return res.status(400).send('ERROR please provide an email and a password');
  }

  for (let id in users) {
    if (email === users[id]['email']) {
      return res.status(400).send('ERROR email already exists');
    }
  }
  res.redirect('/urls');
});

// /////////////////////////////////////////////////////
// USER LOGIN----v
// /////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  // const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  // users[id]= {id, email, password};

  // console.log(users)

  const findUser = function(usersObj, emailObj) {

    for (let id in users) {
      if (email === users[id].email) {
        return users[id]['id'];
      }

    }
  };
  const userID = findUser(users, email);
  if (findUser(users, email)) {
    if (password === users[userID].password)  {
      res.cookie('user_id', userID);
      res.redirect('/urls');
    } else{
      res.status(403).send('INCORRECT LOGIN CREDENTIALS')
    }

  }
  if (!findUser(users, email))  {
    res.status(403).send('USER DOES NOT EXIST!!!!')
  }

});


///////////////////////////////////////////////////////
// USER LOGOUT----v
///////////////////////////////////////////////////////

app.post("/logout", (req, res) => {


  res.clearCookie('user_id');
  res.redirect('/urls');
});

///////////////////////////////////////////////////////
// SUBMIT NEW URL POST----v
///////////////////////////////////////////////////////


app.post("/urls/new", (req, res) => {

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls/${shortURL}`);
});
///////////////////////////////////////////////////////
// UPDATE URL----v
///////////////////////////////////////////////////////

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.updatedURL;
  urlDatabase[id] = longURL;


  res.redirect('/urls');
});

///////////////////////////////////////////////////////
// DELETE URL----v
///////////////////////////////////////////////////////

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];


  res.redirect('/urls');
});

///////////////////////////////////////////////////////
// SERVER LISTENING PORT 8080----v
///////////////////////////////////////////////////////

app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);
});

