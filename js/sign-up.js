import { User } from "../models/user.js";

document.getElementById("signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const messageEl = document.getElementById("signupMessage");

  // Use Model to ensure usernames are unique
  if (!User.isUsernameUnique(username)) {
    messageEl.textContent = "Username already exists!";
    return;
  }

  // Use Model to create a new user instance
  const newUser = new User(username, email, password);

  // Use Model to handle persistence in JSON format
  User.register(newUser);

  messageEl.textContent = "Sign up successful! You can now log in.";

  // Clear the form
  this.reset();
});
