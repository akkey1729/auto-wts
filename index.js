let jsFrame = new JSFrame();

let runButton = document.getElementById("run");

let saveButton = document.getElementById("save");
let loadButton = document.getElementById("load");

runButton.addEventListener("click", function(e) {
    jsFrame.showToast({
        html: "Process Started",
        align: "top",
        duration: 2000
    });

    runButton.disabled = true;

    let token = document.getElementById("token").value;
    let channels = document.getElementById("channels").value.split("\n");
    let content = document.getElementById("content").value;

    sendWts(token, channels, content);
});

saveButton.addEventListener("click", function(e) {
    let token = document.getElementById("token").value;
    let channels = document.getElementById("channels").value.split("\n");
    let content = document.getElementById("content").value;

    localStorage.setItem("token", token);
    localStorage.setItem("channels", channels);
    localStorage.setItem("content", content);

    jsFrame.showToast({
        html: "Saved to Storage",
        align: "top",
        duration: 2000
    });
});

loadButton.addEventListener("click", function(e) {
    let token = localStorage.getItem("token");
    let channels = localStorage.getItem("channels");
    let content = localStorage.getItem("content");

    if(token === null) {
        jsFrame.showToast({
            html: "Failed to Load",
            align: "top",
            duration: 2000
        });
        return;
    }

    document.getElementById("token").value = token;
    document.getElementById("channels").value = channels.replaceAll(",", "\n");
    document.getElementById("content").value = content.replaceAll(",", "\n");;

    jsFrame.showToast({
        html: "Loaded",
        align: "top",
        duration: 2000
    });
});

function sendWts(token, channels, content) {
    let channel = channels[0];

    let xhr = new XMLHttpRequest();
    
    xhr.open("POST", `https://discord.com/api/v9/channels/${channel}/messages`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", token);

    xhr.onload = function(e) {
        setTimeout(function() {
            sendWtsCallback(token, channels, content);
        }, 2000);
    }

    xhr.send(JSON.stringify({content: content}));
}

function sendWtsCallback(token, channels, content) {
    let newChannelsArray = channels.splice(1, 9999);
    if(newChannelsArray.length === 0) {
        jsFrame.showToast({
            html: "Process Ended",
            align: "top",
            duration: 2000
        });

        runButton.disabled = false;
        return;
    }

    sendWts(token, newChannelsArray, content);
}