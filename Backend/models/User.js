const { v4: uuidv4 } = require('uuid');

// In-memory storage for users
const users = new Map();

class User {
  constructor(username, email) {
    this.id = uuidv4();
    this.username = username;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }

  // Static methods for user management
  static create(username, email) {
    const user = new User(username, email);
    users.set(user.id, user);
    return user;
  }

  static findById(id) {
    return users.get(id);
  }

  static findByUsername(username) {
    for (const [_, user] of users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  // New: find user by email (case-insensitive)
  static findByEmail(email) {
    if (!email) return null;
    const lookup = String(email).trim().toLowerCase();
    for (const [_, user] of users) {
      if (String(user.email).trim().toLowerCase() === lookup) {
        return user;
      }
    }
    return null;
  }

  static findAll() {
    return Array.from(users.values());
  }

  static exists(username) {
    return this.findByUsername(username) !== null;
  }

  // New: email existence check
  static emailExists(email) {
    return this.findByEmail(email) !== null;
  }

  static getCount() {
    return users.size;
  }

  // Instance methods
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
