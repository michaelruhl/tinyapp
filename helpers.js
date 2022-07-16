const findUser = function(users, email) {
    
  for (let id in users) {
    if (email === users[id].email) {
      return users[id];
    }

  }
};


const generateRandomString = function() {
  result = [];
  for (i = 0; i < 6; i++) {

    result.push(Math.ceil(Math.random() * 6));
  }
  let randomString = `${result[0]}${result[1]}${result[2]}${result[3]}${result[4]}${result[5]}`;

  return randomString;
}
module.exports = {findUser, generateRandomString};