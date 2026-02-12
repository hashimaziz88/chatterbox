/**
 * Message Model: Represents a chat message with properties for sender, text, recipient, timestamp, and a unique ID. It includes
 * static methods to save messages to localStorage and retrieve all messages.
 */
export class Message {
  /**
   * Creates a new Message instance with the given sender, text, and recipient. The timestamp is automatically generated in a human-readable
   * format, and a unique ID is assigned based on the current time. The recipient defaults to "Group" if not specified, allowing for both group and private messages.
   *
   * @param {string} sender - The username of the message sender.
   * @param {string} text - The content of the message.
   * @param {string} recipient - The username of the message recipient (defaults to "Group").
   * @returns {Message} A new Message instance with the specified properties.
   */
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

  /**
   * Saves a message object to localStorage. It retrieves the existing messages from localStorage, adds the new message to the array, and
   * then saves the updated array back to localStorage in JSON format. This method ensures that all messages are persisted across sessions
   * and can be retrieved later using the getAll method.
   *
   * @param {Message} messageObj - The message object to be saved.
   */
  static save(messageObj) {
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push(messageObj);
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  static getAll() {
    return JSON.parse(localStorage.getItem("messages")) || [];
  }
}
