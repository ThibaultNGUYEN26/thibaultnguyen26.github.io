// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  var currentPosition = document.documentElement.scrollTop || document.body.scrollTop;
  if (currentPosition > 0) {
    window.requestAnimationFrame(topFunction);
    window.scrollTo(0, currentPosition - currentPosition / 10);
  }
}


// Function to check if an element is in the viewport
function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle scrolling and add animation class
function handleScroll() {
  var projectDivs = document.querySelectorAll('.projectDivLeft, .projectDivRight, .separator');

  projectDivs.forEach(function (projectDiv) {
    if (isInViewport(projectDiv)) {
      projectDiv.classList.add('visible');
    }
  });
}

// Event listener for scrolling
window.addEventListener('scroll', handleScroll);