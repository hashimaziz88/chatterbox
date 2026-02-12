import { User } from "../models/user.js";
import { SessionManager } from "../models/sessionmanager.js";
import { ChatStore } from "../models/chatstore.js";

/**
 * Handles the submission of the sign-in form. It prevents the default form submission behavior, retrieves the username and password from the input fields,
 * and uses the User model to authenticate the credentials. If the authentication is successful, it updates the sign-in message to welcome the user, stores
 * the user's information in session storage using SessionManager, updates the online status in the ChatStore, and redirects the user to the main chats page
 * after a short delay. If authentication fails, it displays an error message indicating invalid credentials. Finally, it clears the form inputs.
 */
document.getElementById("signin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("signInMessage");

  const foundUser = User.authenticate(username, password);

  if (foundUser) {
    messageEl.textContent = "Login successful! Welcome, " + username;
    messageEl.style.color = "green";

    SessionManager.login(foundUser);

    ChatStore.setOnlineStatus(foundUser.username, true);

    redirectToHome();
  } else {
    messageEl.textContent = "Invalid username or password!";
    messageEl.style.color = "red";
  }

  this.reset();
});

/**
 * Redirects the user to the main chats page after a short delay. This function is called after a successful login to give the user feedback before navigating 
 * to the next page.
 */
const redirectToHome = () => {
  setTimeout(() => {
    window.location.href = "/chatterbox/pages/main-chats.html";
  }, 2000);
};
