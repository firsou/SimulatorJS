//Block of constants used to name classes of HTML elements created, if change needed change the constant's value

const processDivClassName = "processes";
const frameDivClassName = "frame";
const frameTitleClassName = "frameTitle";
const lifelines = "lifeLine";
const arrowDivClassNameL2R = "arrowLtoR";
const arrowDivClassNameR2L = "arrowRtoL";
const messageDivClassName = "messages";
//const activatorClassName = "activator";

var scrollBoolean = true;

var animator = JSON.parse(localStorage.getItem('stringJSON'));
var mainDiv = document.getElementById("outputJSON");
var llHeight = 100;

window.onload = function animateJSON() {

    //Selects the processes array in JSON File and iterates for every element

    for (var i = 0; i < animator.processes.length; i++) {

        createObject(animator, i);

        //Similar behavior as in the previous block, but this time the lifelines are given a unique ID, are appended to the <div> created in the previous block
        //and the activators are appended to the lifeline divs.

        createLifeline(animator, i);

        // var activatorDiv = document.createElement("div");
        // activatorDiv.className = activatorClassName;
        // lifeLineDiv.appendChild(activatorDiv);
    }
    var animatorDiagramArray = Object.keys(animator.diagram); //In order to check whether or not the JSON element is a node, we must select the diagram object's keys.
    //if (animatorDiagramArray.hasOwnProperty('node'))
    for (var i = 0; i < animatorDiagramArray.length; i++) {   //loop through the array of Keys created above
        if (animatorDiagramArray[i] === 'node') {             //we check wether the JSON element is a node here
             frameDiv = document.createElement("div");
            frameDiv.className = frameDivClassName;
            frameDiv.id = animator.diagram.node.toString();
            mainDiv.appendChild(frameDiv);

            var frameTitle = document.createElement("div");
            frameTitle.className = frameTitleClassName;
            frameTitle.id = animator.diagram.node.toString() + "Title";
            frameTitle.innerHTML = animator.diagram.node.toString();
            frameDiv.appendChild(frameTitle);
        }
    }

    createArrow(animator, 0, 0, frameDiv, mainDiv);
    
    createLog(animator, 0, 0, 0);
    pageScroll();
    //logScroll();

};

/*
* This function creates arrows based on the direction of the arrow by using the functions arrowL2R and arrowR2L.
* It checks the start and end position of each arrow in the content of the diagram section provided in the JSON file.
* The function is set to a timeout in order to generate the arrows one by one with a timeout of one second.
 */

function createArrow(animator, j, i, mainDiv) {


    // Lifeline height
    var LifeLinesArray = document.querySelectorAll('.lifeLine');
    llHeight = llHeight + 65;
    for (var k=0; k < LifeLinesArray.length; k++) {
        LifeLinesArray[k].style.height = (llHeight + "px");
    }


    // resets the i and increment j as for loop inside a for loop  to get all messages.
    if (animator.diagram.content[j].content.length === i) {

        i = 0;
        j++;

        var lineBreak = document.createElement('hr');

        if (frameDiv != undefined) {
            frameDiv.appendChild(lineBreak);

            // Lifeline height
            var LifeLinesArray = document.querySelectorAll('.lifeLine');
            llHeight = llHeight + 65;
            for (var k=0; k < LifeLinesArray.length; k++) {
                LifeLinesArray[k].style.height = (llHeight + "px");
            }
        }
    }


    var startPosition = getPosition(document.querySelector("#" + animator.diagram.content[j].content[i].from.toString()));
    var endPosition = getPosition(document.querySelector("#" + animator.diagram.content[j].content[i].to.toString()));


    // decides what direction the arrow will go, and makes the length of the arrows

    if (startPosition.x > endPosition.x) {

        arrowR2L(startPosition, endPosition, j, i);
    }
    else {

        arrowL2R(startPosition, endPosition, j, i);
    }
    
    // base case of the recursive loop

    if (animator.diagram.content[j].content[i + 1] === undefined && j + 1 === animator.diagram.content.length) {}

    // the recursive call of the loop and the incrementing of var i

    else {
        setTimeout(function () {
            i++;
            createArrow(animator, j, i, mainDiv);
        }, 1000);
    }
}


function createLog(animator, i, e, total) {
    var ul = document.getElementById("logList");

    // resets the i and increment e as for loop inside a for loop to get all messages.
    
    if (animator.diagram.content[e].content.length === i) {
        i = 0;
        e++;
    }

    var li = document.createElement("li");
    li.setAttribute('id', ((total + 1) + ": Sending message From: " +
        animator.diagram.content[e].content[i].from.toString() + " To: " +
        animator.diagram.content[e].content[i].to.toString() + " || Message: " +
        animator.diagram.content[e].content[i].message.toString()));
    li.appendChild(document.createTextNode((total + 1) + ": Sending message From: " +
        animator.diagram.content[e].content[i].from.toString() + " To: " +
        animator.diagram.content[e].content[i].to.toString() + " || Message: " +
        animator.diagram.content[e].content[i].message.toString()));
    ul.appendChild(li);

    if (animator.diagram.content.length > e) {

        // base case of the recursive loop

        if (animator.diagram.content[e].content[i + 1] === undefined && e + 1 === animator.diagram.content.length) {
            scrollBoolean = false;
        }

        // the recursive call of the loop and the incrementing of var i

        else {
            setTimeout(function () {
                i++;
                total++;
                createLog(animator, i, e, total);
            }, 1000);
        }
        
    }

}

/*
 * This function generates an arrow with the specific direction of left to right. It also generates the div related to
 * the message that each arrow carries. As stated in the function, arrows are children of frameDiv.
 */

function arrowL2R(from, to, j, i) {

    var arrow = document.createElement("div");
    var svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    var message = document.createElement("div");

    arrow.className = arrowDivClassNameL2R;
    var arrowLengthL2R = to.x - from.x;
    arrow.style.maxWidth = arrowLengthL2R + 'px';


    svg.setAttribute("preserveAspectRatio", "xMaxYMid slice");
    svg.setAttribute("viewBox", "0 0 1400 14");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "14");
    polygon.setAttribute("points", "1400,7 1385,1 1390,6 0,6 0,8 1390,8 1385,13 1400,7");

    arrow.style.left = from.x - 30 + 'px';

    message.className = messageDivClassName;
    message.innerHTML = animator.diagram.content[j].content[i].message.toString();

    arrow.appendChild(message);
    svg.appendChild(polygon);
    arrow.appendChild(svg);

    if (frameDiv === undefined) {
        mainDiv.appendChild(arrow);
    }
    else {
        frameDiv.appendChild(arrow);
    }

}

/*
 * This function generates an arrow with the specific direction of right to left. It also generates the div related to
 * the message that each arrow carries. As stated in the function, arrows are children of frameDiv.
 */

function arrowR2L(from, to, j, i) {

    var arrow = document.createElement("div");
    var svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    var message = document.createElement("div");

    arrow.className = arrowDivClassNameR2L;
    var arrowLengthR2L = from.x - to.x;
    arrow.style.maxWidth = arrowLengthR2L + 'px';

    svg.setAttribute("preserveAspectRatio", "xMinYMid slice");
    svg.setAttribute("viewBox", "0 0 1400 14");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "14");
    polygon.setAttribute("points", "0,7 15,1 10,6 1400,6 1400,8 10,8 15,13 0,7");

    arrow.style.left =  to.x - 30 + 'px';

    message.className = messageDivClassName;
    message.innerHTML = animator.diagram.content[j].content[i].message.toString();

    arrow.appendChild(message);
    svg.appendChild(polygon);
    arrow.appendChild(svg);

    if (frameDiv === undefined) {
        mainDiv.appendChild(arrow);
    }
    else {
        frameDiv.appendChild(arrow);
    }
}


/*
 * Helper function that gets an arrow's exact position by using its dedicated id
 */

function getPosition(el) {
    var xPos = 0;
    var yPos = 0;
    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            var yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            // for all other non-BODY elements
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
}

/*
 * This function creates an object (process) in the SSD diagram from the list of processes in the JSON file provided.
 */

function createObject(animator, i) {

    div = document.createElement("div");            //Creates an HTML <div> element
    div.className = processDivClassName;                //assigns it a class
    div.innerHTML =
        animator.processes[i].name.toString() + ": " +  //Gives it a text output as specified in the JSON file, here the class and name of the object
        animator.processes[i].class.toString();         //here it is the class and name of the SSD object
    mainDiv.appendChild(div);                           //Places the new <div> element under the mainDiv, as specified in the variable declaration in l.4


}

/*
 * This function creates the lifeline related to each object (process) in the SSD diagram. It also assigns an id to
 * each lifeline including the name of its object's name. This id is used later in locating the start and end position
 * of the arrows.
 */

function createLifeline(animator, i) {

    var lifeLineDiv = document.createElement("div");
    lifeLineDiv.className = lifelines;
    lifeLineDiv.id = animator.processes[i].name.toString();
    div.appendChild(lifeLineDiv);

}

    // Get a reference to the div you want to auto-scroll.
    var mainDivElement = document.querySelector("#outputJSON");
    // Create an observer and pass it a callback.
    var observer = new MutationObserver(scrollToBottom);
    // Tell it to look for new children that will change the height.
    var config = {attributes:true,characterData:true,childList: true,attributeFilter: ["id"]};
    observer.observe(mainDivElement, config);
    // later, you can stop observing
    //observer.disconnect();



// First, define a helper function.
function animateScroll(duration) {
    var start = mainDivElement.scrollTop;
    var end = mainDivElement.scrollHeight;
    var change = end - start;
    var increment = 15;
    function easeInOut(currentTime, start, change, duration) {
      // by Robert Penner  Easing Functions
      currentTime /= duration / 2;
      if (currentTime < 1) {
        return change / 2 * currentTime * currentTime + start;
      }
      currentTime -= 1;
      return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }

    function animate(elapsedTime) {
      elapsedTime += increment;
      var position = easeInOut(elapsedTime, start, change, duration);
      mainDivElement.scrollTop = position;
      if (elapsedTime < duration) {
        setTimeout(function() {
          animate(elapsedTime);
        }, increment)
      }
    }
    animate(0);
  }
  
  // Here's our main callback function we passed to the observer
  function scrollToBottom() {
    // TODO change so the duration isn't hardcoded
    var duration = 11600 // Or however many milliseconds you want to scroll to last
    //animateScroll(duration);
  }

  var counterScroll = 200;
  var lastScroll = 0;
  function pageScroll() {
    
    var clientHeight = document.getElementById('outputJSON').scrollHeight;
    
        //checks if it should continue scrolling or not
        //if (clientHeight  > counterScroll ) {
            console.log(scrollBoolean);
        if(scrollBoolean || lastScroll == 0){
            if(!scrollBoolean){
                lastScroll++;
            }
            //Scrolls to the bottom of the outputJSON page
            mainDiv.scrollBy(0,document.getElementById('outputJSON').scrollHeight); // horizontal and vertical scroll increments
            log.scrollBy(0,document.getElementById('log').scrollHeight);
            //incrementing the counter 
            counterScroll = counterScroll + 65;
            setTimeout(function() {
            pageScroll();
        },1000); // scrolls every 1000 milliseconds
    }
}

function logScroll() {
    
    var clientHeight = document.getElementById('log').scrollHeight;
    
        //checks if it should continue scrolling or not
        if (clientHeight  > counterScroll ) {
        
            //Scrolls to the bottom of the outputJSON page
            mainDiv.scrollBy(0,document.getElementById('log').scrollHeight); // horizontal and vertical scroll increments
            //incrementing the counter 
            counterScroll = counterScroll + 65;
            setTimeout(function() {
            pageScroll();
        },1000); // scrolls every 1000 milliseconds
    }
}