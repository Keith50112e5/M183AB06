document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("feed");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login");
  const bruteForceButton = document.getElementById("bruteForce");
  const resultText = document.getElementById("result");
  const logoutButton = document.getElementById("logout");
  const postTitleInput = document.getElementById("postTitle");
  const postContentInput = document.getElementById("postContent");
  const postAddButton = document.getElementById("postAdd");

  const encrypt = (str) => {
    const public = sessionStorage.getItem("private");
    if (!public) return str;
    const crypt = new JSEncrypt();
    crypt.setKey(public);
    return crypt.encrypt(str);
  };
  const decrypt = (str) => {
    const private = sessionStorage.getItem("private");
    if (!private) return str;
    const crypt = new JSEncrypt();
    crypt.setKey(private);
    return crypt.decrypt(str);
  };

  const getPosts = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      logoutButton.classList.add("hidden");
      postTitleInput.classList.add("hidden");
      postContentInput.classList.add("hidden");
      postAddButton.classList.add("hidden");
      return;
    }
    feed.innerHTML = "";
    const response = await fetch("/api/posts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const posts = await response.json();
    for (const post of posts) {
      const postElement = document.createElement("div");
      postElement.innerHTML = `
        <h3>${decrypt(post.title)}</h3>
        <p>${decrypt(post.content)}</p>
      `;
      feed.appendChild(postElement);
    }
  };
  getPosts();

  const saveKeys = async () => {
    const response = await fetch("/api/keys");
    const { public, private } = await response.json();
    sessionStorage.setItem("public", public);
    sessionStorage.setItem("private", private);
  };

  const login = async (username, password) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(username)) {
      resultText.innerHTML = "Invalid E-Mail";
      return;
    }
    if (!password || password.length < 10) {
      resultText.innerHTML = "Password must be at least 10 characters.";
      return;
    }
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.text();
    if (!result) return;
    await saveKeys();
    sessionStorage.setItem("token", result);
    logoutButton.classList.remove("hidden");
    postTitleInput.classList.remove("hidden");
    postContentInput.classList.remove("hidden");
    postAddButton.classList.remove("hidden");
    getPosts();
  };

  loginButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    await login(username, password);
  });

  bruteForceButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    while (true) {
      await login(username, password);
    }
  });

  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("public");
    sessionStorage.removeItem("private");
    location.reload();
  });

  postAddButton.addEventListener("click", async () => {
    const title = encrypt(postTitleInput.value);
    const content = encrypt(postContentInput.value);
    const response = await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    getPosts();
  });
});
