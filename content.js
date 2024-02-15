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

// Function to save guidelines
function saveGuidelines() {
    chrome.storage.local.set({ 'guidelines': guidelines }, function() {
      console.log('Guidelines saved');
    });
  }
  
  // Function to load guidelines
  function loadGuidelines() {
    chrome.storage.local.get('guidelines', function(data) {
      guidelines = data.guidelines || [];
      drawGuidelines();
    });
  }
  
  // Call loadGuidelines when the script is injected
  loadGuidelines();
  
  // Extend existing event listeners and functions in content.js

// Assuming existing variables and functions are in place...t

function detectAlignmentAndDrawSmartGuide(e) {
    const pos = getMousePosition(e);
    // Placeholder for detection logic; to be implemented
  }
  
  // Modify drawGuide function to include smart guide logic
  // Placeholder for modifications; to be implemented
  
  let measuring = false;
let measureStart = null;

canvas.addEventListener('dblclick', toggleMeasurementMode);

function toggleMeasurementMode() {
  measuring = !measuring;
  if (!measuring) {
    measureStart = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear any measurement lines
    drawRulers();
    drawGuidelines();
  }
}

canvas.addEventListener('click', (e) => {
  if (!measuring) return;
  if (measureStart) {
    const measureEnd = getMousePosition(e);
    drawMeasurementLine(measureStart, measureEnd);
    measureStart = null; // Reset start point for next measurement
  } else {
    measureStart = getMousePosition(e);
  }
});

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

let gridSettings = {
    spacing: 50, // Default grid spacing
    color: '#CCCCCC', // Default grid color
    enabled: false // Grid is disabled by default
  };
  
  // Function to draw the grid
  function drawGrid() {
    if (!gridSettings.enabled) return; // Only draw the grid if enabled
  
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas for grid drawing
    drawRulers(); // Redraw rulers
    drawGuidelines(); // Redraw guidelines
  
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += gridSettings.spacing) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y < canvas.height; y += gridSettings.spacing) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.strokeStyle = gridSettings.color;
    ctx.stroke();
  }
  
  // Function to toggle grid visibility
function toggleGrid() {
    gridSettings.enabled = !gridSettings.enabled;
    if (gridSettings.enabled) {
      drawGrid();
    } else {
      redrawCanvas(); // Clear the grid and redraw other elements
    }
  }
  
  // Example keyboard shortcut to toggle grid (adjust as needed)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'g') { // CTRL+G to toggle grid
      toggleGrid();
    }
  });
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleGrid") {
        toggleGrid(); // Make sure this function exists and toggles the grid visibility
    }
});
  // Function to save grid settings
function saveGridSettings() {
    chrome.storage.local.set({ 'gridSettings': gridSettings }, function() {
      console.log('Grid settings saved');
    });
  }
  
  // Function to load grid settings
  function loadGridSettings() {
    chrome.storage.local.get('gridSettings', function(data) {
      if (data.gridSettings) {
        gridSettings = data.gridSettings;
        if (gridSettings.enabled) drawGrid();
      }
    });
  }
  
  // Call loadGridSettings when the script is injected
  loadGridSettings();
  
  // Add to content.js

// Function to create an image overlay
function createImageOverlay(imageURL) {
    const overlay = document.createElement('img');
    overlay.src = imageURL;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.opacity = '0.5'; // Default opacity
    overlay.style.pointerEvents = 'none'; // Allow interaction with the page below
    overlay.style.zIndex = '10001'; // Ensure it's above other overlays
    document.body.appendChild(overlay);
  
    return overlay;
  }
  
  // Handling image file upload and creating an overlay
  function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      createImageOverlay(e.target.result);
    };
    reader.readAsDataURL(file);
  }
  // Assuming `overlay` is the image overlay element
function adjustOverlayOpacity(overlay, opacity) {
    overlay.style.opacity = opacity;
  }
  