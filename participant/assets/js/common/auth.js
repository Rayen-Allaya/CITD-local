function getParticipantData() {
  const token = localStorage.getItem("api_token");
  const participant = getParticipantLocalhost();
  return { participant, token };
}

async function login(identifier) {
  // console.log(identifier);
  const response = await fetch(baseUrl() + "/api/login", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
  // console.log(response);
  const res = await response.json();
  // console.log(res);
  if (response.ok) {
    const user = res.user;
    localStorage.setItem("api_token", user.api_token);
    setParticipantLocalhost(user);
    window.location.href = "./landing.html";
    return { user, message: "", success: true };
  }
  window.location.href = "./unauth.html?message=" + res.message;

  return { user: null, message: res.message, success: false };
}

async function logout(delay = 0) {
  const { participant, token } = getParticipantData();

  if (participant && participant.email) {
    const response = await fetch(baseUrl() + "/api/logout", {
      method: "POST",
      body: JSON.stringify({ identifier: participant.email }),
    });
  }
  localStorage.removeItem("api_token");
  // localStorage.removeItem("participant");
  setTimeout(() => {
    window.location.href = "./index.html";
  }, delay);
}

async function authCheck() {
  const { participant, token } = getParticipantData();
  console.log({ participant, token });

  if (token && participant && participant.email) {
    const response = await fetch(baseUrl() + "/api/auth-check", {
      method: "POST",
      body: JSON.stringify({ identifier: participant.email, api_token: token }),
    });
    const res = await response.json();
    console.log(res);
    if (!res.authorized) {
      logout();
    }
  } else {
    logout();
  }
}
