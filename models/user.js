import { sha256 } from "../utils/encrypt.js";

/**
 * User model to represent user data and handle registration/authentication logic. * This model interacts with localStorage to persist
 *  user data across sessions, allowing for user registration and authentication.  * It provides methods to check for unique usernames,
 *  register new users, and authenticate existing users based on their credentials.
 */
export class User {
  /**
   * Constructor to create a new User instance with the given username, email, and password. The isOnline property is initialized to false by default,
   * indicating that the user is not currently online. This model allows for easy creation and management of user data, which can be stored in localStorage
   * for persistence across sessions.
   *
   * @param {string} username
   * @param {string} email
   * @param {string} password
   */
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isOnline = false;
  }

  /**
   * Checks if a username is unique (i.e., not already taken by another user).
   *
   * @param {string} username
   * @returns {boolean} True if the username is unique, false otherwise.
   */
  static isUsernameUnique(username) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return !users.some((u) => u.username === username);
  }

  /**
   * Checks if an email is unique (i.e., not already taken by another user).
   * @param {string} email
   * @returns {boolean} True if the email is unique, false otherwise.
   */
  static isEmailUnique(email) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return !users.some((u) => u.email === email);
  }

  /**
   * Registers a new user by adding them to the list of existing users in localStorage.
   *
   * @param {User} userObj
   */
  static register(userObj) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userObj);
    localStorage.setItem("users", JSON.stringify(users));
  }

  /**
   * Authenticates a user by checking if the provided username and password match an existing user in localStorage.
   *
   * @param {string} username
   * @param {string} password
   * @return {Object|null} The user object if authentication is successful, or null if it fails.
   */
  static authenticate(username, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    return users.find(
      (u) => u.username === username && u.password === password,
    );
  }
}
