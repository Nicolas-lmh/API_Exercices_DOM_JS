// Execute an AJAX GET request
// First argument is URL's target, second is a callback function in case of success
function ajaxGet(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            // Means the success of the request, applies the callback function to the response
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Network error on the following url: " + url);
    });
    req.send(null);
}

// Execute an AJAX POST request
// Second argument data is a javascript object
// isJson argument is a true or false value which means if data argmuent is a JSON object
function ajaxPost(url, data, callback, isJson) {
    var req = new XMLHttpRequest();
    req.open("POST", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Network error on the following url: " + url);
    });
    if (isJson) {
        // Define the request à a JSON one
        req.setRequestHeader("Content-Type", "application/json");
        // Convert JSON data as a string before its sending
        data = JSON.stringify(data);
    }
    req.send(data);
}
