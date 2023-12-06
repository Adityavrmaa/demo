const videoPreview = document.querySelector("#video-preview");
const screenshot = document.querySelector("#screenshot");
const buttonScreenshot = document.querySelector("#button-screenshot");
const buttonDownload = document.querySelector("#button-download");

let videoStream;

disabledButtons(true);

function startCam() {
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const constraints = {
        video: {},
    };

    if (isMobile) {
        // For mobile devices, use the back camera
        constraints.video.facingMode = { exact: "environment" };
    } else {
        // For desktop, allow user to choose a camera
        constraints.video.facingMode = "user";
    }

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(async (stream) => {
            videoStream = stream;
            videoPreview.srcObject = stream;
            disabledButtons(false);

            buttonScreenshot.addEventListener("click", async () =>
                takeScreenshot(videoStream));

            buttonDownload.addEventListener("click", async () =>
                startDownload(videoStream));
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
            disabledButtons(true);
        });
}

function stopCam() {
    if (videoStream) {
        // Stop all tracks in the stream
        videoStream.getTracks().forEach(track => track.stop());
        videoPreview.srcObject = null; // Remove the video source
        disabledButtons(true);
    }
}

async function getImageBlob(videoStream) {
    const track = videoStream.getVideoTracks()[0];
    const imageBlob = await new ImageCapture(track).takePhoto();
    return imageBlob;
}

async function takeScreenshot(videoStream) {
    screenshot.src = URL.createObjectURL(await getImageBlob(videoStream));
}

async function startDownload(videoStream) {
    const imageURL = URL.createObjectURL(await getImageBlob(videoStream));
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = `screenshot-${new Date().toLocaleTimeString()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function disabledButtons(state) {
    buttonDownload.disabled = state;
    buttonScreenshot.disabled = state;
}

// Example: Call startCam when a button is clicked
document.querySelector("#start-button").addEventListener("click", startCam);

// Example: Call stopCam when a button is clicked
document.querySelector("#stop-button").addEventListener("click", stopCam);
