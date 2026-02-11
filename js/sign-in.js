document
  .getElementById("signin-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const messageEl = document.getElementById("signInMessage");

    // Retrieve existing users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find the user
    const foundUser = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (foundUser) {
      messageEl.textContent = "Login successful! Welcome, " + username;
      // Optional: Store the logged-in user's info for session management
      localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
      // Redirect to another page if needed, e.g., window.location.href = 'home.html';
    } else {
      messageEl.textContent = "Invalid username or password!";
    }
    // Clear the form
    document.getElementById("signin-form").reset();
    redirectToHome();
  });

function redirectToHome() {
  setTimeout(() => {
    window.location.href = "/pages/main-chats.html";
  }, 2000);
}
