import { Message } from "../models/message.js";
import { ChatStore } from "../models/chatstore.js";
import { SessionManager } from "../models/sessionmanager.js";

// State Management
let activeRecipient = "online"; // Default view
const activeUser = ChatStore.getActiveUser();

// Elements
const contactList = document.getElementById("contact-list");
const chatMessages = document.getElementById("chat-messages");
const chatTitle = document.getElementById("active-chat-title");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");

// 1. Initial Check: Redirect if not logged in]
if (!activeUser) {
  window.location.href = "sign-in.html";
}

// State Management for UI tabs
let currentTab = "online"; // 'online', 'chats', or 'groups'

// Elements for tab switching
const tabButtons = document.querySelectorAll(".tab-btn");

// 1. Tab Switching Logic
tabButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentTab = e.target.getAttribute("data-tab");
    renderContacts(); // Refresh list based on selected tab
  });
});

// 2. Updated Contact Rendering
const renderContacts = () => {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const onlineNames = JSON.parse(localStorage.getItem("onlineUsers")) || [];
  contactList.innerHTML = "";

  let listToRender = [];

  if (currentTab === "online") {
    // Only show users who are currently online
    listToRender = allUsers.filter(
      (u) =>
        onlineNames.includes(u.username) && u.username !== activeUser.username,
    );
  } else if (currentTab === "chats") {
    // Show all registered users (Online and Offline)0]
    listToRender = allUsers.filter((u) => u.username !== activeUser.username);
  } else if (currentTab === "groups") {
    // Show Group Chat option
    const li = document.createElement("li");
    li.className = `contact-item ${activeRecipient === "Group" ? "active" : ""}`;
    li.innerHTML = `<div class="avatar group-avatar">G</div> <span>Global Group Chat</span>`;
    li.onclick = () => switchChat("Group");
    contactList.appendChild(li);
    return; // Exit early as groups are handled specifically
  }

  listToRender.forEach((user) => {
    const isOnline = onlineNames.includes(user.username);
    const li = document.createElement("li");
    li.className = `contact-item ${activeRecipient === user.username ? "active" : ""}`;

    // UI to mimic WhatsApp-style contact list item
    li.innerHTML = `
      <div class="avatar ${isOnline ? "online-indicator" : ""}">
        ${user.username.charAt(0).toUpperCase()}
      </div>
      <div class="contact-info">
        <span class="contact-name">${user.username}</span>
        <span class="status-text">${isOnline ? "online" : "offline"}</span>
      </div>
    `;

    li.onclick = () => switchChat(user.username);
    contactList.appendChild(li);
  });
};

// 3. Switch Chat Recipient
const switchChat = (recipient) => {
  activeRecipient = recipient;
  chatTitle.textContent =
    recipient === "Group" ? "Global Group Chat" : recipient;
  renderMessages();
  renderContacts();
};

// 4. Render Messages with Filtering 
const renderMessages = () => {
  const allMessages = ChatStore.getMessages();
  chatMessages.innerHTML = "";

  const filtered = allMessages.filter((msg) => {
    if (activeRecipient === "Group") {
      return msg.recipient === "Group";
    }
    // Private Chat Filter: (Me to Them) OR (Them to Me)
    return (
      (msg.sender === activeUser.username &&
        msg.recipient === activeRecipient) ||
      (msg.sender === activeRecipient && msg.recipient === activeUser.username)
    );
  });

  filtered.forEach((msg) => {
    const isMe = msg.sender === activeUser.username;
    const msgDiv = document.createElement("div");
    msgDiv.className = `message-wrapper ${isMe ? "sent" : "received"}`;
    msgDiv.innerHTML = `
      <div class="message-bubble">
        <small class="sender-name">${msg.sender}</small>
        <p>${msg.text}</p>
        <span class="timestamp">${msg.timestamp}</span>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
};

// 5. Send Message Logic
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    const newMsg = new Message(activeUser.username, text, activeRecipient);
    Message.save(newMsg); // Persists to localStorage
    messageInput.value = "";
    renderMessages();
  }
});

// 6. Real-Time Sync via Storage Event 
window.addEventListener("storage", (event) => {
  if (event.key === "messages" || event.key === "onlineUsers") {
    renderMessages();
    renderContacts();
  }
});

// 7. Logout Logic 
document.getElementById("logout-btn").onclick = () => {
  ChatStore.setOnlineStatus(activeUser.username, false);
  SessionManager.logout();
};

// Initialize
renderContacts();
renderMessages();
