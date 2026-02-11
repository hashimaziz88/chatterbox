import { SessionManager } from "./sessionmanager.js";
import { Message } from "./message.js";

export const ChatStore = {
  getActiveUser() {
    return SessionManager.getActiveUser();
  },

  getMessages() {
    return Message.getAll();
  },

  getOnlineUsers() {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const onlineNames = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    return allUsers.filter((u) => onlineNames.includes(u.username));
  },

  setOnlineStatus(username, status) {
    // 1. Update the global 'onlineUsers' name list for cross-tab tracking
    let online = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    if (status && !online.includes(username)) {
      online.push(username);
    } else {
      online = online.filter((name) => name !== username);
    }
    localStorage.setItem("onlineUsers", JSON.stringify(online));

    // 2. Update the specific user's 'isOnline' property in localStorage
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = allUsers.findIndex((u) => u.username === username);
    if (userIndex !== -1) {
      allUsers[userIndex].isOnline = status;
      localStorage.setItem("users", JSON.stringify(allUsers));
    }

    // 3. Update the SessionStorage for the current tab
    const activeUser = this.getActiveUser();
    if (activeUser && activeUser.username === username) {
      activeUser.isOnline = status;
      // Re-save to sessionStorage via your SessionManager
      sessionStorage.setItem("loggedInUser", JSON.stringify(activeUser));
    }
  },
};
