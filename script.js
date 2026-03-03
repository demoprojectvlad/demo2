// script.js

// Form handling functionality
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    // Handle form data here
    console.log('Form submitted:', Object.fromEntries(formData));
}

// Smooth scrolling functionality
function smoothScroll(target) {
    const targetElement = document.querySelector(target);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation functionality
document.querySelectorAll('a[data-scroll]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        smoothScroll(this.getAttribute('href'));
    });
});

// Example of form submission handling
document.querySelector('form').addEventListener('submit', handleFormSubmit);