export function initLogin() {

  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");

  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");

  const form = document.getElementById("signupForm");

  const togglePassword = document.getElementById("togglePassword");
  const forgotLink = document.getElementById("forgotLink");

  const successMessage = document.getElementById("successMessage");

  // اگر این صفحه فرم ورود ندارد، کاری انجام نده
  if (
    !usernameInput ||
    !usernameError ||
    !passwordInput ||
    !passwordError ||
    !form ||
    !togglePassword ||
    !forgotLink ||
    !successMessage
  ) {
    return;
  }

  const passwordIcon = togglePassword.querySelector("i");

  function isUsernameValid() {
    return /^[A-Za-z0-9_.]{3,20}$/.test(usernameInput.value);
  }

  function isPasswordValid() {
    return passwordInput.value.length >= 6;
  }

  function validateUsername() {

    if (isUsernameValid()) {
      usernameError.textContent = "";
      return true;
    }

    usernameError.textContent =
      "نام کاربری باید ۳ تا ۲۰ حرف انگلیسی، عدد، نقطه یا زیرخط باشد";
    return false;
  }

  function validatePassword() {

    if (isPasswordValid()) {
      passwordError.textContent = "";
      return true;
    }

    passwordError.textContent = "رمز باید حداقل ۶ کاراکتر باشد";
    return false;
  }

  usernameInput.addEventListener("input", validateUsername);

  passwordInput.addEventListener("input", validatePassword);

  // فعلاً فقط جلوی پرش صفحه را می‌گیرد
  forgotLink.addEventListener("click", function (event) {
    event.preventDefault();
  });

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    const usernameOk = validateUsername();
    const passwordOk = validatePassword();

    if (usernameOk && passwordOk) {
      successMessage.classList.remove("is-error");
      successMessage.textContent = "ورود موفق بود";
    } else {
      successMessage.classList.add("is-error");
      successMessage.textContent = "لطفاً فیلدها را درست پر کنید";
    }

  });

  togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      passwordIcon.classList.remove("fa-eye");
      passwordIcon.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      passwordIcon.classList.remove("fa-eye-slash");
      passwordIcon.classList.add("fa-eye");
    }

  });

}