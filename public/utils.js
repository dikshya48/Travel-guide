export async function checkTokenValidity() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return false;
  }

  try {
    const response = await fetch("/api/check-auth", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert("Session expired. Please log in again.");
      window.location.href = "login.html";
      return false;
    } else {
      const data = await response.json();
      console.log(data.message);
      return true;
    }
  } catch (error) {
    alert("Error verifying session.");
    window.location.href = "login.html";
    return false;
  }
}

export function handleLogout() {
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  });
}
