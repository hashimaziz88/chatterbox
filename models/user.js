export class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isOnline = false;
  }

  static isUsernameUnique(username) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return !users.some((u) => u.username === username);
  }

  static register(userObj) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userObj);
    localStorage.setItem("users", JSON.stringify(users));
  }

  static authenticate(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(
      (u) => u.username === username && u.password === password,
    );
  }
}
