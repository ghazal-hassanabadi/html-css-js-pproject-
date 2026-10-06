export function initCreateAccount() {

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

  usernameInput.addEventListener("input", function () {

    if (isUsernameValid()) {
      usernameError.textContent = "";
    } else {
      usernameError.textContent =
        "نام کاربری باید ۳ تا ۲۰ حرف انگلیسی، عدد، نقطه یا... باشد";
    }

  });

  passwordInput.addEventListener("input", function () {

    if (isPasswordValid()) {
      passwordError.textContent = "";
    } else {
      passwordError.textContent = "رمز باید حداقل ۶ کاراکتر باشد";
    }

  });

  // فعلاً فقط جلوی پرش صفحه را می‌گیرد
  forgotLink.addEventListener("click", function (event) {
    event.preventDefault();
  });

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (isUsernameValid() && isPasswordValid()) {
      successMessage.textContent = "ورود موفق بود";
    } else {
      console.log("لطفاً فیلدها را درست پر کنید");
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