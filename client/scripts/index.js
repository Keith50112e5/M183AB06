document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginButton = document.getElementById("login");
  const postsButton = document.getElementById("posts");
  const bruteForceButton = document.getElementById("bruteForce");
  const resultText = document.getElementById("result");

  const login = async (username, password) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const { token, answer } = await response.json();
    document.cookie = "token=" + token;
    resultText.innerHTML = answer;
  };

  const getPosts = async () => {
    const response = await fetch("/api/posts", { method: "GET" });
    const result = await response.json();
    const html = result
      .map(
        (elem) =>
          `<p>${elem.id}.) ${elem.title}</p>
      <p>${elem.content}</p>`
      )
      .join("\n");
    resultText.innerHTML = html;
  };

  postsButton.addEventListener("click", async () => await getPosts());

  loginButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    await login(username, password);
  });

  bruteForceButton.addEventListener("click", async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    for (;;) await login(username, password);
  });
});
