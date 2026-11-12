// Set your expected launch date here (local browser time).
const launchDate = new Date("2027-01-01T00:00:00").getTime();

const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

const countdownContainer = document.querySelector(".cs-countdown");

function updateCountdown() {
    const now = Date.now();
    const distance = launchDate - now;

    if (distance <= 0) {
        countdownContainer.innerHTML = "<h2>We Are Live!</h2>";
        return;
    }

    const values = {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60)
    };

    Object.keys(values).forEach((key) => {
        countdownElements[key].textContent = String(values[key]).padStart(2, "0");
    });
}

updateCountdown();
const countdownInterval = window.setInterval(() => {
    if (Date.now() >= launchDate) {
        window.clearInterval(countdownInterval);
    }
    updateCountdown();
}, 1000);

// Front-end demo only: connect a form service or backend to receive real emails.
const subscribeForm = document.getElementById("subscribeForm");
const formMessage = document.getElementById("formMessage");

subscribeForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!email) {
        formMessage.textContent = "Please enter your email address.";
        return;
    }

    formMessage.textContent = "Thanks! The form is ready to be connected to an email service.";
    subscribeForm.reset();
});

// Automatically keep the footer year current.
document.getElementById("currentYear").textContent = new Date().getFullYear();
