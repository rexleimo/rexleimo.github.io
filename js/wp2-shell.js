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

  var toc = document.querySelector("[data-wp2-toc]");
  var tocButton = document.querySelector("[data-wp2-toc-toggle]");
  var tocPanel = document.querySelector("[data-wp2-toc-panel]");
  function setToc(open) {
    if (!tocButton || !tocPanel) return;
    tocButton.setAttribute("aria-expanded", String(open));
    tocPanel.hidden = !open;
  }
  if (toc && tocButton && tocPanel) {
    var desktopToc = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    setToc(desktopToc.matches);
    desktopToc.addEventListener("change", function (event) { setToc(event.matches); });
    tocButton.addEventListener("click", function () { setToc(tocPanel.hidden); });
    tocPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!desktopToc.matches) setToc(false);
      });
    });
    document.addEventListener("click", function (event) {
      if (!desktopToc.matches && !toc.contains(event.target)) setToc(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setToc(false);
    });
  }

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
