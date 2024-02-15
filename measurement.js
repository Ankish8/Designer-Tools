// measurement.js

let measuring = false;
let measureStart = null;

function toggleMeasurementMode() {
    measuring = !measuring;
    if (!measuring) {
        measureStart = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear any measurement lines
        drawRulers();
        drawGuidelines();
    }
}

function drawMeasurementLine(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = 'green';
    ctx.stroke();

    // Display distance
    const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    ctx.fillText(`${distance}px`, (start.x + end.x) / 2, (start.y + end.y) / 2);
}
