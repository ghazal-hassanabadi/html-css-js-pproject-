const allowedEmailEndings = [
  "com",
  "ir",
  "org",
  "net",
  "edu",
  "gov",
  "info"
];

export function initSignup() {

  const fullnameInput = document.getElementById("fullname");
  const fullnameError = document.getElementById("fullnameError");

  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");

  const usernameInput = document.getElementById("username");
  const usernameError = document.getElementById("usernameError");

  const passwordInput = document.getElementById("password");
  const passwordError = document.getElementById("passwordError");

  const form = document.getElementById("signupForm");

  const togglePassword = document.getElementById("togglePassword");

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
    !form ||
    !togglePassword ||
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

    const email = emailInput.value.trim().toLowerCase();

    // شکل کلی: متن، بعد @، بعد متن، بعد نقطه، بعد متن
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      emailError.textContent = "ایمیل معتبر نیست";
      return false;
    }

    // پسوند ایمیل: هر چیزی بعد از آخرین نقطه
    const ending = email.slice(email.lastIndexOf(".") + 1);

    if (!allowedEmailEndings.includes(ending)) {
      emailError.textContent = "پسوند ایمیل مجاز نیست";
      return false;
    }

    emailError.textContent = "";
    return true;
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

    // رمز را خود کاربر انتخاب می‌کند، فقط طولش باید بیشتر از ۶ باشد
    if (passwordInput.value.length > 6) {
      passwordError.textContent = "";
      return true;
    }

    passwordError.textContent = "رمز باید بیشتر از ۶ کاراکتر باشد";
    return false;
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

  passwordInput.addEventListener("input", validatePassword);

  setupEye(togglePassword, passwordInput);


  form.addEventListener("submit", function (event) {

    event.preventDefault();

    // همه رو جدا چک می‌کنیم تا خطای همه‌ی فیلدها با هم نمایش داده بشه
    const fullnameOk = validateFullname();
    const emailOk = validateEmail();
    const usernameOk = validateUsername();
    const passwordOk = validatePassword();

    if (fullnameOk && emailOk && usernameOk && passwordOk) {
      successMessage.classList.remove("is-error");
      successMessage.textContent = "ثبت نام موفق بود";
    } else {
      successMessage.classList.add("is-error");
      successMessage.textContent = "لطفاً فیلدها را درست پر کنید";
    }

  });

}