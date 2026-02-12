import { SessionManager } from "./sessionmanager.js";
import { Message } from "./message.js";

/**
 * ChatStore is a centralized module that manages the chat application's state, including the active user, messages, and online users.
 * It provides methods to retrieve the active user, get all messages, get the list of online users, and set a user's online status.
 * The ChatStore interacts with localStorage and sessionStorage to persist data across sessions and tabs, ensuring that the user's online
 * status is accurately reflected throughout the application.
 */
export const ChatStore = {
  /**
   * Returns the currently active user from the session manager.
   * @returns {Object|null} The active user object or null if no active user exists.
   */
  getActiveUser() {
    return SessionManager.getActiveUser();
  },

  /**
   * Returns all messages from the Message model.
   * @returns {Array} An array of all message objects.
   */
  getMessages() {
    return Message.getAll();
  },

  /**
   * Sets the online status of a user. It updates the global 'onlineUsers' list in localStorage for cross-tab tracking, updates the specific user's
   * 'isOnline' property in localStorage, and updates the SessionStorage for the current tab if the active user is the one being updated. This ensures
   * that the user's online status is accurately reflected across the application.
   *
   * @param {string} username - The username of the user whose online status is being set.
   * @param {boolean} status - The online status to set (true for online, false for offline).
   */
  setOnlineStatus(username, status) {
    let online = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    if (status && !online.includes(username)) {
      online.push(username);
    } else {
      online = online.filter((name) => name !== username);
    }
    localStorage.setItem("onlineUsers", JSON.stringify(online));

    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = allUsers.findIndex((u) => u.username === username);
    if (userIndex !== -1) {
      allUsers[userIndex].isOnline = status;
      localStorage.setItem("users", JSON.stringify(allUsers));
    }

    const activeUser = this.getActiveUser();
    if (activeUser && activeUser.username === username) {
      activeUser.isOnline = status;
      sessionStorage.setItem("loggedInUser", JSON.stringify(activeUser));
    }
  },
};
