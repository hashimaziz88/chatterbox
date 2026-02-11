export class Message {
  constructor(sender, text, recipient = "Group") {
    this.sender = sender;
    this.text = text;
    this.recipient = recipient;
    this.timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    this.id = Date.now();
  }

  static save(messageObj) {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push(messageObj);
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  static getAll() {
    return JSON.parse(localStorage.getItem("messages")) || [];
  }
}
