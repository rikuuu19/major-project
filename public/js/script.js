console.log("JS Loaded");

(() => {
  'use strict';

  // Bootstrap validation
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

})();

// ✅ GST LOGIC (FIXED + CLEAN)
document.addEventListener("DOMContentLoaded", () => {

  const gstToggle = document.getElementById("switchCheckDefault");
  const prices = document.querySelectorAll(".price");

  if (!gstToggle || prices.length === 0) return;

  gstToggle.addEventListener("change", () => {

    prices.forEach(priceEl => {

      const basePrice = parseFloat(priceEl.dataset.original);

      if (isNaN(basePrice)) return;

      if (gstToggle.checked) {
        const gstPrice = basePrice * 1.18;
        priceEl.innerText = gstPrice.toLocaleString("en-IN");
      } else {
        priceEl.innerText = basePrice.toLocaleString("en-IN");
      }

    });

  });

});