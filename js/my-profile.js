import { ChatStore } from "../models/chatstore.js";
import { SessionManager } from "../models/sessionmanager.js";

const activeUser = SessionManager.getActiveUser();
const saveBtn = document.getElementById("save-profile-btn");

if (!activeUser) {
  window.location.href = "sign-in.html";
}

const originalUsername = activeUser.username;

/**
 * Initializes the profile page by populating the avatar, username, and email fields
 * using the active user's data from session storage. The avatar displays the first letter of the username in uppercase.
 * The username and email labels are updated to reflect the current user's information.
 */
const initProfile = () => {
  const avatar = document.getElementById("profile-display-avatar");
  const labelUsername = document.getElementById("label-username");
  const labelEmail = document.getElementById("label-email");

  avatar.textContent = activeUser.username.charAt(0).toUpperCase();
  labelUsername.textContent = `Current Username: ${activeUser.username}`;
  labelEmail.textContent = `Current email: ${activeUser.email}`;
};
initProfile();

/**
 * Handles the profile saving process when the "Save" button is clicked. It retrieves the new username and email from the input fields,
 * creates an updated user object based on the active user's data, and updates the localStorage with the new information. If the username is changed,
 * it also updates the online status in the ChatStore. Finally, it updates the session storage with the new user data and reloads the page to reflect the changes.
 */
saveBtn.onclick = () => {
  const newUsername = document.getElementById("new-username").value.trim();
  const newEmail = document.getElementById("new-email").value.trim();

  const updatedUser = {
    ...activeUser,
    username: newUsername || activeUser.username,
    email: newEmail || activeUser.email,
  };

  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  const userIndex = allUsers.findIndex((u) => u.username === originalUsername);

  if (userIndex !== -1) {
    allUsers[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(allUsers));

    if (newUsername && newUsername !== originalUsername) {
      ChatStore.setOnlineStatus(originalUsername, false);
      ChatStore.setOnlineStatus(newUsername, true);
    }

    SessionManager.login(updatedUser);

    alert("Profile saved successfully!");
    window.location.reload();
  }
};


/**
 * Handles the logout process when the "Logout" button is clicked. It updates the online status of the active user to false in the ChatStore and then calls the SessionManager's logout method to clear the session and redirect the user to the sign-in page.
 * This ensures that the user's online status is accurately reflected in the chat application and that they are properly logged out of their session.
 */
document.getElementById("logout-btn").onclick = () => {
  ChatStore.setOnlineStatus(activeUser.username, false);
  SessionManager.logout();
};
