class User {
  constructor(name) {
    this.name = name;
    this.pendingMessages = [];
  }
}

class Room {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  getUser(user) {
    for(var i=0; i<this.users.length; i++) {
      if(this.users[i].name == user) {
        return this.users[i];
      }
    }
  }

  broadcast(msg) {
    for(var i=0; i<this.users.length; i++) {
      this.users[i].pendingMessages.push(msg);
    }
  }
}

class Chat {
  constructor() {
    this.room = new Room();
  }

  process(data, response) {
    if(data.msg !== undefined) {
      data.type = "msg";
      this.room.broadcast(data);
      var user = this.room.getUser(data.user);
      if(user.pendingMessages.length > 0) {
        response.end(JSON.stringify(user.pendingMessages));
        user.pendingMessages = [];
      } else {
        response.end(JSON.stringify({type:"msg", user:"SYSTEM", msg:"No New Messages"}));
      }
    } else {
      this.room.addUser(new User(data.user));
      response.end(JSON.stringify({type:"msg", user:"SYSTEM", msg:"Welcome!"}));
    }
  }
}

module.exports = new Chat();
