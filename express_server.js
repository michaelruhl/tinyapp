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
const bcrypt = require("bcryptjs");

app.set('view engine', 'ejs');

const urlDatabase = {
  b2xVn2: {

    longURL: "http://www.lighthouselabs.ca",
    userID: 'userRandomID'
  },

  s9m5xK: {

    longURL: "http://www.google.com",
    userID: 'user2RandomID'
  }
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

//VIEWS/ frontend routes
// homepage
app.get('/', (req, res) => {
  res.redirect("login");
});

// URLS/ views
// urls page
app.get("/urls", (req, res) => {

  const { user_id } = req.cookies;
  if (!user_id) {
    return res.status(401).send('user not logged in');
  }

  const user = users[user_id];
  if (!user) {
    return res.status(401).send('user not valid');
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
  const { user_id } = req.cookies;
  if (!user_id) {
    return res.status(401).send('user not logged in');
  }

  const user = users[user_id];
  if (!user) {
    return res.status(401).send('user not valid');
  }

  const templateVars = { user };
  res.render("urls_new", templateVars);
});

// url details page
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies['user_id'];
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  const user = users[userId];


  const templateVars = { id, longURL, user };
  res.render("urls_show", templateVars);
});

//AUTHENTICATION VIEWS

app.get("/register", (req, res) => {
  
  const { user_id } = req.cookies;
  if (user_id) {
    return res.redirect('/urls');
  } else {user = null}
  templateVars = {user}
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {

  const { user_id } = req.cookies;
  if (user_id) {
    return res.redirect('/urls');
  }

  const templateVars = { user: null };
  res.render("login", templateVars);
});

// URLS REST API
//CRUD
//CREATE URL - POST
app.post("/urls", (req, res) => {

  const { user_id } = req.cookies;
  if (!user_id) {
    return res.status(401).send('user not logged in');
  }

  // const user = users[user_id];
  // if (!user) {
  //   return res.status(401).send('user not valid');
  // }
  
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: user_id };

  res.redirect(`/urls/`);
});

// READ ALL - GET
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// READ ONE - GET
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

//UPDATE
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.updatedURL;
  urlDatabase[id].longURL = longURL;


  res.redirect('/urls');
});

//DELETE URL
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;

  delete urlDatabase[id];


  res.redirect('/urls');
});

//AUTHENTICATION REST API
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  // console.log(req.body.email)
  const password = req.body.password;
  
  

  // console.log(users);
  
  if (email.length === 0 || password.length === 0) {
    return res.status(400).send('ERROR please provide an email and a password');
  }

  for (let user in users) {
    if (email === users[user].email) {
      return res.status(400).send('ERROR email already exists');
    }
  }
  
  
  const hashedPassword = bcrypt.hashSync(password, 12);

  users[id] = {id, email, password: hashedPassword}
  console.log(users)
  res.cookie('user_id', id);
  res.redirect('/urls');
});

app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  
  const findUser = function(usersObj, emailObj) {
    
    for (let id in users) {
      if (email === users[id].email) {
        return users[id]['id'];
      }

    }
  };
  const userID = findUser(users, email);
  if (findUser(users, email)) {
    // if (password === users[userID].password) {
   if (bcrypt.compareSync(`${password}`, hashedPassword))  {
    res.cookie('user_id', userID);
      res.redirect('/urls');
    } else {
      res.status(403).send('INCORRECT LOGIN CREDENTIALS');
    }

  }
  if (!findUser(users, email)) {
    res.status(403).send('USER DOES NOT EXIST!!!!');
  }

});


app.post("/logout", (req, res) => {


  res.clearCookie('user_id');
  res.redirect('/login');
});



app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);
});

