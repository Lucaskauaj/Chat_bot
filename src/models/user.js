class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password; // Consider hashing the password before storing it
    }

    // Method to validate user data
    validate() {
        if (!this.name || !this.email || !this.password) {
            throw new Error("All fields are required.");
        }
        if (!this.validateEmail(this.email)) {
            throw new Error("Invalid email format.");
        }
        if (this.password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
        }
    }

    // Helper method to validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
}

module.exports = User;