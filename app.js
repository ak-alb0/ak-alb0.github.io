document.addEventListener("DOMContentLoaded", () => {
  const userIcon = document.querySelector(".ri-user-3-line");
  userIcon.addEventListener("click", () => {
    window.location.href = "login.php";
  });
});


