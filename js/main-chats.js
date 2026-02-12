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

if (!activeUser) {
  window.location.href = "sign-in.html";
}

/**
 * Initializes the mobile view by checking the window width and adjusting the visibility of the left sidebar (contact list) and right chat area
 *  accordingly. If the window width is 860 pixels or less, it shows the left sidebar and hides the right chat area to optimize for mobile devices.
 *  If the window width is greater than 860 pixels, it ensures that both the left sidebar and right chat area are visible for desktop users. This
 *  function is called on page load and also whenever the window is resized to maintain a responsive design.
 */
const initMobileView = () => {
  if (window.innerWidth <= 860) {
    leftSidebar.classList.remove("hide-mobile");
    rightChatArea.classList.add("hide-mobile");
  } else {
    leftSidebar.classList.remove("hide-mobile");
    rightChatArea.classList.remove("hide-mobile");
  }
};

initMobileView();

window.addEventListener("resize", initMobileView);

/**
 * Tab Switching Logic: Adds click event listeners to the tab buttons (Online, Chats, Groups) that update the active tab state
 * and re-render the contact list based on the selected tab. When a tab is clicked, it removes the "active" class from all buttons,
 * adds it to the clicked button, updates the currentTab variable, and calls renderContacts() to display the appropriate contacts for that tab.
 * This allows users to easily switch between viewing online users, all chats, and group chats within the chat application.
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
 * Renders the contact list based on the currently active tab (Online, Chats, Groups). It retrieves all users, online users, and groups from localStorage,
 * then filters and displays the appropriate contacts based on the selected tab. For the "Online" tab, it shows only users who are currently online (excluding the active user).
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
    listToRender = allUsers.filter(
      (u) =>
        onlineNames.includes(u.username) && u.username !== activeUser.username,
    );
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
 * and avatar to reflect the group name. If it's a user, it sets the chat title and avatar to the user's name. It also handles mobile view
 * adjustments by showing/hiding the appropriate sections of the UI. Finally, it calls renderMessages() and renderContacts() to update the
 * displayed messages and contact list based on the new active recipient.
 */
const switchChat = (recipient) => {
  activeRecipient = recipient;

  if (window.innerWidth <= 860) {
    leftSidebar.classList.add("hide-mobile");
    rightChatArea.classList.remove("hide-mobile");
  }

  const avatarHeader = document.getElementById("active-chat-avatar");

  if (recipient.startsWith("group_")) {
    const allGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const foundGroup = allGroups.find((g) => g.id === recipient);

    chatTitle.textContent = foundGroup ? foundGroup.name : "Unknown Group";
    avatarHeader.textContent = foundGroup
      ? foundGroup.name.charAt(0).toUpperCase()
      : "G";
  } else {
    chatTitle.textContent = recipient;
    avatarHeader.textContent = recipient.charAt(0).toUpperCase();
  }

  renderMessages();
  renderContacts();
};

/**
 * Renders the chat messages for the currently active recipient (either a user or a group). It retrieves all messages from the ChatStore,
 * filters them based on the active recipient, and displays them in the chat area. Messages sent by the active user are styled differently
 * from received messages, and each message includes the sender's name, message text, and timestamp. After rendering the messages, it scrolls
 * the chat area to the bottom to show the most recent messages.
 *
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
  const text = messageInput.value.trim();
  if (text) {
    const newMsg = new Message(activeUser.username, text, activeRecipient);
    Message.save(newMsg);
    messageInput.value = "";
    renderMessages();
  }
});

/**
 * Listens for changes in localStorage to update the chat messages and contact list in real-time across multiple tabs. When a change is detected in
 * the "messages", "onlineUsers", * or "groups" keys, it calls renderMessages() and renderContacts() to refresh the displayed messages and contacts
 * based on the latest data. This ensures that users see real-time  * updates to their chats and contact statuses even when they have multiple tabs open.
 */
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

/**
 * Handles the logout process when the "Logout" button is clicked. It updates the online status of the active user to false in the ChatStore and then calls
 *  the SessionManager's *  logout method to clear the session and redirect the user to the sign-in page. * This ensures that the user's online status is
 * accurately reflected in the chat application and that they are properly logged out of their session.* When the logout button is clicked, it first sets the
 *  online status of the active user to false in the ChatStore, indicating that they are no longer online. Then, it calls SessionManager.logout() to clear any
 * session data related to the user and redirect them back to the sign-in page, effectively logging them out of the application.
 */
document.getElementById("logout-btn").onclick = () => {
  ChatStore.setOnlineStatus(activeUser.username, false);
  SessionManager.logout();
};

/**
 * Opens the group creation modal and populates the user selection list with all users except the active user. When the "Create New Group" option is clicked,
 * it retrieves all users from localStorage, filters out the active user, and creates a list of checkboxes for each remaining user. This allows the user to select
 * which members they want to include in the new group chat. Finally, it removes the "hidden" class from the group modal to display it to the user.
 */
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

/**
 * Handles the creation of a new group chat when the "Confirm Create Group" button is clicked. It retrieves the group name and selected members from the form,
 * creates a new group object, and saves it to localStorage. After creating the group, it hides the modal, clears the form inputs, and re-renders the contact list
 * to include the new group. This allows users to easily create new group chats and have them immediately available in their contact list.
 */
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
