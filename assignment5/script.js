$(document).ready(function () {

  /* ══════════════════════════════════════════════════════
     UTILITY — showAlert
     Renders a Bootstrap-styled alert into a container
     type: 'success' | 'danger'
     autoHide (ms): if > 0 the alert fades out after that delay
  ══════════════════════════════════════════════════════ */
  function showAlert(containerId, message, type, autoHide) {
    var cssClass =
      type === "success"
        ? "alert alert-earth-success"
        : "alert alert-earth-danger";
    var icon =
      type === "success"
        ? '<i class="bi bi-check-circle-fill me-2"></i>'
        : '<i class="bi bi-exclamation-triangle-fill me-2"></i>';

    var $alert = $("<div>")
      .addClass(cssClass)
      .html(icon + message)
      .hide();

    $(containerId).empty().append($alert);
    $alert.fadeIn(300);

    if (autoHide && autoHide > 0) {
      setTimeout(function () {
        $alert.fadeOut(400);
      }, autoHide);
    }
  }


  /* ══════════════════════════════════════════════════════
     HOME SECTION — #action-btn
     1. Update title text + style
     2. fadeOut → fadeIn
     3. animate left: 50px → left: 0px (chained)
     4. Show auto-hiding alert
  ══════════════════════════════════════════════════════ */
  $("#action-btn").on("click", function () {
    var $title = $("#title");

    // 1. Change text & style
    $title.text("Updated Content");
    $title.css({ color: "red", "font-size": "2rem" });

    // 2. fadeOut → fadeIn → 3. animate left 50px → 0
    $title
      .fadeOut(300)
      .fadeIn(300, function () {
        $(this)
          .animate({ left: "50px" }, 300)
          .animate({ left: "0px" }, 300);
      });

    // 4. Alert (auto-hides after 3 s)
    showAlert(
      "#home-alert-container",
      "✨ Aditi's jQuery magic just fired! Title updated, styled & animated.",
      "success",
      3000
    );
  });


  /* ══════════════════════════════════════════════════════
     HOME SECTION — #reset-btn (extension: reset heading)
  ══════════════════════════════════════════════════════ */
  $("#reset-btn").on("click", function () {
    var $title = $("#title");

    $title.fadeOut(200, function () {
      $(this)
        .text("Hello, I'm Aditi 🌿")
        .css({ color: "", "font-size": "", left: "" })
        .fadeIn(300);
    });

    $("#home-alert-container").empty();

    showAlert(
      "#home-alert-container",
      "🌿 Heading reset to its original warm self!",
      "success",
      3000
    );
  });


  /* ══════════════════════════════════════════════════════
     HOME SECTION — #toggle-btn (extension: slideToggle)
  ══════════════════════════════════════════════════════ */
  $("#toggle-btn").on("click", function () {
    $("#toggle-content").slideToggle(400, function () {
      var visible = $(this).is(":visible");
      $("#toggle-btn").html(
        visible
          ? '<i class="bi bi-eye-slash me-1"></i>Toggle Section'
          : '<i class="bi bi-eye me-1"></i>Toggle Section'
      );
    });
  });


  /* ══════════════════════════════════════════════════════
     FORM — Validation helpers
  ══════════════════════════════════════════════════════ */
  function isValidEmail(email) {
    // Standard email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Mark a field valid/invalid & toggle Bootstrap class
  function setFieldState($field, isValid) {
    if (isValid) {
      $field.removeClass("is-invalid").addClass("is-valid");
    } else {
      $field.removeClass("is-valid").addClass("is-invalid");
    }
  }


  /* ══════════════════════════════════════════════════════
     FORM — Submit
  ══════════════════════════════════════════════════════ */
  $("#user-form").on("submit", function (e) {
    e.preventDefault();

    // Collect values
    var name     = $.trim($("#name").val());
    var email    = $.trim($("#email").val());
    var password = $("#password").val();
    var gender   = $("input[name='gender']:checked").val();
    var country  = $("#country").val();
    var message  = $.trim($("#message").val());

    // Collect checked hobbies
    var hobbies = [];
    $(".hobby-check:checked").each(function () {
      hobbies.push($(this).val());
    });

    // ── Validate ──────────────────────────────────────
    var errors = [];

    // Name
    if (!name) {
      errors.push("Name is required.");
      setFieldState($("#name"), false);
    } else {
      setFieldState($("#name"), true);
    }

    // Email
    if (!email || !isValidEmail(email)) {
      errors.push("Please enter a valid email address.");
      setFieldState($("#email"), false);
    } else {
      setFieldState($("#email"), true);
    }

    // Password
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters.");
      setFieldState($("#password"), false);
    } else {
      setFieldState($("#password"), true);
    }

    // Gender
    if (!gender) {
      errors.push("Please select your gender.");
      // Highlight radio group wrapper
      $("input[name='gender']").closest(".mb-3").addClass("is-invalid");
    } else {
      $("input[name='gender']").closest(".mb-3").removeClass("is-invalid");
    }

    // Hobbies
    if (hobbies.length === 0) {
      errors.push("Please select at least one hobby.");
      $(".hobby-check").addClass("is-invalid");
    } else {
      $(".hobby-check").removeClass("is-invalid");
    }

    // ── Show errors or proceed ─────────────────────────
    if (errors.length > 0) {
      var errorList =
        "<strong>Oops! Please fix the following:</strong><ul class='mb-0 mt-1'>" +
        errors.map(function (e) { return "<li>" + e + "</li>"; }).join("") +
        "</ul>";
      showAlert("#form-alert-container", errorList, "danger", 0);
      // Scroll to alert
      $("html, body").animate(
        { scrollTop: $("#form-alert-container").offset().top - 80 },
        300
      );
      return;
    }

    // ── Success ───────────────────────────────────────
    showAlert(
      "#form-alert-container",
      "🎉 Form submitted successfully, <strong>" + name + "</strong>! Your details are shown below.",
      "success",
      0
    );

    // Populate display fields
    $("#display-name").text(name);
    $("#display-email").text(email);
    $("#display-gender").text(gender);
    $("#display-country").text(country);
    $("#display-hobbies").text(hobbies.join(", "));
    $("#display-message").text(message || "—");

    // Reveal submitted-data card with slideDown
    $("#submitted-data").hide().slideDown(1000);

    // Scroll to submitted data
    $("html, body").animate(
      { scrollTop: $("#submitted-data").offset().top - 80 },
      600
    );
  });


  /* ══════════════════════════════════════════════════════
     FORM — Reset
     Clear validation classes + hide submitted data card
  ══════════════════════════════════════════════════════ */
  $("#form-reset-btn").on("click", function () {
    // Remove highlight classes
    $(".form-control, .form-select").removeClass("is-valid is-invalid");
    $(".hobby-check").removeClass("is-invalid");

    // Hide alerts and submitted card
    $("#form-alert-container").empty();
    $("#submitted-data").slideUp(400);
  });


  /* ══════════════════════════════════════════════════════
     LIVE VALIDATION — clear error highlight on input
  ══════════════════════════════════════════════════════ */
  $("#name, #email, #password").on("input", function () {
    $(this).removeClass("is-invalid");
  });

  $("input[name='gender']").on("change", function () {
    $("input[name='gender']").closest(".mb-3").removeClass("is-invalid");
  });

  $(".hobby-check").on("change", function () {
    if ($(".hobby-check:checked").length > 0) {
      $(".hobby-check").removeClass("is-invalid");
    }
  });

});
