(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
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
});