const APP_ID = "3409257b9d6e4370865958775de8e35e";

// Define a channel name 
const CHANNEL = "church-live-stream";

const client = AgoraRTC.createClient({
    mode: "live", // Use live mode for live streaming
    codec: "vp8"  // Choose a codec; "vp8" or "h264"
});

// DOM Elements
const localVideo = document.getElementById("localVideo");
const remoteStreamsContainer = document.getElementById("remote-streams");

// Function to initialize the local stream and join the channel
async function startStreaming() {
    try {
        // Join the channel; the third parameter (UID) is set to null, allowing Agora to auto-assign a UID
        await client.join(APP_ID, CHANNEL, null, null); // Both the token and UID can be null
    } catch (error) {
        console.error("Error during stream setup: ", error);
    }
}


// Handle when a remote user leaves
client.on("user-left", (user) => {
    const remoteVideo = document.getElementById(`remote_video_${user.uid}`);
    if (remoteVideo) remoteVideo.remove();
});

// Start the streaming process
startStreaming();