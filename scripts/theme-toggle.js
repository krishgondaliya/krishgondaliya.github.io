(function () {
  var root = document.documentElement;
  var storedTheme = localStorage.getItem("theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = storedTheme || (prefersDark ? "dark" : "light");

  function applyTheme(nextTheme) {
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);

    var button = document.querySelector("[data-theme-toggle]");
    if (button) {
      button.setAttribute("aria-label", nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      button.setAttribute("title", nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
  }

  applyTheme(theme);

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector("[data-theme-toggle]");
    if (!button) return;

    button.addEventListener("click", function () {
      var nextTheme = root.classList.contains("dark") ? "light" : "dark";
      applyTheme(nextTheme);
    });
  });
})();
