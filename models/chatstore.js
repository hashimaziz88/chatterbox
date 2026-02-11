export const ChatStore = {
  // Identify who is using this specific tab
  getActiveUser() {
    return SessionManager.getActiveUser();
  },

  // Get all messages for the real-time display
  getMessages() {
    return Message.getAll(); // Uses your Message model
  },

  // Get all users and filter which ones are "Online"
  // Note: For this project, you can treat users in the 'onlineUsers'
  // array in localStorage as active.
  getOnlineUsers() {
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const onlineNames = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    return allUsers.filter((u) => onlineNames.includes(u.username));
  },

  // Logic to update the shared online list
  setOnlineStatus(username, status) {
    let online = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    if (status && !online.includes(username)) {
      online.push(username);
    } else {
      online = online.filter((name) => name !== username);
    }
    localStorage.setItem("onlineUsers", JSON.stringify(online));
  },
};
