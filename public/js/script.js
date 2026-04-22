console.log("JS Loaded");
(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
<<<<<<< HEAD
})()

const gstToggle = document.querySelector("#switchCheckDefault");
const prices = document.querySelectorAll(".price");

gstToggle.addEventListener("change", () => {
    prices.forEach(priceEl => {
        let basePrice = parseFloat(priceEl.dataset.original);

        if (gstToggle.checked) {
            let newPrice = basePrice + (basePrice * 0.18);
            priceEl.innerText = newPrice.toLocaleString("en-IN");
        } else {
            priceEl.innerText = basePrice.toLocaleString("en-IN");
        }
    });
=======
})();

// ✅ GST LOGIC
document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("switchCheckDefault");
  const priceEl = document.querySelector(".price");

  if (!checkbox || !priceEl) return;

  const basePrice = parseFloat(priceEl.dataset.price);

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      priceEl.innerText = (basePrice * 1.18).toLocaleString("en-IN");
    } else {
      priceEl.innerText = basePrice.toLocaleString("en-IN");
    }
  });
>>>>>>> a204477 (Final fixes: GST toggle + category bug)
});