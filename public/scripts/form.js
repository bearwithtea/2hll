// public/scripts/form.js
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#subscriptionForm");
  const submitButton = form.querySelector("#submitButton");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const email = form.querySelector('[name="email"]').value;
    const firstName = form.querySelector('[name="first_name"]').value;

    // Validate form data
    if (!validateEmail(email)) {
      document.getElementById("errorAlert").textContent =
        "Please enter a valid email address";
      document.getElementById("errorAlert").style.display = "block";
      return;
    }

    if (firstName.length < 2) {
      document.getElementById("errorAlert").textContent =
        "Please enter your first name";
      document.getElementById("errorAlert").style.display = "block";
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="button-text">Submitting...</span>';

    // Check honeypot
    const honeypot = form.querySelector("#website").value;
    if (honeypot) {
      console.log("Bot detected via honeypot");
      return;
    }

    try {
      // Get reCAPTCHA token
      const token = await grecaptcha.execute(
        "6LePDsoqAAAAAKg6yJR9ZZ923w4QWgdTeBEvg2gv",
        { action: "submit" },
      );

      // Prepare form data
      const formData = {
        email,
        firstName,
        orderSource: form.querySelector('[name="retailer"]').value,
        recaptchaToken: token,
      };

      // Submit form
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        document.getElementById("successAlert").style.display = "block";
        document.getElementById("errorAlert").style.display = "none";
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Subscription failed");
      }
    } catch (error) {
      document.getElementById("errorAlert").textContent = error.message;
      document.getElementById("errorAlert").style.display = "block";
      document.getElementById("successAlert").style.display = "none";
      console.error("Error:", error);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.innerHTML =
        '<span class="button-text">CLAIM YOUR GIFT</span>';
    }
  });
});
