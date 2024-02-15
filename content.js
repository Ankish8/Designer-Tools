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
    const rulerHeight = 30; // Increased ruler height for better legibility
    ctx.clearRect(0, 0, canvas.width, rulerHeight); // Clear area for horizontal ruler
    ctx.clearRect(0, 0, rulerHeight, canvas.height); // Clear area for vertical ruler

    // Apply dark theme styling
    ctx.fillStyle = 'rgba(31, 31, 31, 1)'; // Dark color for the background
    ctx.fillRect(0, 0, canvas.width, rulerHeight); // Fill horizontal ruler background
    ctx.fillRect(0, 0, rulerHeight, canvas.height); // Fill vertical ruler background
    ctx.save();

    ctx.font = '12px Helvetica';
    ctx.fillStyle = '#C0C0C0'; // Light grey for text
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Semi-transparent white for line markings
    ctx.textAlign = 'start';


    // Adjust marking intervals to every 100 units
    for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rulerHeight);
        ctx.fillText(x, x + 5, 15); // Adjust text position for visibility
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rulerHeight, y);
        ctx.fillText(y, 5, y + 10); // Adjust text position for readability
        ctx.stroke();
    }
    ctx.restore();

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
    // Initialize newGuideline at the top of your function to ensure it's in scope when used later
    let newGuideline = {};

    if (startMousePos.x <= 20) {
        // Assuming horizontal guideline
        newGuideline = { x: 20, y: endPos.y, isHorizontal: true };
    } else if (startMousePos.y <= 20) {
        // Assuming vertical guideline
        newGuideline = { x: endPos.x, y: 20, isHorizontal: false };
    }

    // Add the constructed guideline object to the guidelines array
    guidelines.push(newGuideline);
    isDrawing = false;
    startMousePos = null; // Reset starting position

    // Clear the canvas and redraw everything to reflect the updated guidelines
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRulers();
    drawGuidelines();

      
  console.log("New guideline added:", newGuideline);
  console.log("Total guidelines:", guidelines.length);
  console.log("Drawing guidelines, count:", guidelines.length);

  
}



function drawGuide(e) {
    if (!isDrawing || !startMousePos) return;

    const currentPos = getMousePosition(e);

    // Clear and redraw the canvas to ensure everything is up-to-date
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRulers();
    drawGuidelines(); // Ensures that all permanent guidelines are redrawn

    // Draw the temporary guideline with improved visibility
    ctx.beginPath();
    // Enhance guideline visibility and distinction
    ctx.strokeStyle = 'red'; // Make the temporary guideline red for visibility
    ctx.lineWidth = 2; // Slightly thicker line for the temporary guideline
    ctx.setLineDash([5, 5]); // Optional: make the line dashed to distinguish it as temporary

    // Determine the guideline orientation based on the starting position
    if (startMousePos.x <= 20) { // For horizontal guidelines
        ctx.moveTo(20, currentPos.y);
        ctx.lineTo(canvas.width, currentPos.y);
    } else if (startMousePos.y <= 20) { // For vertical guidelines
        ctx.moveTo(currentPos.x, 20);
        ctx.lineTo(currentPos.x, canvas.height);
    }

    ctx.stroke();

    // Reset line dash and line width to defaults for other drawings
    ctx.setLineDash([]); // Remove the line dash effect for subsequent drawings
    ctx.lineWidth = 1; // Reset the line width to default
}


function drawMeasurementWithArrows(start, end, isHorizontal) {
    const distance = isHorizontal ? Math.abs(end.y - start.y) : Math.abs(end.x - start.x);
    // Calculate midpoint for the distance label
    const midpoint = isHorizontal ? { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 } : { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    // Offset position for clarity
    const offset = isHorizontal ? { x: 0, y: -15 } : { x: 15, y: 0 };

    // Drawing arrow indicating measurement direction
    if (isHorizontal) {
        drawArrow({ x: start.x, y: start.y + offset.y }, { x: end.x, y: end.y + offset.y });
    } else {
        drawArrow({ x: start.x + offset.x, y: start.y }, { x: end.x + offset.x, y: end.y });
    }

    // Background for text for better readability
    ctx.fillStyle = 'rgba(50, 50, 50, 0.7)';
    const textWidth = ctx.measureText(`${distance}px`).width;
    const backgroundPadding = 5;
    ctx.fillRect(midpoint.x - textWidth / 2 - backgroundPadding + offset.x, midpoint.y - 10 + offset.y, textWidth + 2 * backgroundPadding, 20);

    // Text indicating measurement
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`${distance}px`, midpoint.x + offset.x, midpoint.y + 4 + offset.y);
}

function drawArrow(from, to) {
    // Size and angle of the arrow head
    const headLength = 10;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = '#FFC107'; // Arrow color
    ctx.fillStyle = '#FFC107';
    ctx.lineWidth = 1;

    // Starting path of the arrow from the start square to the end square and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Starting a new path from the head of the arrow to one of the sides of the point
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));

    // Path from the side point of the arrow, to the other side point
    ctx.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));

    // Path back to the tip of the arrow, and then again to the opposite side point
    ctx.lineTo(to.x, to.y);
    ctx.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));

    // Draws the paths created above
    ctx.stroke();
    ctx.fill();
}


function drawGuidelines() {
    guidelines.forEach((guide, index, array) => {
        ctx.beginPath();
        if (guide.isHorizontal) {
            ctx.moveTo(30, guide.y);
            ctx.lineTo(canvas.width, guide.y);
        } else {
            ctx.moveTo(guide.x, 20);
            ctx.lineTo(guide.x, canvas.height);
        }
        ctx.strokeStyle = '#B3B3B3';
        ctx.stroke();

        // Now, check if we should draw a measurement and arrow to the next guideline
        if (index < array.length - 1) {
            const nextGuide = array[index + 1];
            // Ensure the next guide is of the same orientation before drawing a measurement
            if (guide.isHorizontal === nextGuide.isHorizontal) {
                const start = { x: guide.x, y: guide.y };
                const end = { x: nextGuide.x, y: nextGuide.y };
                // Adjust start and end points if needed based on your measurement logic
                drawMeasurementWithArrows(start, end, guide.isHorizontal);
            }
        }
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
