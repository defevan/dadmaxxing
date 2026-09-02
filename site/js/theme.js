(function () {
  var key = "theme";
  var root = document.documentElement;

  function current() {
    return root.dataset.theme === "dark" ? "dark" : "light";
  }

  function label(theme) {
    return theme === "dark" ? "light mode" : "dark mode";
  }

  function apply(theme) {
    root.dataset.theme = theme;
    var button = document.getElementById("theme-toggle");
    if (!button) return;
    button.textContent = label(theme);
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  apply(current());

  document.addEventListener("click", function (event) {
    var button = event.target.closest("#theme-toggle");
    if (!button) return;
    var next = current() === "dark" ? "light" : "dark";
    localStorage.setItem(key, next);
    apply(next);
  });
})();
