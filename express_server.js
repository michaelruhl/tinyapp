const express = require('express');
const app = express();
const PORT = 8080;

function generateRandomString() {
  result = [];
  for (i = 0; i < 6; i++) {

    result.push(Math.ceil(Math.random() * 6))
  }
  let randomString = `${result[0]}${result[1]}${result[2]}${result[3]}${result[4]}${result[5]}`
  
  return randomString;
}



app.use(express.urlencoded({ extended: true }));

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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // console.log('req.body', req.body); // Log the POST request body to the console
  // console.log('longURL', req.body.longURL)
  
  const shortURL = generateRandomString();
  // console.log('shortURL', shortURL)
 // Object.assign(urlDatabase, tinyBigurl);
  const longURL = req.body.longURL;
  console.log('urldatabase1', urlDatabase)
  urlDatabase[shortURL] = longURL;
  
  console.log('urldatabase2', urlDatabase)
  
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];

  const templateVars = { id, longURL };
  res.render("urls_show", templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello<b>World</b></body></html>\n');
});

app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);
});

