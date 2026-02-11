import { Message } from "../models/message.js";
import { ChatStore } from "../models/chatstore.js";
import { SessionManager } from "../models/sessionmanager.js";

let activeRecipient = "online";
let currentTab = "online"; // 'online', 'chats', or 'groups'
const activeUser = ChatStore.getActiveUser();

const contactList = document.getElementById("contact-list");
const chatMessages = document.getElementById("chat-messages");
const chatTitle = document.getElementById("active-chat-title");
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const groupModal = document.getElementById("group-modal");
const userSelectionList = document.getElementById("user-selection-list");
const leftSidebar = document.querySelector(".left-side-chats");
const rightChatArea = document.querySelector(".right-side-chats");
const backBtn = document.getElementById("back-to-list");

// 1. Initial Check: Redirect if not logged in
if (!activeUser) {
  window.location.href = "sign-in.html";
}

// Initialize mobile view: show list, hide chat
if (window.innerWidth <= 860) {
  rightChatArea.classList.add("hide-mobile");
}

// if (activeUser) {
//   // Set status to true on every load/refresh
//   ChatStore.setOnlineStatus(activeUser.username, true);
// }
// renderContacts();
// renderMessages();

// 2. Tab Switching Logic
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentTab = e.target.getAttribute("data-tab");
    renderContacts();
  });
});

// 3. Contact Rendering Logic
const renderContacts = () => {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const onlineNames = JSON.parse(localStorage.getItem("onlineUsers")) || [];
  const allGroups = JSON.parse(localStorage.getItem("groups")) || [];

  contactList.innerHTML = "";
  let listToRender = [];

  if (currentTab === "online") {
    listToRender = allUsers.filter(
      (u) =>
        onlineNames.includes(u.username) && u.username !== activeUser.username,
    );
  } else if (currentTab === "chats") {
    listToRender = allUsers.filter((u) => u.username !== activeUser.username);
  } else if (currentTab === "groups") {
    // Add "Create Group" trigger
    const createLi = document.createElement("li");
    createLi.className = "contact-item create-group-trigger";
    createLi.innerHTML = `
      <div class="avatar plus-avatar">+</div>
      <div class="contact-info">
        <span class="contact-name">Create New Group</span>
      </div>
    `;
    createLi.onclick = openGroupModal;
    contactList.appendChild(createLi);

    // List user-specific groups
    const myGroups = allGroups.filter((g) =>
      g.members.includes(activeUser.username),
    );
    myGroups.forEach((group) => {
      const li = document.createElement("li");
      li.className = `contact-item ${activeRecipient === group.id ? "active" : ""}`;
      li.innerHTML = `
        <div class="avatar">G</div>
        <div class="contact-info">
          <span class="contact-name">${group.name}</span>
        </div>
      `;
      li.onclick = () => switchChat(group.id);
      contactList.appendChild(li);
    });
    return;
  }

  listToRender.forEach((user) => {
    const isOnline = onlineNames.includes(user.username);
    const li = document.createElement("li");
    li.className = `contact-item ${activeRecipient === user.username ? "active" : ""}`;

    // Apply online-indicator class directly to the avatar div
    li.innerHTML = `
      <div class="avatar ${isOnline ? "online-indicator" : ""}">
        ${user.username.charAt(0).toUpperCase()}
      </div>
      <div class="contact-info">
        <span class="contact-name">${user.username}</span>
      </div>
    `;
    li.onclick = () => switchChat(user.username);
    contactList.appendChild(li);
  });
};

// 4. Switch Chat Recipient (Updates title and avatar initials)
const switchChat = (recipient) => {
  activeRecipient = recipient;

  // Mobile: Switch views
  if (window.innerWidth <= 860) {
    leftSidebar.classList.add("hide-mobile");
    rightChatArea.classList.remove("hide-mobile");
  }

  const avatarHeader = document.getElementById("active-chat-avatar");

  if (recipient.startsWith("group_")) {
    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const foundGroup = allGroups.find((g) => g.id === recipient);

    chatTitle.textContent = foundGroup ? foundGroup.name : "Unknown Group";
    // Set Group Initial
    avatarHeader.textContent = foundGroup
      ? foundGroup.name.charAt(0).toUpperCase()
      : "G";
  } else {
    chatTitle.textContent = recipient;
    // Set User Initial
    avatarHeader.textContent = recipient.charAt(0).toUpperCase();
  }

  renderMessages();
  renderContacts();
};

// 5. Message Rendering with Filtering
const renderMessages = () => {
  const allMessages = ChatStore.getMessages();
  chatMessages.innerHTML = "";

  const filtered = allMessages.filter((msg) => {
    if (activeRecipient.startsWith("group_")) {
      return msg.recipient === activeRecipient;
    }
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
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

// 6. Send Message Logic
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (text) {
    const newMsg = new Message(activeUser.username, text, activeRecipient);
    Message.save(newMsg);
    messageInput.value = "";
    renderMessages();
  }
});

// 7. Real-Time Sync
window.addEventListener("storage", (event) => {
  if (
    event.key === "messages" ||
    event.key === "onlineUsers" ||
    event.key === "groups"
  ) {
    renderMessages();
    renderContacts();
  }
});

// 8. Logout Logic
document.getElementById("logout-btn").onclick = () => {
  ChatStore.setOnlineStatus(activeUser.username, false);
  SessionManager.logout();
};

// 9. Group Management Logic
const openGroupModal = () => {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  userSelectionList.innerHTML = "";

  allUsers
    .filter((u) => u.username !== activeUser.username)
    .forEach((user) => {
      const div = document.createElement("div");
      div.className = "user-checkbox-item";
      div.innerHTML = `
      <input type="checkbox" class="group-member-checkbox" value="${user.username}">
      <span>${user.username}</span>
    `;
      userSelectionList.appendChild(div);
    });

  groupModal.classList.remove("hidden");
};

document.getElementById("confirm-create-group").onclick = () => {
  const groupName = document.getElementById("new-group-name").value.trim();
  const checkboxes = document.querySelectorAll(
    ".group-member-checkbox:checked",
  );
  const selectedMembers = Array.from(checkboxes).map((cb) => cb.value);

  if (groupName && selectedMembers.length > 0) {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const newGroup = {
      id: "group_" + Date.now(),
      name: groupName,
      members: [...selectedMembers, activeUser.username],
    };

    groups.push(newGroup);
    localStorage.setItem("groups", JSON.stringify(groups));

    groupModal.classList.add("hidden");
    document.getElementById("new-group-name").value = "";
    renderContacts();
  }
};

document.getElementById("close-modal").onclick = () => {
  groupModal.classList.add("hidden");
  document.getElementById("new-group-name").value = "";
};

// // 10. Browser Exit Cleanup
// window.addEventListener("beforeunload", () => {
//   if (activeUser) {
//     ChatStore.setOnlineStatus(activeUser.username, false);
//   }
// });

// Back Button Logic
backBtn.onclick = () => {
  leftSidebar.classList.remove("hide-mobile");
  rightChatArea.classList.add("hide-mobile");
};
// Initial load
renderContacts();
renderMessages();
