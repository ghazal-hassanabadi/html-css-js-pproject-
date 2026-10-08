export function initSignup() {

  const fullnameInput = document.getElementById("fullname");
  const fullnameError = document.getElementById("fullnameError");

  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");

  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");

  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");

  const confirmInput = document.getElementById("confirmPassword");
  const confirmError = document.getElementById("confirmPasswordError");

  const form = document.getElementById("signupForm");

  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirm = document.getElementById("toggleConfirmPassword");

  const successMessage = document.getElementById("successMessage");

  // اگر این صفحه فرم ثبت نام ندارد، کاری انجام نده
  if (
    !fullnameInput ||
    !fullnameError ||
    !emailInput ||
    !emailError ||
    !usernameInput ||
    !usernameError ||
    !passwordInput ||
    !passwordError ||
    !confirmInput ||
    !confirmError ||
    !form ||
    !togglePassword ||
    !toggleConfirm ||
    !successMessage
  ) {
    return;
  }


  function validateFullname() {

    if (fullnameInput.value.trim().length >= 3) {
      fullnameError.textContent = "";
      return true;
    }

    fullnameError.textContent =
      "نام و نام خانوادگی باید حداقل ۳ حرف باشد";
    return false;
  }

  function validateEmail() {

    // متن، بعد @، بعد متن، بعد نقطه، بعد متن
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "";
      return true;
    }

    emailError.textContent =
      "ایمیل معتبر نیست؛ باید شامل @ و نقطه باشد";
    return false;
  }

  function validateUsername() {

    if (/^[A-Za-z0-9_.]{3,20}$/.test(usernameInput.value)) {
      usernameError.textContent = "";
      return true;
    }

    usernameError.textContent =
      "نام کاربری باید ۳ تا ۲۰ حرف انگلیسی، عدد، نقطه یا زیرخط باشد";
    return false;
  }

  function validatePassword() {

    if (passwordInput.value.length >= 6) {
      passwordError.textContent = "";
      return true;
    }

    passwordError.textContent = "رمز باید حداقل ۶ کاراکتر باشد";
    return false;
  }

  function validateConfirm() {

    if (confirmInput.value === "") {
      confirmError.textContent = "تکرار رمز عبور را وارد کنید";
      return false;
    }

    if (confirmInput.value !== passwordInput.value) {
      confirmError.textContent = "رمز عبور و تکرار آن یکسان نیستند";
      return false;
    }

    confirmError.textContent = "";
    return true;
  }


  function setupEye(toggleBtn, input) {

    const icon = toggleBtn.querySelector("i");

    toggleBtn.addEventListener("click", function () {

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }

    });
  }


  fullnameInput.addEventListener("input", validateFullname);

  emailInput.addEventListener("input", validateEmail);

  usernameInput.addEventListener("input", validateUsername);

  passwordInput.addEventListener("input", function () {

    validatePassword();

    // اگر تکرار رمز قبلاً پر شده، با تغییر رمز دوباره چک بشه
    if (confirmInput.value !== "") {
      validateConfirm();
    }

  });

  confirmInput.addEventListener("input", validateConfirm);

  setupEye(togglePassword, passwordInput);
  setupEye(toggleConfirm, confirmInput);


  form.addEventListener("submit", function (event) {

    event.preventDefault();

    // همه رو جدا چک می‌کنیم تا خطای همه‌ی فیلدها با هم نمایش داده بشه
    const fullnameOk = validateFullname();
    const emailOk = validateEmail();
    const usernameOk = validateUsername();
    const passwordOk = validatePassword();
    const confirmOk = validateConfirm();

    if (
      fullnameOk &&
      emailOk &&
      usernameOk &&
      passwordOk &&
      confirmOk
    ) {
      successMessage.classList.remove("is-error");
      successMessage.textContent = "ثبت نام موفق بود";
    } else {
      successMessage.classList.add("is-error");
      successMessage.textContent = "لطفاً فیلدها را درست پر کنید";
    }

  });

}