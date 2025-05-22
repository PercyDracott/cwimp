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

  // Start the camera
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { exact: "environment" } }  // Force back camera
  })
  .then(mediaStream => {
    stream = mediaStream;
    video.srcObject = stream;
    captureBtn.disabled = false;
    captureBtn.style.display = 'block'; // Fix: should be .style.display
  })
  .catch(err => {
    console.error("Camera access error:", err);
  });

  // Capture photo and stop camera
  captureBtn.addEventListener('click', () => {
    // Draw the current frame to the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image as Base64 JPG
    const imageDataURL = canvas.toDataURL('image/jpeg');

    // Show the captured image
    photo.src = imageDataURL;
    photo.style.display = 'block';

    // Hide the video feed
    video.style.display = 'none';
    
    setTimeout(function() {
      captureBtn.disabled = true;
      captureBtn.style.display = 'none';  
    }, 300);

    // Stop the camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  });