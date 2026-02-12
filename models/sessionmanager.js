/**
 * 
 */
export class SessionManager {
  static login(user) {
    // sessionStorage keeps the user unique to the tab
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  }

  static getActiveUser() {
    return JSON.parse(sessionStorage.getItem("loggedInUser"));
  }

  static logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "sign-in.html";
  }
}
