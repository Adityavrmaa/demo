const videoPreview = document.querySelector("#video-preview");
const screenshot = document.querySelector("#screenshot");
const buttonScreenshot = document.querySelector("#button-screenshot");
const buttonDownload = document.querySelector("#button-download");

let videoStream;

disabledButtons(true);

async function startCam() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const constraints = {
        video: {
            facingMode: isMobile ? "environment" : "user",
        },
    };

    try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        videoPreview.srcObject = videoStream;
        disabledButtons(false);

        buttonScreenshot.addEventListener("click", () => takeScreenshot());
        buttonDownload.addEventListener("click", () => startDownload());
    } catch (error) {
        console.error('Error accessing webcam:', error);
        disabledButtons(true);
    }
}

function stopCam() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoPreview.srcObject = null;
        disabledButtons(true);
    }
}

async function takeScreenshot() {
    if (videoStream) {
        const track = videoStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        try {
            const imageBlob = await imageCapture.takePhoto();
            screenshot.src = URL.createObjectURL(imageBlob);
        } catch (error) {
            console.error('Error taking photo:', error);
        }
    }
}

async function startDownload() {
    if (videoStream) {
        const track = videoStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        try {
            const imageBlob = await imageCapture.takePhoto();
            const imageURL = URL.createObjectURL(imageBlob);
            const link = document.createElement("a");
            link.href = imageURL;
            link.download = `screenshot-${new Date().toLocaleTimeString()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error taking photo for download:', error);
        }
    }
}

function disabledButtons(state) {
    buttonDownload.disabled = state;
    buttonScreenshot.disabled = state;
}

document.querySelector("#start-button").addEventListener("click", startCam);
document.querySelector("#stop-button").addEventListener("click", stopCam);
