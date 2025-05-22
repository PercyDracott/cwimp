const logo = document.getElementById('logo');


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

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('capture');
const photo = document.getElementById('photo');

let stream = null;
let imageCapture = null;

async function startCamera() {
  try {
    // Try strict back camera first
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { exact: "environment" } }
    });
  } catch (err) {
    console.warn("Back camera not found, falling back to any camera:", err);

    // Fallback to any camera (front or back)
    stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });
  }

  video.srcObject = stream;

  const track = stream.getVideoTracks()[0];
  if ('ImageCapture' in window) {
    imageCapture = new ImageCapture(track);
  }

  captureBtn.disabled = false;
  captureBtn.style.display = 'block';
}


captureBtn.addEventListener('click', () => {
  if (imageCapture) {
    // Use ImageCapture API to take photo
    imageCapture.takePhoto()
      .then(blob => {
        const imgUrl = URL.createObjectURL(blob);
        photo.src = imgUrl;
        photo.style.display = 'block';

        video.style.display = 'none';
        captureBtn.disabled = true;
        captureBtn.style.display = 'none';

        stopCamera();
      })
      .catch(err => {
        console.error('ImageCapture failed, falling back to canvas:', err);
        captureWithCanvas();
      });
  } else {
    // Fallback to canvas capture
    captureWithCanvas();
  }
});

function captureWithCanvas() {
  const context = canvas.getContext('2d');

  // Draw current video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to data URL and show
  const imageDataURL = canvas.toDataURL('image/jpeg');
  photo.src = imageDataURL;
  photo.style.display = 'block';

  video.style.display = 'none';
  captureBtn.disabled = true;
  captureBtn.style.display = 'none';

  stopCamera();
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

// Start camera on page load
startCamera();
