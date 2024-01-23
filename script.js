// script.js

// Function to display pop-up messages
function showPopupMessage(message) {
    const popupContainer = document.getElementById('popup-container');

    // Create a div for the pop-up
    const popupDiv = document.createElement('div');
    popupDiv.classList.add('popup');
    popupDiv.textContent = message;

    // Append the pop-up to the container
    popupContainer.appendChild(popupDiv);

    // Remove the pop-up after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
        popupContainer.removeChild(popupDiv);
    }, 3000);
}

// Function to handle video upload asynchronously
async function handleVideoUpload(formData) {
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        showPopupMessage(result.message);
    } catch (error) {
        console.error('Error during video upload:', error);
        showPopupMessage('Error uploading video');
    }
}

// Function to handle registration asynchronously
async function handleRegistration(formData) {
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        showPopupMessage(result.message);
    } catch (error) {
        console.error('Error during registration:', error);
        showPopupMessage('Error during registration');
    }
}