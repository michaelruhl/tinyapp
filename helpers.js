const findUser = function(users, email) {
    
  for (let id in users) {
    if (email === users[id].email) {
      return users[id];
    }

  }
};

module.exports = findUser;