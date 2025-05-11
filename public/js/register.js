document
  .getElementById("registerBtn")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const fullName = document.getElementById("registerName").value.trim();
    const confirmPassword = document
      .getElementById("registerConfirm")
      .value.trim();

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name: fullName }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Register error:", error);
      alert("Server error. Please try again later.");
    }
  });
