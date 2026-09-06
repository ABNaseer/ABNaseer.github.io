/**
 * Mostly progressive enhancement, with one deliberate exception. Nav links,
 * scrolling, and the About section's second paragraph all still work/show
 * with JS disabled. Experience's "Show more" and each Projects card
 * (data-disclosure-toggle, see below) plus the Get in Touch popup do NOT:
 * with JS off, the triggers still render but do nothing, and their content
 * stays visually collapsed (max-height: 0 for disclosures, [hidden] for
 * the modal — the disclosure panels stay in the accessibility tree even
 * though clipped; the modal does not). This trade-off is intentional and
 * documented in AGENTS.md — see that file before changing it.
 */
(function () {
  "use strict";

  // Mark that JS is active so CSS can opt in to the reveal-on-scroll effect.
  document.documentElement.classList.add("js");

  // Mobile nav toggle.
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu after choosing a link (small mobile UX touch).
    navMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Subtle scroll-reveal for sections, with a safe fallback.
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // No IntersectionObserver support: just show everything.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // Keep the footer year current without needing a manual edit each year.
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // In-page nav/anchor links scroll smoothly without writing a #hash into
  // the URL. Excludes .glightbox triggers, which GLightbox itself handles
  // (some point at hidden inline-content templates, not real sections).
  var anchorLinks = document.querySelectorAll('a[href^="#"]:not(.glightbox)');
  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href").slice(1);
      var target = id && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Generic inline expand/collapse for Experience "Show more" and each
  // Projects card's header: any [data-disclosure-toggle] toggles .is-expanded
  // on both itself (for the chevron rotation and aria-expanded) and the
  // panel named in its aria-controls. Also swaps a .timeline__toggle-label
  // between "Show more" / "Show less" when present.
  document.querySelectorAll("[data-disclosure-toggle]").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    var label = btn.querySelector(".timeline__toggle-label");
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(expanded));
      btn.classList.toggle("is-expanded", expanded);
      if (panel) panel.classList.toggle("is-expanded", expanded);
      if (label) label.textContent = expanded ? "Show less" : "Show more";
    });
  });

  // About section's "Read the boring part" inline clamp/expand (not a
  // popup — see the header comment above). Both the overlay pill (shown
  // collapsed) and the inline trigger (shown expanded, last child of the
  // paragraph's text) toggle the same .is-expanded class on #aboutMore.
  var aboutMore = document.getElementById("aboutMore");
  if (aboutMore) {
    aboutMore.querySelectorAll(".about__toggle").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var expanded = aboutMore.classList.toggle("is-expanded");
        aboutMore.querySelectorAll(".about__toggle").forEach(function (b) {
          b.setAttribute("aria-expanded", String(expanded));
        });
      });
    });
  }

  // Generic popup/modal system: powers "Get in Touch" and the
  // Experience/Project detail popups. Any element with
  // data-open-modal="someId" opens #someId; anything inside a modal with
  // data-close-modal (including the backdrop) closes that modal; Escape
  // closes whichever modal is open.
  var allModals = document.querySelectorAll(".contact-modal");
  var lastFocusedTrigger = null;

  var openModal = function (modal) {
    if (!modal) return;
    lastFocusedTrigger = document.activeElement;
    modal.hidden = false;
    var closeBtn = modal.querySelector(".contact-modal__close");
    if (closeBtn) closeBtn.focus();
  };

  var closeModal = function (modal) {
    if (!modal) return;
    modal.hidden = true;
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  };

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    allModals.forEach(function (modal) {
      if (!modal.hidden) closeModal(modal);
    });
  });

  allModals.forEach(function (modal) {
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", function () {
        closeModal(modal);
      });
    });
  });

  document.querySelectorAll("[data-open-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openModal(document.getElementById(trigger.getAttribute("data-open-modal")));
    });
  });

  // Toast: a small "Copied to clipboard" notice, shared by every copy
  // button on the page (currently only inside the Get in Touch modal).
  var toast = document.getElementById("toast");
  var toastTimer = null;
  var showToast = function (message) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    // Force layout so the transition plays even on rapid repeat clicks.
    void toast.offsetWidth;
    toast.classList.add("is-visible");
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        toast.hidden = true;
      }, 250);
    }, 1800);
  };

  // Copy-to-clipboard buttons. Feedback is two-fold: the icon swaps to a
  // checkmark for a beat, and a toast confirms what got copied.
  var checkmarkIcon = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8.5 6.5 12 13 4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var originalHTML = btn.innerHTML;
    var originalLabel = btn.getAttribute("aria-label");
    var resetTimer = null;

    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy");
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(value).then(function () {
        clearTimeout(resetTimer);
        btn.classList.add("is-copied");
        btn.innerHTML = checkmarkIcon;
        btn.setAttribute("aria-label", "Copied!");
        showToast("Copied to clipboard");
        resetTimer = setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.innerHTML = originalHTML;
          if (originalLabel) btn.setAttribute("aria-label", originalLabel);
        }, 1500);
      }).catch(function () {
        /* Clipboard write failed (unsupported/blocked); nothing to fall back to here. */
      });
    });
  });

  // Background dot-grain drifts a little as the page scrolls (Motion,
  // loaded via CDN in index.html) — purely scroll-linked, never animates on
  // its own, and skipped entirely for reduced-motion users or if Motion
  // failed to load.
  var bgLayer = document.querySelector(".bg-layer");
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (bgLayer && typeof Motion === "object" && !prefersReducedMotion) {
    Motion.scroll(function (progress) {
      bgLayer.style.backgroundPosition = "center " + progress * 60 + "px";
    });
  }

  // Project screenshot lightbox (GLightbox, loaded via CDN in index.html).
  // Progressive enhancement: if the library fails to load (offline, CDN
  // blocked), the .glightbox links still work as plain links to the images.
  if (typeof GLightbox === "function") {
    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: false,
    });
  }
})();
