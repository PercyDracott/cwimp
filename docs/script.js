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

  const cameraInput = document.getElementById('cameraInput');
  const openCameraBtn = document.getElementById('openCameraBtn');
  const photo = document.getElementById('photo');
  
  openCameraBtn.addEventListener('click', () => {
    openCameraBtn.classList.remove("pulse");
    void openCameraBtn.offsetWidth; // Force reflow
    openCameraBtn.classList.add("pulse");
    
    setTimeout(() => {
      cameraInput.click(); 
    }, 300);
  });
  
  cameraInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const imgURL = URL.createObjectURL(file);
    photo.src = imgURL;
    photo.style.display = 'block';
  
    // Optionally, hide the button after photo is taken
    openCameraBtn.style.display = 'none';
  });
  
