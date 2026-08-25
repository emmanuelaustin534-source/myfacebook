const API_BASE = "https://myfacebook-t7eo.onrender.com/api/auth";

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const errorMsg = document.getElementById("errorMsg");

// SIGNUP PAGE LOGIC
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
      errorMsg.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.textContent = data.error || "Something went wrong.";
        return;
      }

      // Save login token and go to the main feed
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("profilePicture", data.profilePicture);
      window.location.href = "index.html";
    } catch (err) {
      errorMsg.textContent = "Could not connect to server.";
    }
  });
}

// LOGIN PAGE LOGIC
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      errorMsg.textContent = "Please fill in all fields.";
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        errorMsg.textContent = data.error || "Something went wrong.";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("profilePicture", data.profilePicture);
      window.location.href = "index.html";
    } catch (err) {
      errorMsg.textContent = "Could not connect to server.";
    }
  });
}
