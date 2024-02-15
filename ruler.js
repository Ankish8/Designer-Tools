// content.js
document.body.style.position = 'relative'; // Ensure the body can contain absolute elements
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '10000'; // Make sure it's on top of other elements
canvas.style.pointerEvents = 'none'; // Allow clicks to pass through

document.body.appendChild(canvas);

// Function to draw rulers
function drawRulers() {
    // Clear existing ruler areas
    ctx.clearRect(0, 0, canvas.width, 30); // Clear area for horizontal ruler
    ctx.clearRect(0, 0, 30, canvas.height); // Clear area for vertical ruler

    // Dark mode background colors
    ctx.fillStyle = 'rgba(36, 36, 36, 0.95)'; // Dark background with some transparency
    ctx.fillRect(0, 0, canvas.width, 20); // Horizontal ruler background
    ctx.fillRect(0, 0, 20, canvas.height); // Vertical ruler background

    // Styling for the ruler markings and numbers
    ctx.font = '10px Helvetica';
    ctx.fillStyle = '#FFF'; // White text for dark mode
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white for markings
    ctx.lineWidth = 2; // Increased width for ruler lines

    // Drawing the horizontal ruler markings and numbers
    for (let x = 0; x < canvas.width; x += 10) {
        ctx.beginPath();
        // Only draw longer line and number every 100 units
        if (x % 100 === 0) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 20); // Longer line for every 100 units
            ctx.fillText(x, x + 5, 17); // Positioning text a bit lower for visibility
        } else {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 10); // Short line for intermediate 10 units
        }
        ctx.stroke();
    }

    // Drawing the vertical ruler markings and numbers
    for (let y = 0; y < canvas.height; y += 10) {
        ctx.beginPath();
        // Only draw longer line and number every 100 units
        if (y % 100 === 0) {
            ctx.moveTo(0, y);
            ctx.lineTo(20, y); // Longer line for every 100 units
            ctx.fillText(y, 2, y + 15); // Adjusting text position for readability
        } else {
            ctx.moveTo(0, y);
            ctx.lineTo(10, y); // Short line for intermediate 10 units
        }
        ctx.stroke();
    }
}

drawRulers();
