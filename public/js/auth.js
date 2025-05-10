document
  .getElementById("login-btn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Data received:", data);

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  });
