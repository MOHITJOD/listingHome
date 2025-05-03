// Example starter JavaScript for disabling form submissions if there are invalid fields
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


  document.querySelector('.search-button').addEventListener('click', function () {
    const location = document.querySelector('.search-input').value;
    const checkInDate = document.querySelector('.date-input').value;
    const checkOutDate = document.querySelector('.date-input2').value;
    const guests = document.querySelector('.guests-select').value;

    if (!location || !checkInDate || !checkOutDate) {
        alert("Please fill in all the fields.");
        return;
    }

    console.log(`Searching for:
    Location: ${location}
    Check-in: ${checkInDate}
    Check-out: ${checkOutDate}
    Guests: ${guests}`);
    // Here, redirect to search results or perform an AJAX request.
});




 