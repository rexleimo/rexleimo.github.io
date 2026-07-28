document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector("[data-wp2-menu]");
  var menu = document.getElementById("wp2-mobile-menu");
  var menuLabel = document.querySelector("[data-wp2-menu-label]");

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("wp2-menu-open", open);
    if (menuLabel) {
      menuLabel.textContent = open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel;
    }
    if (open) {
      var firstLink = menu.querySelector("a, button");
      if (firstLink) firstLink.focus();
    } else {
      menuButton.focus();
    }
  }

  if (menuButton && menu) {
    menuButton.addEventListener("click", function () {
      setMenu(menuButton.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") setMenu(false);
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  document.querySelectorAll("[data-wp2-card-image]").forEach(function (image) {
    function replaceBrokenImage() {
      var frame = image.parentElement;
      image.remove();
      if (frame) {
        frame.classList.add("is-empty");
        frame.textContent = "//";
      }
    }
    if (image.complete && !image.naturalWidth) replaceBrokenImage();
    else image.addEventListener("error", replaceBrokenImage, { once: true });
  });

  var qrButton = document.querySelector("[data-wp2-qr]");
  var qrPanel = document.getElementById("wp2-qr-panel");
  var qrClose = document.querySelector("[data-wp2-qr-close]");
  function setQr(open) {
    if (!qrButton || !qrPanel) return;
    qrButton.setAttribute("aria-expanded", String(open));
    qrPanel.hidden = !open;
  }
  if (qrButton && qrPanel) {
    qrButton.addEventListener("click", function () { setQr(qrPanel.hidden); });
  }
  if (qrClose) qrClose.addEventListener("click", function () { setQr(false); });
});
