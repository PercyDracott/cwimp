const logo = document.getElementById('logo');

const cameraInput = document.getElementById('cameraInput');
const openCameraBtn = document.getElementById('openCameraBtn');
const photo = document.getElementById('photo');

if (window.location.pathname.endsWith("index.html")) {
  const btn = document.querySelector('.image-button');
  if (btn) {
    btn.addEventListener('click', () => {
      const img = document.querySelector('.btn-image');
      if (!img) return;

      img.classList.add('pulse');
      img.addEventListener('animationend', () => {
        img.classList.remove('pulse');
      }, { once: true });
    });
  }
}

  

  function newButtonPressed()
  {
    logo.classList.toggle('animation');
    setTimeout(function() {
      window.location.href = 'cameraPage.html'; // Change this to your actual page
      
    }, 300);
  }

  function backButton() {
    const logotop = document.getElementById("logoalt");

    
    logotop.classList.remove("pulse");
    void logotop.offsetWidth; // Force reflow
    logotop.classList.add("pulse");
    // Redirect after animation completes
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 300);
  }

  
  openCameraBtn.addEventListener('click', () => {
    openCameraBtn.classList.remove("pulse");
    void openCameraBtn.offsetWidth; // Force reflow
    openCameraBtn.classList.add("pulse");
    
    setTimeout(() => {
      cameraInput.click(); 
    }, 300);
  });
  

cameraInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loadImage(
    file,
    async (canvas) => {
      if (canvas.type === 'error') {
        console.error('Error loading image');
        return;
      }

      const imgURL = canvas.toDataURL('image/jpeg');  // <-- fixed here
      photo.src = imgURL;
      photo.style.display = 'block';
      openCameraBtn.style.display = 'none';

      canvas.toBlob(async (blob) => {
        const data = await runInference(blob);
        addHolds(data, imgURL);
      }, 'image/jpeg');
    },
    {
      canvas: true,
      orientation: true,
      maxWidth: undefined,
      maxHeight: undefined,
      minWidth: undefined,
      minHeight: undefined,
      crop: false
    }
  );
});
  async function runInference(file) {
    const apiKey = 'UkIWTxUzXiyIaSaGNmj5';
    const modelId = 'hold-detector-rnvkl/2';
    const url = `https://detect.roboflow.com/${modelId}?api_key=${apiKey}`;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
      console.log('Inference result:', result);
      return result;
  
    } catch (error) {
      console.error('Inference error:', error);
    }
  }
  
  let deleteMode = false;

  function addHolds(data, rawFile) {
    const overlay = document.getElementById("overlay");
    const img = document.getElementById("photo");
    const rawImage = new Image();
    rawImage.src = rawFile;
  
    rawImage.onload = () => {
      const rawWidth = rawImage.naturalWidth;
      const rawHeight = rawImage.naturalHeight;
  
      // Set SVG viewBox to raw image dimensions
      overlay.setAttribute("viewBox", `0 0 ${rawWidth} ${rawHeight}`);
  
      // Set SVG CSS width and height to match displayed image size
      overlay.style.width = img.width + 'px';
      overlay.style.height = img.height + 'px';
  
      // Position SVG overlay to match the photo position
      const imgRect = img.getBoundingClientRect();
      overlay.style.position = 'fixed';
      overlay.style.top = imgRect.top + 'px';
      overlay.style.left = imgRect.left + 'px';
      overlay.style.pointerEvents = 'auto'; // enable polygon clicks
      overlay.style.display = 'block';
  
      overlay.innerHTML = "";
  
      for (const pred of data.predictions) {
        if (pred['confidence'] < 0.3) continue;
  
        // Use raw pixel coordinates directly (no scaling)
        const pointsAttr = pred.points
          .map(p => `${p.x},${p.y}`)
          .join(" ");
  
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", pointsAttr);
        polygon.setAttribute("class", "hold-button");
  
        const colors = ['white', 'cyan', 'lime', 'yellow', 'fuchsia'];
  
        polygon.setAttribute("stroke", colors[0]);
        polygon.setAttribute("data-state", "0");
        polygon.setAttribute("stroke-width", "10");
        polygon.setAttribute("fill", "none");
        polygon.style.cursor = 'pointer';
  
        polygon.addEventListener("click", () => {
          if(deleteMode) overlay.removeChild(polygon);

          let currentState = parseInt(polygon.getAttribute("data-state"), 10);
          let nextState = (currentState + 1) % colors.length;
          polygon.setAttribute("stroke", colors[nextState]);
          polygon.setAttribute("data-state", nextState);
          polygon.setAttribute("stroke-width", colors[nextState] === 'white' ? "10" : "20");
          
        });
  
        overlay.appendChild(polygon);
      }
    };
  }
  

  window.addEventListener('resize', () => {
    const img = document.getElementById("photo");
    const overlay = document.getElementById("overlay");
  
    if (!img || !overlay || overlay.style.display === 'none') return;
  
    overlay.style.width = img.width + 'px';
    overlay.style.height = img.height + 'px';
  
    const imgRect = img.getBoundingClientRect();
    overlay.style.top = imgRect.top + 'px';
    overlay.style.left = imgRect.left + 'px';
  });
  

function toggleDelete()
{
  const editbtn = document.getElementById("editbutton");
  if (deleteMode) 
  {
    deleteMode = false;
    editbtn.style.backgroundColor = "#EEC021";
  }
  else 
  {
    deleteMode = true;
    editbtn.style.backgroundColor = "Crimson";
  }
  editbtn.classList.remove("pulse");
  void editbtn.offsetWidth; // Force reflow
  editbtn.classList.add("pulse");
}

  
