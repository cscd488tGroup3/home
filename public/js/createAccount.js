import { createNewUserAccount } from "./user.js";

document.getElementById("createAccountForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmpassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Hash the password
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
    const hashHex = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    const formData = new FormData(e.target);
    const userData = {
        adminWorker: 'https://astro-d1-integration.ecrawford4.workers.dev/api/write/admin',
        userWorker: 'https://astro-d1-integration.ecrawford4.workers.dev/api/write/info',
        fname: formData.get("firstname"),
        lname: formData.get("lastname"),
        email: formData.get("email"),
        uid: formData.get("username"),
        dob: formData.get("dob"),
        doj: new Date().toISOString().split("T")[0],
        hashpass: hashHex,
        auth: import.meta.env.USR_DB,
        wauth: import.meta.env.USR_DB_W,
        aauth: import.meta.env.USR_DB_W_AUTH
    };

    try {
        const response = await createNewUserAccount(userData);

        if (response.ok) {
            const result = await response.json();
            alert("Account created successfully!");
            const newTab = window.open();
            newTab.document.body.innerText = JSON.stringify(result, null, 2);
        } else {
            throw new Error("Failed to create account");
        }
    } catch (error) {
        console.error("Account creation failed:", error);
        alert("Failed to create account. Please try again.");
    }
});
