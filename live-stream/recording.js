// recording.js - Local Recording

const localVideo = document.getElementById("localVideo"); // Assuming it's the same local video element
let mediaRecorder;
let recordedChunks = [];

// Function to start local recording
function startLocalRecording() {
    // Capture the local video stream
    console.log("Clicked to start local recording");
    const stream = localVideo.captureStream();
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);

        // Create download link for the recorded video
        const a = document.createElement('a');
        a.href = url;
        a.download = 'local-recording.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        console.log("Recording saved locally.");
    };

    mediaRecorder.start();
    console.log("Recording started.");
}

// Function to stop the recording manually
function stopLocalRecording() {
    console.log("Clicked to stop local recording");
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("Recording stopped.");
    }
}

// Start recording by calling startLocalRecording()
document.getElementById("start-recording").addEventListener("click", startLocalRecording);
document.getElementById("stop-recording").addEventListener("click", stopLocalRecording);
