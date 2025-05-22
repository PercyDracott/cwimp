const logo = document.getElementById('logo');

  document.querySelector('.image-button').addEventListener('click', () => {
    const img = document.querySelector('.btn-image');
  
    img.classList.add('pulse');
  
    // Remove pulse after animation ends so it can be reused
    img.addEventListener('animationend', () => {
      img.classList.remove('pulse');
    }, { once: true });
  });
  

  function newButtonPressed()
  {
    logo.classList.toggle('animation');
    setTimeout(function() {
      window.location.href = 'cameraPage.html'; // Change this to your actual page
    }, 300);
  }