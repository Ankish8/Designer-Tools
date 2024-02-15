let isDrawing = false;
let guidelines = [];

canvas.style.pointerEvents = 'auto'; // Allow interaction with the canvas
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', drawGuide);

let startMousePos = null;

function startDrawing(e) {
    const pos = getMousePosition(e);
    isDrawing = true;
    // Check if drawing starts within ruler areas
    if (pos.x <= 20 || pos.y <= 20) {
        startMousePos = pos;
    }
}

function stopDrawing(e) {
    if (!isDrawing || !startMousePos) return;

    const endPos = getMousePosition(e);
    if (startMousePos.x <= 20) { // Finalize horizontal guideline
        guidelines.push({ x: 20, y: endPos.y, isHorizontal: true });
    } else if (startMousePos.y <= 20) { // Finalize vertical guideline
        guidelines.push({ x: endPos.x, y: 20, isHorizontal: false });
    }
    isDrawing = false;
    startMousePos = null; // Reset starting position
    drawGuidelines(); // Redraw guidelines to include the new one
}


function drawGuide(e) {
    if (!isDrawing || !startMousePos) return;

    const currentPos = getMousePosition(e);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawRulers();
    drawGuidelines(); // Redraw existing guidelines

    ctx.beginPath();
    // Determine guideline orientation based on the starting position
    if (startMousePos.x <= 20) { // Drawing a horizontal guideline
        ctx.moveTo(20, currentPos.y);
        ctx.lineTo(canvas.width, currentPos.y);
    } else if (startMousePos.y <= 20) { // Drawing a vertical guideline
        ctx.moveTo(currentPos.x, 20);
        ctx.lineTo(currentPos.x, canvas.height);
    }
    ctx.strokeStyle = 'red';
    ctx.stroke();
}


function drawGuidelines() {
  guidelines.forEach(guide => {
    ctx.beginPath();
    if (guide.isHorizontal) {
      ctx.moveTo(0, guide.y);
      ctx.lineTo(canvas.width, guide.y);
    } else {
      ctx.moveTo(guide.x, 0);
      ctx.lineTo(guide.x, canvas.height);
    }
    ctx.strokeStyle = 'blue';
    ctx.stroke();
  });
}

function getMousePosition(e) {
  return { x: e.clientX, y: e.clientY };
}
