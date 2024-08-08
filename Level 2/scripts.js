document.addEventListener("DOMContentLoaded", function() {
  let arrows = [];
  let screenDimensions = [fractionAspectRatio().width, fractionAspectRatio().height];
  let positions = [];
  let imgDimensions = [calculateImageDimensions().widthImages, calculateImageDimensions().heightImages];


  class Arrow {
    constructor(posX, posY, PointsTo = null, tilt, arrowDOM = null){
      this.posX = posX;
      this.posY = posY;
      this.next = PointsTo;
      this.tilt = tilt; 
      this.arrowDOM = arrowDOM;
    }
  }

  function fractionAspectRatio() {
    const divisor = gcd(screen.availHeight, screen.availWidth);
    const width = screen.availWidth / divisor;
    const height = screen.availHeight / divisor;
    return {width, height}; 
  }

  function calculateImageHeightWidth() {
    const minElements = 40;
    const maxElements = 80;
    const maxRatio = 1.05;
    const minRatio = .95;
    const {width, height} = fractionAspectRatio();
    let   {widthImages, heightImages} = 0;  
    let correctRatio = false;

    for (let i = 0; correctRatio == false; i++) {
      widthImages = screen.availWidth/width;
      heightImages = screen.availHeight/height;
      if (maxRatio > widthImages/heightImages > minRatio && minElements < width*height < maxElements) {
        correctRatio = true;
      }
    }

    return { width, height };
  }
  
  function makePositions() {
    for (let x = 0; x < calculateImageHeightWidth()[0]; x++) {
      for (let y = 0; y < calculateImageHeightWidth()[1]; y++) {
        positions.push({ x: x, y: y });
      }
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffleArray(positions);
  }

  function generateArrows() {
    makePositions();
    for (let i = 0; i < positions.length; i++) {
      let arrowDOM = document.createElement("img")
      arrowDOM.classList.add('arrow');
      arrowDOM.style.left = `${imgDimensions[0] * positions[i].x}px`;
      arrowDOM.style.top = `${imgDimensions[1] * positions[i].y}px`;
      arrowDOM.src = "../Image_Assets/arrow.png";
      arrowDOM.style.width = `${imgDimensions[0]}`;
      arrowDOM.style.height = `${imgDimensions[1]}`;
      document.body.appendChild(arrowDOM);
      // if (arrows.length == 0) {
        arrows.push(new Arrow(X=positions[i].x, Y=positions[i].y, arrowDOM=arrowDOM));
      // } else {
        
      // }
      
      
    }

  }
  
  console.log(positions.length)
  generateArrows();
});