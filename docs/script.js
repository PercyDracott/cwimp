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
  
    const imgURL = URL.createObjectURL(file);
    photo.src = imgURL;
    photo.style.display = 'block';
  
    // Optionally, hide the button after photo is taken
    openCameraBtn.style.display = 'none';
  
    // Run inference
    const data = await runInference(file);
    addHolds(data, imgURL);
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
      
      // Optional: Call a function to draw results on the image
      // drawDetections(result, photo);
      return result;

    } catch (error) {
      console.error('Inference error:', error);
    }
  }

  function addHolds(data, rawFile)
  {
    console.log('add holds called');
    const overlay = document.getElementById("overlay");
    const img = document.getElementById("photo");
    const rawImage = new Image();
    rawImage.src = rawFile;

    overlay.setAttribute("width", img.width);
      overlay.setAttribute("height", img.height);
      overlay.innerHTML = "";


      for (const pred of data.predictions) {
        const pointsAttr = pred.points.map(p => `${p.x * (img.width / rawImage.width)},${p.y * (img.height / rawImage.height)}`).join(" ");
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", pointsAttr);
        polygon.setAttribute("class", "hold-button");
        
        

        const colors = ['white', 'green', 'blue', 'yellow', 'purple'];

        polygon.setAttribute("stroke", colors[0]); // Start with white
        polygon.setAttribute("data-state", "0");
        polygon.setAttribute("stroke-width", "2");

        polygon.addEventListener("click", () => {
          let currentState = parseInt(polygon.getAttribute("data-state"), 10);
          let nextState = (currentState + 1) % colors.length;
        polygon.setAttribute("stroke", colors[nextState]);
        polygon.setAttribute("data-state", nextState);
        if (colors[nextState] === 'white') {
          polygon.setAttribute("stroke-width", "2");
        } else {
          polygon.setAttribute("stroke-width", "5");
        }
        });
        console.log('hold added');
        overlay.appendChild(polygon);
      }
  }



  
