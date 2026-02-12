import { User } from "../models/user.js";

/**
 * Handles the submission of the sign-up form. It prevents the default form submission behavior, retrieves the username, email, and password from the input fields,
 * and checks if the username is unique using the User model. If the username already exists, it displays an error message. If the username is unique, it creates a
 * new user instance, * registers the user using the User model, and displays a success message indicating that the sign-up was successful. Finally, it resets the form inputs.
 */
document.getElementById("signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const messageEl = document.getElementById("signupMessage");

  if (!User.isUsernameUnique(username)) {
    messageEl.textContent = "Username already exists!";
    return;
  }

  const newUser = new User(username, email, password);

  User.register(newUser);

  messageEl.textContent = "Sign up successful! You can now log in.";

  this.reset();
});
