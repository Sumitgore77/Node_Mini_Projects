document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('studentForm');
    const inputs = form.querySelectorAll('input, select');

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.checkValidity()) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        } else {
          input.classList.remove('is-valid');
          input.classList.add('is-invalid');
        }
      });

      input.addEventListener('blur', () => {
        if (!input.checkValidity()) {
          input.classList.add('is-invalid');
        }
      });
    });

    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        inputs.forEach(input => {
          if (!input.checkValidity()) {
            input.classList.add('is-invalid');
          }
        });
      }
    });
  });