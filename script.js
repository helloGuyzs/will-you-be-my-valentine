const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    window.location.href = "yes_page.html";
}

// Add mousemove event to make no button move away from cursor
document.addEventListener('mousemove', (e) => {
    const noButton = document.querySelector('.no-button');
    if (!noButton) return; // Exit if no-button doesn't exist (e.g., on yes_page.html)
    
    const rect = noButton.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const distance = Math.sqrt((mouseX - buttonCenterX) ** 2 + (mouseY - buttonCenterY) ** 2);
    
    if (distance < 100) { // If mouse is within 100px of button center
        // Move button to a random position on the screen
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        noButton.style.position = 'absolute';
        noButton.style.left = `${newX}px`;
        noButton.style.top = `${newY}px`;
    }
});

// Enhancements for the yes page: excited line, forward animation, and dress selection
document.addEventListener('DOMContentLoaded', () => {
    const excited = document.getElementById('excited');
    const forwardBtn = document.getElementById('forwardBtn');
    const selectionArea = document.getElementById('selectionArea');
    const gifContainer = document.querySelector('.gif_container');

    if (!forwardBtn) return; // only run on yes_page.html when forward exists

    // reveal excited line and then the forward button
    setTimeout(() => {
        excited.classList.add('show');
    }, 200);
    setTimeout(() => {
        forwardBtn.classList.add('visible');
    }, 1200);

    forwardBtn.addEventListener('click', () => {
        forwardBtn.classList.add('fade-out');
        excited.classList.add('fade-out');
        gifContainer.classList.add('fade-out');
        setTimeout(() => {
            // hide initial content and show selection
            if (gifContainer) gifContainer.style.display = 'none';
            forwardBtn.style.display = 'none';
            excited.style.display = 'none';
            selectionArea.classList.add('visible');
            selectionArea.setAttribute('aria-hidden', 'false');
        }, 480);
    });

    // selection handling
    const options = document.querySelectorAll('.dress-option');
    // compliments to show randomly on selection
    const compliments = [
        "Wow bachuuu, tum isme bahut pyaari lag rahi ho , i can imagine!",
        "Main soch sakta hoon, tum isme super cute lagogi.",
        "Aree waah, yeh look tumpe kamaal lag raha hai.",
        "Iss dress mein tum bilkul pretty lagogii ",
        "Mere hisaab se yeh tumhare liye perfect hai."
    ];

    options.forEach(img => {
        img.addEventListener('click', () => {
            options.forEach(i => i.classList.remove('selected'));
            img.classList.add('selected');
            const chosenText = document.getElementById('chosenText');
            const pickBtn = document.getElementById('pickBtn');
            const name = img.alt || img.dataset.file;
            const compliment = compliments[Math.floor(Math.random() * compliments.length)];
            chosenText.textContent = `${name} — ${compliment}`;
            // retrigger simple fade-in animation
            chosenText.classList.remove('visible');
            // force reflow
            void chosenText.offsetWidth;
            chosenText.classList.add('visible');
            
            // Show pick button
            pickBtn.style.display = 'inline-block';
            
            // Store selection data
            window.selectedDress = {
                dress: name,
                file: img.dataset.file,
                timestamp: new Date().toISOString(),
                compliment: compliment
            };
            
            // Auto-save to backend
            const selectionData = window.selectedDress;
            
            fetch('http://localhost:3000/api/save-dress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selectionData)
            }).catch(err => console.log('Server not available — selection saved locally'));
        });
    });
    
    // Pick button handler
    const pickBtn = document.getElementById('pickBtn');
    if (pickBtn) {
        pickBtn.addEventListener('click', () => {
            pickBtn.classList.add('confirmed');
            pickBtn.textContent = '✓ Dress Picked!';
            pickBtn.disabled = true;
            // Navigate to waiting page after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'waiting.html';
            }, 1500);
        });
    }
});