// Initialize Flatpickr for the DOB input field
flatpickr("#DOB", {
    dateFormat: "d-m-Y",
    maxDate: "today",
    altInput: true,
    altFormat: "F j, Y",
    defaultDate: "01-01-2000",  // Optional: set a default date
});

const form = document.getElementById('personal-form');
const progressBar1 = document.getElementById('progress1');
const journeyText = document.querySelector('.text');

let lastScrollTop = 0;

// Show/hide journey text based on scroll direction
window.addEventListener('scroll', function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scrolling down
        journeyText.style.display = 'none';
    } else {
        // Scrolling up
        journeyText.style.display = 'block';
    }
    
    lastScrollTop = currentScroll;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const FirstName = document.getElementById('FirstName').value.trim();
    const MiddleName = document.getElementById('MiddleName').value.trim();
    const LastName = document.getElementById('LastName').value.trim();
    const DOB = document.getElementById('DOB').value.trim();

    if (!FirstName || !LastName || !DOB) {
        alert('Please fill all the required fields');
        return;
    }

    const dob = new Date(DOB.split('-').reverse().join('-')); // Convert from d-m-Y to Y-m-d
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    if (age < 18) {
        alert('You must be at least 18 years old to submit this form');
        return;
    }

    console.log('Form is valid, submitting...');
    const formData = {
        firstName: FirstName,
        middleName: MiddleName,
        lastName: LastName,
        dob: DOB
    };
    console.log('Form Data:', formData);

    progressBar1.style.width = '50%';
});
