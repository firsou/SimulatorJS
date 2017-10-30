window.onload = function animateJSON() {
    
    var animator = JSON.parse(localStorage.getItem('stringJSON')    );
    var mainDiv = document.getElementById("outputJSON");

    const processDivClassName = "processes";
    const frameDivClassName = "frame"
    const frameTitleClassName = "frameTitle"
    const lifelines = "lifeLine";
    const activatorClassName = "activator"
    const arrowDivClassName = "arrows";
    const messageDivClassName = "messages";

    for(var i = 0; i < animator.processes.length; i++) {

        var div = document.createElement("div");
        div.className = processDivClassName;
        div.innerHTML =
            animator.processes[i].name.toString() + ": " +
            animator.processes[i].class.toString();
        mainDiv.appendChild(div);

        var lifeLineDiv = document.createElement("div");
        lifeLineDiv.className = lifelines;
        lifeLineDiv.id = animator.processes[i].name.toString();
        var activatorDiv = document.createElement("div");
        activatorDiv.className = activatorClassName;
        div.appendChild(lifeLineDiv);
        lifeLineDiv.appendChild(activatorDiv);
    }

    var superArray = Object.keys(animator.diagram);
    for (var i = 0; i < superArray.length; i++) {
        if (superArray[i] === 'node') {
            var frameDiv = document.createElement("div");
            frameDiv.className = frameDivClassName;
            frameDiv.id = animator.diagram.node.toString();
            var frameTitle = document.createElement("div");
            frameTitle.className = frameTitleClassName;
            frameTitle.id = animator.diagram.node.toString() + "Title";
            frameTitle.innerHTML = animator.diagram.node.toString();
            mainDiv.appendChild(frameDiv);
            frameDiv.appendChild(frameTitle);
        }
    }   

    var a = 50;

    for(var j = 0; j < animator.diagram.content.length; j++) {

        for (var i = 0; i < animator.diagram.content[0].content.length; i++) {

            var startPosition = getPosition(document.querySelector("#" + animator.diagram.content[0].content[i].from.toString()));
            var endPosition = getPosition(document.querySelector("#" + animator.diagram.content[0].content[i].to.toString()));

            var arrow = document.createElement("div");
            arrow.className = arrowDivClassName;
            var svg = document.createElementNS('http://www.w3.org/2000/svg', "svg");
            var polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            var message = document.createElement("div");
            message.className = messageDivClassName;
            svg.setAttribute("preserveAspectRatio", "xMaxYMid slice");

            svg.setAttribute("viewBox", "0 0 1400 14");
            // decides what direction the arrow will go, and makes the length of the arrows

            if (startPosition.x > endPosition.x) {

                var arrowLengthLeft = startPosition.x - endPosition.x;
                svg.setAttribute("width", arrowLengthLeft + "px");
                arrow.style.transform = "rotate(180deg)";
                arrow.style.left = startPosition.x - 30 + 'px';
                message.style.left = arrowLengthLeft / 2 + 'px';
                message.style.top = 40 + 'px';
                message.style.transform = "rotate(180deg)";
            }
            else {

                var arrowLengthRight = endPosition.x - startPosition.x;
                svg.setAttribute("width", arrowLengthRight + "px");
                arrow.style.left = startPosition.x - 30 + 'px';
                message.style.left = arrowLengthRight / 2 + 'px';
            }

            svg.setAttribute("height", "14");
            polygon.setAttribute("points", "1400,7 1385,1 1390,6 0,6 0,8 1390,8 1385,13 1400,7");
            arrow.className = arrowDivClassName;

            message.innerHTML =
                animator.diagram.content[0].content[i].message.toString();

            // making so every arrow is on their own line with 50px heigth difference
            arrow.style.top = startPosition.y + i * a - 20 + 'px';
            arrow.style.right = ((startPosition.x) - (startPosition.x - endPosition.x)) + 'px';

            // arrow.innerHTML =
            //     animator.diagram.content[0].content[i].message.toString();

            // arrow.style.position = "absolute";
            // arrow.style.left = document.getElementById(animator.diagram.content[0].content[i].from.toString()).getBoundingClientRect().left.toString() + 'px';
            // arrow.style.right = document.getElementById(animator.diagram.content[0].content[i].from.toString()).getBoundingClientRect().right.toString() + 'px';
            // arrow.style.top = document.getElementById(animator.diagram.content[0].content[i].from.toString()).getBoundingClientRect().top.toString() + 'px';
            // console.log(document.getElementById(animator.diagram.content[0].content[i].from.toString()).getBoundingClientRect().left.toString());


            arrow.appendChild(message);
            svg.appendChild(polygon);
            arrow.appendChild(svg);
            frameDiv.appendChild(arrow);
        }
    }
};

// var arrows = [];
//
// function Arrow(from, to, message) {
//     this.from = from;
//     this.to = to;
//     this.message = message;
// }
//
// function addArrow(from, to, message) {
//     var msg = new Arrow(from, to, message);
//     arrows.push(msg);
// }


// Helper function to get an element's exact position
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