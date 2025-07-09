(() => {
  'use strict';

  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();  // ❗ Prevent form from submitting
        event.stopPropagation();
      }
      form.classList.add('was-validated');  // ❗ Show Bootstrap validation UI
    }, false);
  });
})();

//loader
  window.addEventListener("load", function () {
    const overlay = document.getElementById("loader-overlay");
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    setTimeout(() => overlay.remove(), 500); 
  });