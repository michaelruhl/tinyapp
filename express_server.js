const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

///////////////////////////////////////////////////////
// GENERATE RANDOM 6 DIGITS ----v
///////////////////////////////////////////////////////

function generateRandomString() {
  result = [];
  for (i = 0; i < 6; i++) {

    result.push(Math.ceil(Math.random() * 6))
  }
  let randomString = `${result[0]}${result[1]}${result[2]}${result[3]}${result[4]}${result[5]}`
  
  return randomString;
}



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",

};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});


app.get("/urls", (req, res) => {
    
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies['username']
  };
  
  res.render("urls_index", templateVars);
});





///////////////////////////////////////////////////////
// USERNAME LOGIN----v
///////////////////////////////////////////////////////

app.post("/login", (req, res) => {
  const username = req.body.username;
  
  res.cookie('username', username);
  
  res.redirect('/urls')
});

///////////////////////////////////////////////////////
// USERNAME LOGOUT----v
///////////////////////////////////////////////////////

app.post("/logout", (req, res) => {

  
  res.clearCookie('username')
  res.redirect('/urls')
});

///////////////////////////////////////////////////////
// SUBMIT NEW URL POST----v
///////////////////////////////////////////////////////


app.post("/urls", (req, res) => {

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
   urlDatabase[shortURL] = longURL;
  
   res.redirect(`/urls/${shortURL}`)
});
///////////////////////////////////////////////////////
// UPDATE URL----v
///////////////////////////////////////////////////////

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.updatedURL;
  urlDatabase[id] = longURL;
  
 
  res.redirect('/urls')
});

///////////////////////////////////////////////////////
// DELETE URL----v
///////////////////////////////////////////////////////

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  
  delete urlDatabase[id];


   res.redirect('/urls')
});
///////////////////////////////////////////////////////
// PROVIDE URLS_SHOW W VARIABLES----v
///////////////////////////////////////////////////////
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const username = req.body.username;
  
  res.cookie('username', username);
  const templateVars = { 
    id, 
    longURL,
    username
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
// SERVER LISTENING PORT 8080----v
///////////////////////////////////////////////////////

app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);
});

