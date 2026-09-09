document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");

  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  const registerName = document.getElementById("registerName");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerPasswordConfirm =
    document.getElementById("registerPasswordConfirm");

  // =========================
  // Storage
  // =========================

  const USERS_KEY = "lab3d_users";
  const CURRENT_USER_KEY = "lab3d_current_user";

  function getUsers() {
    try {
      return JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
      );
    } catch (error) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(users)
    );
  }

  // =========================
  // Current User
  // =========================

  function getCurrentUser() {
    try {
      return JSON.parse(
        localStorage.getItem(CURRENT_USER_KEY)
      );
    } catch (error) {
      return null;
    }
  }

  function setCurrentUser(user) {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(user)
    );
  }

  function logout() {
    localStorage.removeItem(
      CURRENT_USER_KEY
    );

    window.location.href = "index.html";
  }

  // جعل الدوال متاحة لبقية ملفات الموقع
  window.getCurrentUser = getCurrentUser;
  window.logout = logout;

  // =========================
  // Switch Forms
  // =========================

  function showLogin() {
    if (!loginForm || !registerForm) {
      return;
    }

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    if (loginTab) {
      loginTab.classList.add("active");
    }

    if (registerTab) {
      registerTab.classList.remove("active");
    }
  }

  function showRegister() {
    if (!loginForm || !registerForm) {
      return;
    }

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    if (loginTab) {
      loginTab.classList.remove("active");
    }

    if (registerTab) {
      registerTab.classList.add("active");
    }
  }

  if (loginTab) {
    loginTab.addEventListener(
      "click",
      showLogin
    );
  }

  if (registerTab) {
    registerTab.addEventListener(
      "click",
      showRegister
    );
  }

  // =========================
  // Register
  // =========================

  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const name =
          registerName.value.trim();

        const email =
          registerEmail.value
            .trim()
            .toLowerCase();

        const password =
          registerPassword.value;

        const confirmPassword =
          registerPasswordConfirm.value;

        if (!name || !email || !password) {
          showAuthMessage(
            "يرجى ملء جميع الحقول المطلوبة.",
            "error"
          );
          return;
        }

        if (password.length < 6) {
          showAuthMessage(
            "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.",
            "error"
          );
          return;
        }

        if (password !== confirmPassword) {
          showAuthMessage(
            "كلمتا المرور غير متطابقتين.",
            "error"
          );
          return;
        }

        const users = getUsers();

        const existingUser =
          users.find(
            user => user.email === email
          );

        if (existingUser) {
          showAuthMessage(
            "هذا البريد الإلكتروني مسجل بالفعل.",
            "error"
          );
          return;
        }

        const newUser = {
          id:
            "user_" +
            Date.now() +
            "_" +
            Math.random()
              .toString(36)
              .slice(2, 8),

          name: name,

          email: email,

          password: password,

          createdAt:
            new Date().toISOString()
        };

        users.push(newUser);

        saveUsers(users);

        // لا نحتاج إلى إبقاء كلمة المرور
        // داخل بيانات الجلسة الحالية
        const sessionUser = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        };

        setCurrentUser(sessionUser);

        showAuthMessage(
          "تم إنشاء حسابك بنجاح! جاري الدخول...",
          "success"
        );

        setTimeout(() => {
          window.location.href =
            "profile.html";
        }, 800);
      }
    );
  }

  // =========================
  // Login
  // =========================

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const email =
          loginEmail.value
            .trim()
            .toLowerCase();

        const password =
          loginPassword.value;

        if (!email || !password) {
          showAuthMessage(
            "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
            "error"
          );
          return;
        }

        const users = getUsers();

        const user =
          users.find(
            item =>
              item.email === email &&
              item.password === password
          );

        if (!user) {
          showAuthMessage(
            "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
            "error"
          );
          return;
        }

        const sessionUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        };

        setCurrentUser(sessionUser);

        showAuthMessage(
          "تم تسجيل الدخول بنجاح! جاري الانتقال...",
          "success"
        );

        setTimeout(() => {
          window.location.href =
            "profile.html";
        }, 800);
      }
    );
  }

  // =========================
  // Message
  // =========================

  function showAuthMessage(
    message,
    type = "info"
  ) {

    let messageBox =
      document.getElementById(
        "authMessage"
      );

    if (!messageBox) {

      messageBox =
        document.createElement("div");

      messageBox.id =
        "authMessage";

      messageBox.className =
        "auth-message";

      const authCard =
        document.querySelector(
          ".auth-card"
        );

      if (authCard) {
        authCard.insertBefore(
          messageBox,
          authCard.querySelector(
            ".auth-tabs"
          )
        );
      }
    }

    messageBox.textContent =
      message;

    messageBox.className =
      "auth-message " + type;

    messageBox.style.display =
      "block";
  }

  // =========================
  // Already Logged In
  // =========================

  const currentUser =
    getCurrentUser();

  if (
    currentUser &&
    window.location.pathname.endsWith(
      "login.html"
    )
  ) {

    // لا نعيد التوجيه تلقائيًا
    // حتى يستطيع المستخدم تغيير الحساب.
  }
});
