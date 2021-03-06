var fileInput = document.getElementById('JSONFile');
window.onload = function() {
    var button = document.getElementById('submitbutton');
    var message = document.getElementById('error');
    var regTypesAllowed =  /(.*?)\.(json|JSON)$/;
    var textVersion = [];
    var jsonVersion = [];
    // message.style.opacity = 0;

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            // If there are 3 files
            if(fileInput.files.length > 2){
                // Check so the files are allowed
                if(fileInput.files[0].name.match(regTypesAllowed) &&
                    fileInput.files[1].name.match(regTypesAllowed) &&
                    fileInput.files[2].name.match(regTypesAllowed)) {

                    button.disabled = false;
                    message.style.opacity = 0;

                    setupReader(fileInput.files, 0, textVersion, jsonVersion);
                }
                // If not allowed
                else{
                    button.disabled = true;
                    message.style.opacity = 100;
                }
            }

            // If there are 2 files
            else if(fileInput.files.length > 1){
                // Check so the files are allowed - then text and parse them
                if(fileInput.files[0].name.match(regTypesAllowed) &&
                    fileInput.files[1].name.match(regTypesAllowed)){

                    button.disabled = false;
                    message.style.opacity = 0;

                    setupReader(fileInput.files, 0, textVersion, jsonVersion);
                }
                // If not allowed
                else{
                    button.disabled = true;
                    message.style.opacity = 100;
                }
            }
            // If there is only 1 file
            else{
                // Check so the file is allowed
                if (fileInput.files[0].name.match(regTypesAllowed)){
                    button.disabled = false;
                    message.style.opacity = 0;

                    setupReader(fileInput.files, 0, textVersion, jsonVersion);
                }
                else{
                    button.disabled = true;
                    message.style.opacity = 100;
                }
            }
        });
    }
};

function setupReader(files, i, textVersion, jsonVersion) {
    var file = files[i];
    var reader = new FileReader();
    reader.onload = function(e){
        // Once done reading - call loaded
        readerLoaded(e, files, textVersion, jsonVersion, i);
    };
    reader.readAsText(file);
}
function readerLoaded(e, files, textVersion, jsonVersion, i) {
    // Get the file content as text
    textVersion[i] = e.target.result;
    // Parse it and put in JSON array
    jsonVersion[i] = JSON.parse(textVersion[i]);

    // If there's a file left to load
    if (i < files.length - 1) {
        // Load the next file
        setupReader(files, i+1, textVersion, jsonVersion);
    }
    // If not, everything is done
    else{
        console.log("Done reading " + (i+1) + " files");
        compareAndAdd(textVersion, jsonVersion);
    }
}
function compareAndAdd(textVersion, jsonVersion) {
    var button = document.getElementById('submitbutton');
    var message = document.getElementById('error');
    // If there are 3 files
    if(textVersion.length > 2){
        // If any of the 3 diagrams are of the same type, deny user
        if(jsonVersion[0].type === jsonVersion[1].type || jsonVersion[1].type === jsonVersion[2].type || jsonVersion[0].type === jsonVersion[2].type){
            console.log("Same type. No no no...");
            button.disabled = true;
            message.style.opacity = 100;
        }
        // If not, add to storage
        else{
            button.disabled = false;
            message.style.opacity = 0;
            addToStorage(textVersion, jsonVersion);
        }
    }
    // If there are 2 files
    else if(textVersion.length > 1){
        // If both diagram are of the same type, deny user
        if(jsonVersion[0].type === jsonVersion[1].type){
            console.log("Same type. No no no...");
            button.disabled = true;
            message.style.opacity = 100;
        }
        // If not, add to storage
        else{
            button.disabled = false;
            message.style.opacity = 0;
            addToStorage(textVersion, jsonVersion);
        }
    }
    // If there is only one file, just add it.
    else{
        button.disabled = false;
        message.style.opacity = 0;
        addToStorage(textVersion, jsonVersion);
    }
}
function addToStorage(textVersion, jsonVersion) {
    // Clear local storage first.
    localStorage.clear();
    // Then iterate through the array to add all files
    for(var n = 0; n < jsonVersion.length; n++) {
        switch (jsonVersion[n].type) {
            case 'sequence_diagram':
                console.log("Added SD");
                localStorage.setItem('SD', textVersion[n]);
                break;
            case 'class_diagram':
                console.log("Added CD");
                localStorage.setItem('CD', textVersion[n]);
                break;
            case 'deployment_diagram':
                console.log("Added DD");
                localStorage.setItem('DD', textVersion[n]);
                break;
            default:
                alert("No Diagram Found");
        }
    }
}
var selDiv = "";
document.addEventListener("DOMContentLoaded", init, false);  //event is fired when the initial HTML document has been completely loaded and parsed

function init() {
	fileInput.addEventListener("change", handleFileSelect, false);
	selDiv = document.querySelector("#selectedFiles");
}
function handleFileSelect(e) {

	if (!e.target.files) return;

	selDiv.innerHTML = ""; //sets the HTML content (inner HTML) of an element.

	var files = e.target.files;
    
	//goes through a list of selected jsons and saves and appends to the div html
	for (var i = 0; i < files.length ; i++) {
		var selectedJson;
		if (this.files.length < 4){
			selectedJson = files[i];
		}
		else {
            document.getElementById("JSONFile").value = null; //..clears the input file
            alert("Maximum of 3 files allowed");

		}
		selDiv.innerHTML += selectedJson.name + "<br/>"; //returns the HTML content (inner HTML) of an element.

	}
}