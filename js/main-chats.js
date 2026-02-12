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
const main = document.querySelector("main");
let lastWidth = window.innerWidth;

if (!activeUser) {
  window.location.href = "sign-in.html";
}

/**
 * Initializes the mobile view by checking the window width and adjusting the visibility of the left sidebar (contact list) and right chat area
 *  accordingly.
 */

const initMobileView = () => {
  const currentWidth = window.innerWidth;

  if (currentWidth !== lastWidth) {
    if (currentWidth <= 860) {
      if (!activeRecipient || activeRecipient === "online") {
        leftSidebar.classList.remove("hide-mobile");
        rightChatArea.classList.add("hide-mobile");
      }
    } else {
      main.classList.remove("right-side-chats-hidden");
      leftSidebar.classList.remove("hide-mobile");
      rightChatArea.classList.remove("hide-mobile");
    }

    lastWidth = currentWidth;
  }
};

initMobileView();
window.addEventListener("resize", initMobileView);

/**
 * Tab Switching Logic: Adds click event listeners to the tab buttons (Online, Chats, Groups) that update the active tab state and re-render the contact list based on the selected tab.
 */
const tabButtons = document.querySelectorAll(".tab-btn");
tabButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    e.target.classList.add("active");
    currentTab = e.target.getAttribute("data-tab");
    renderContacts();
  });
});

/**
 * Renders the contact list based on the currently active tab (Online, Chats, Groups). It retrieves all users, online users, and groups from localStorage
 *
 * @returns rreturns nothing, but updates the DOM to display the contact list based on the active tab selection.
 */
const renderContacts = () => {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  const onlineNames = JSON.parse(localStorage.getItem("onlineUsers")) || [];
  const allGroups = JSON.parse(localStorage.getItem("groups")) || [];

  contactList.innerHTML = "";
  let listToRender = [];

  if (currentTab === "online") {
    listToRender = allUsers.filter((u) => onlineNames.includes(u.username) && u.username !== activeUser.username);
  } else if (currentTab === "chats") {
    listToRender = allUsers.filter((u) => u.username !== activeUser.username);
  } else if (currentTab === "groups") {
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

    const myGroups = allGroups.filter((g) => g.members.includes(activeUser.username));
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

/**
 * Switches the active chat recipient and updates the UI accordingly.
 *
 * @param {string} recipient username or group ID of the new active chat recipient. If the recipient is a group, it updates the chat title
 * and avatar to reflect the group name. If it's a user, it sets the chat title and avatar to the user's name.
 */
const switchChat = (recipient) => {
  activeRecipient = recipient;

  if (window.innerWidth <= 860) {
    leftSidebar.classList.add("hide-mobile");
    rightChatArea.classList.remove("hide-mobile");
  }

  const avatarHeader = document.getElementById("active-chat-avatar");

  if (recipient.startsWith("group_")) {
    main.classList.remove("right-side-chats-hidden");

    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const foundGroup = allGroups.find((g) => g.id === recipient);

    chatTitle.textContent = foundGroup ? foundGroup.name : "Unknown Group";
    avatarHeader.textContent = foundGroup ? foundGroup.name.charAt(0).toUpperCase() : "G";
  } else {
    chatTitle.textContent = recipient;
    avatarHeader.textContent = recipient.charAt(0).toUpperCase();
    main.classList.remove("right-side-chats-hidden");
  }

  renderMessages();
  renderContacts();
};

/**
 * Renders the chat messages for the currently active recipient (either a user or a group). It retrieves all messages from the ChatStore
 * @returns returns nothing, but updates the DOM to display the chat messages for the active recipient.
 */
const renderMessages = () => {
  const allMessages = ChatStore.getMessages();
  chatMessages.innerHTML = "";

  const filtered = allMessages.filter((msg) => {
    if (activeRecipient.startsWith("group_")) {
      return msg.recipient === activeRecipient;
    }
    return (
      (msg.sender === activeUser.username && msg.recipient === activeRecipient) ||
      (msg.sender === activeRecipient && msg.recipient === activeUser.username)
    );
  });

  filtered.forEach((msg) => {
    const isMe = msg.sender === activeUser.username;
    const msgDiv = document.createElement("div");
    msgDiv.className = `message-wrapper ${isMe ? "sent" : "received"}`;
    msgDiv.innerHTML = `
      <div class="message-bubble">
        <small class="sender-name">- ${msg.sender}</small>
        <p>${msg.text}</p>
        <span class="timestamp">${msg.timestamp}</span>
      </div>
    `;
    chatMessages.appendChild(msgDiv);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

/**
 * Handles the submission of a new message in the chat form.
 *
 * @param {Event} e The submit event triggered when the user submits a message.
 */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!activeRecipient || activeRecipient === "online") {
    alert("Please select a contact or group to chat with.");
    return;
  }

  const text = messageInput.value.trim();
  if (text) {
    const newMsg = new Message(activeUser.username, text, activeRecipient);
    Message.save(newMsg);
    messageInput.value = "";
    renderMessages();
  }
});

/**
 * Listens for changes in localStorage to update the chat messages and contact list in real-time across multiple tabs.
 */
window.addEventListener("storage", (event) => {
  if (event.key === "messages" || event.key === "onlineUsers" || event.key === "groups") {
    renderMessages();
    renderContacts();
  }
});

/**
 * Handles the logout process when the "Logout" button is clicked. It updates the online status of the active user to false in the ChatStore.
 */
document.getElementById("logout-btn").onclick = () => {
  ChatStore.setOnlineStatus(activeUser.username, false);
  SessionManager.logout();
};

/**
 * Opens the group creation modal and populates the user selection list with all users except the active user.
 */
const openGroupModal = () => {
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];
  userSelectionList.innerHTML = "";

  allUsers
    .filter((u) => u.username !== activeUser.username)
    .forEach((user) => {
      const div = document.createElement("div");
      div.className = "user-checkbox-item";
      div.innerHTML = `<input type="checkbox" class="group-member-checkbox" value="${user.username}">
      <span>${user.username}</span>
    `;
      userSelectionList.appendChild(div);
    });

  groupModal.classList.remove("hidden");
};

/**
 * Handles the creation of a new group chat when the "Confirm Create Group" button is clicked. It retrieves the group name and selected members from the form.
 */
document.getElementById("confirm-create-group").onclick = () => {
  const groupName = document.getElementById("new-group-name").value.trim();
  const checkboxes = document.querySelectorAll(".group-member-checkbox:checked");
  const selectedMembers = Array.from(checkboxes).map((cb) => cb.value);
  if (groupName && selectedMembers.length > 0) {
    const groups = JSON.parse(localStorage.getItem("groups")) || [];
    const newGroup = { id: "group_" + Date.now(), name: groupName, members: [...selectedMembers, activeUser.username] };
    groups.push(newGroup);
    localStorage.setItem("groups", JSON.stringify(groups));

    groupModal.classList.add("hidden");
    document.getElementById("new-group-name").value = "";
    renderContacts();
  }
};

/**
 * Closes the group creation modal and clears the group name input field.
 */
document.getElementById("close-modal").onclick = () => {
  groupModal.classList.add("hidden");
  document.getElementById("new-group-name").value = "";
};

/**
 * Handles the back button functionality for mobile view. When the back button is clicked, it shows the left sidebar (contact list) and hides the right chat area.
 */
backBtn.onclick = () => {
  leftSidebar.classList.remove("hide-mobile");
  rightChatArea.classList.add("hide-mobile");
};

renderContacts();
renderMessages();
