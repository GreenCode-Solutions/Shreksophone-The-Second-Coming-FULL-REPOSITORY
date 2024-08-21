document.addEventListener("DOMContentLoaded", function() {
  console.log(localStorage.getItem("arrowsPass"))
  if (completed("arrows")) {
    window.location = "../index.html";
  }

  function completed(key) {
    if (localStorage.getItem(key + "Completed") == "true") {
      return true;
    } 
    return false;
  }

  let arrows = [];
  let screenDimensions = [optimalGridSize().width, optimalGridSize().height];
  let pointsTo = [];
  let selectedStart = [];
  let positions = [];
  const imgDimensions = [calculateImageDimensions().widthImages, calculateImageDimensions().heightImages];
  
  window.arrowsPass = decryptPass(localStorage.getItem("arrowsPass"));

  function findFinalArrow() {
    for (let i = 0; i < arrows.length; i++) {
      if (arrows[i].next.x == selectedStart.x && arrows[i].next.y == selectedStart.y) {
         var finalArrow = arrows[i].position;
         //return finalArrow
        console.log('Final Arrow:', finalArrow);
      }
      console.log("Arrow iteration:", i);
    }
    return finalArrow; // Ensure finalArrow is returned if needed elsewhere
  }

  function decryptPass(pass) {
    pass = pass.split("");
    strpass = "";
    for (let i = 0; i < pass.length; i++) {
      pass.splice(i, 1);
    }
    for (let i = 0; i < pass.length; i++) {
      strpass += pass[i];
    }
    return strpass;
  }

  class Arrow {
    constructor(position = {x:x, y:y}, PointsTo = {x:x, y:y}, arrowDOM = null) {
      this.position = position;
      this.next = PointsTo;
      this.arrowDOM = arrowDOM;
    }

    compileTilt() {
      let tiltRad = Math.atan((this.position.x - this.next.x) / (this.position.y - this.next.y));
      let tiltDeg = tiltRad * (180 / Math.PI);
      if ((this.position.y - this.next.y) < 0) {
        tiltDeg -=180;
      }
      return -tiltDeg;
    }

    onClick() {
      
      let finalArrow = findFinalArrow();
      if (pointsTo.length == 0) {
        selectedStart = this.position;
        pointsTo = this.next;
        this.arrowDOM.style.filter = "drop-shadow(0 0 0.75rem black)";
        this.arrowDOM.src = "../Image_Assets/arrowGreen.png";
        return;
      }
      
      if (this.position == finalArrow) {
        endscreen();
      }

      if (this.position != pointsTo) {
        resetArrows();
        return;
      }
      
      pointsTo = this.next;
      
      this.arrowDOM.style.filter = "drop-shadow(0 0 .75rem black)";
      this.arrowDOM.src = "../Image_Assets/arrowGreen.png";
      this.arrowDOM.style.zIndex = "4";
    }

  }

  function removeElement(ele) {
    ele.parentNode.removeChild(ele);
  }

  function deleteArrows() {
    for (let i = 0; i < arrows.length; i++) {
      removeElement(arrows[i].arrowDOM);
    }
  }

  function resetArrows() {
    deleteArrows();
    arrows = [];
    pointsTo = [];
    selectedStart = [];
    positions = [];
    generateArrows();
  }

  function endscreen() {
    deleteArrows();
    document.body.style.background = "black";
    let passwordElement = document.createElement("h1");
    let passwordNode = document.createTextNode(`${window.arrowsPass}`);
    passwordElement.appendChild(passwordNode);
    document.body.appendChild(passwordElement);

    setInterval(() => {
      if (document.body.style.backgroundColor === 'black') {
        document.body.style.backgroundColor = 'green';
      } else {
        document.body.style.backgroundColor = 'black';
      }
    }, 1500);
    setTimeout(() => {
      window.location = "../index.html";
    }, 8900 );
  }

  function optimalGridSize() {
    let bestFit = { width: 1, height: 1 };
    let bestImageRatio = Infinity;

    const maxImages = 10; //70
    const minImages = 5; //50

    for (let cols = 1; cols <= 10000 ; cols++) {
      let rows = Math.round(cols * (window.innerHeight / window.innerWidth));
      let arrowCount = cols * rows;

      if (arrowCount >= minImages && arrowCount <= maxImages) {
        let imageRatio = (window.innerWidth / cols) / (window.innerWidth / rows);


        if (Math.abs(1 - imageRatio) < bestImageRatio) {
          bestImageRatio = imageRatio;
          bestFit = { width: cols, height: rows };
        }
      }
    }

    return bestFit;
  }

  function calculateImageDimensions() { 
    let widthImages = window.innerWidth / screenDimensions[0];
    let heightImages = window.innerHeight / screenDimensions[1];
    return { widthImages, heightImages };
  }
  
  function makePositions() {
    for (let x = 0; x < screenDimensions[0]; x++) {
      for (let y = 0; y < screenDimensions[1]; y++) {
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
      let arrowDOM = document.createElement("img"); // switch to a p element for debug mode
      arrowDOM.classList.add('arrow');
      arrowDOM.style.left = `${imgDimensions[0] * positions[i].x}px`;
      arrowDOM.style.top = `${imgDimensions[1] * positions[i].y}px`;
      
      
      arrowDOM.src = "../Image_Assets/arrow.png";
      arrowDOM.style.width = `${imgDimensions[0]}px`;
      arrowDOM.style.height = `${imgDimensions[1]}px`;
      document.body.appendChild(arrowDOM);

      let nextPosition;
      if (i == positions.length - 1) {
        nextPosition = positions[0];
      } else {
        nextPosition = positions[i + 1];
      }

      let arrow = new Arrow(positions[i], nextPosition, arrowDOM);
      arrowDOM.style.transform = `rotate(${arrow.compileTilt()}deg)`;
      let node = document.createTextNode(`Position: ${positions[i].x}, ${positions[i].y}\n
        PointsTo: ${nextPosition.x}, ${nextPosition.y} \n
        Degrees: ${Math.round(arrow.compileTilt() * 100) / 100} \n
        slope: ${positions[i].y - nextPosition.y} / ${positions[i].x - nextPosition.x}`);

      arrowDOM.addEventListener('click', () => arrow.onClick());
      arrow.arrowDOM.appendChild(node);
      arrows.push(arrow);
    }
  }
  
  
  console.log(window.arrowsPass);
  generateArrows();
});
