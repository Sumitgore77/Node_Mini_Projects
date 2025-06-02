(function () {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})();

    document.addEventListener("DOMContentLoaded", function () {
    const subjectInput = document.getElementById("subjectName");
    const submitButton = document.querySelector("button[type='submit']");
    const pattern = /^[A-Za-z\s]{2,40}$/;

    // Initially disable the button
    submitButton.disabled = true;

    subjectInput.addEventListener("input", function () {
        const isValid = pattern.test(subjectInput.value.trim());

        // Enable or disable button based on validation
        submitButton.disabled = !isValid;

        // Optionally trigger Bootstrap validation visuals
        if (!isValid && subjectInput.value !== "") {
            subjectInput.classList.add("is-invalid");
            subjectInput.classList.remove("is-valid");
        } else if (isValid) {
            subjectInput.classList.remove("is-invalid");
            subjectInput.classList.add("is-valid");
        } else {
            subjectInput.classList.remove("is-valid");
            subjectInput.classList.remove("is-invalid");
        }
    });
});
