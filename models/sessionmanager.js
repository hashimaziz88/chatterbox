/**
 * Manages user session data in the browser's sessionStorage.
 */
export class SessionManager {
  /** Logs in a user by storing their information in sessionStorage. This method takes a user object as an argument and saves it under the key 'loggedInUser' in sessionStorage.
   *
   * @param {User} user The user object to be stored in sessionStorage for the active session.
   */
  static login(user) {
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  }

  /**
   * Retrieves the currently active user from sessionStorage.
   * @returns {User|null} The active user object if it exists in sessionStorage, otherwise null.
   */
  static getActiveUser() {
    return JSON.parse(sessionStorage.getItem("loggedInUser"));
  }

  /**
   * Logs out the current user by removing their information from sessionStorage and redirecting to the sign-in page.
   *  This method ensures that the user's session is properly terminated and that they are returned to the login screen.
   */
  static logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "sign-in.html";
  }
}
