document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const messageEl = document.getElementById("signupMessage");

    // Retrieve existing users or initialize an empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    if (users.some((user) => user.username === username)) {
      messageEl.textContent = "Username already exists!";
      return;
    }

    // Add new user
    users.push({ username: username, email: email, password: password });
    // Save updated users array back to localStorage as a JSON string
    localStorage.setItem("users", JSON.stringify(users));

    messageEl.textContent = "Sign up successful! You can now log in.";
    // Clear the form
    document.getElementById("signup-form").reset();
  });
