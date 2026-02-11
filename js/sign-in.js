import { User } from "../models/user.js";
import { SessionManager } from "../models/sessionmanager.js";
import { ChatStore } from "../models/chatstore.js";

document.getElementById("signin-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageEl = document.getElementById("signInMessage");

  // Use User Model to validate credentials and non-existing users
  const foundUser = User.authenticate(username, password);

  if (foundUser) {
    messageEl.textContent = "Login successful! Welcome, " + username;

    // Use SessionManager to store the logged-in user's info for this tab
    SessionManager.login(foundUser);

    // Update online status in the shared ChatStore
    ChatStore.setOnlineStatus(foundUser.username, true);

    redirectToHome();
  } else {
    messageEl.textContent = "Invalid username or password!";
  }

  // Clear the form
  this.reset();
});

const redirectToHome = () => {
  setTimeout(() => {
    window.location.href = "/chatterbox/pages/main-chats.html";
  }, 2000);
};
