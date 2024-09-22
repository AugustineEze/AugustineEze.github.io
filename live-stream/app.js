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
        const uid = await client.join(APP_ID, CHANNEL, null, null); // Both the token and UID can be null
        console.log(`User ${uid} joined the channel: ${CHANNEL}`);

        // If the user is broadcasting (priest), change the role to "host" (broadcaster)
        const isBroadcaster = confirm("Are you the priest broadcasting? Click 'OK' for yes, 'Cancel' for viewing.");
        if (isBroadcaster) {
            // Set role to broadcaster
            await client.setClientRole("host");

            // Create audio and video tracks
            const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

            // Play the local video in the UI by passing the ID of the element in html that will the video will display on
            videoTrack.play("localVideo");

            // Publish the local stream
            await client.publish([audioTrack, videoTrack]);
            console.log("Local stream published");

            // Ensure audio is played back locally (optional)
            /* const localAudioTrack = audioTrack.getMediaStreamTrack();
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(new MediaStream([localAudioTrack]));
            source.connect(audioContext.destination); */
        } else {
            console.log("Not broadcasting, viewing as audience");
        }
    } catch (error) {
        console.error("Error during stream setup: ", error);
    }
}


// Subscribe to remote streams
/* client.on("user-published", async (user, mediaType) => {
    // Subscribe to a remote user's media stream
    await client.subscribe(user, mediaType);

    // If the media type is video, play the stream
    if (mediaType === "video") {
        const remoteVideoContainer = document.createElement("video");
        remoteVideoContainer.id = `remote_video_${user.uid}`;
        remoteVideoContainer.autoplay = true;
        remoteStreamsContainer.appendChild(remoteVideoContainer);

        user.videoTrack.play(remoteVideoContainer.id);
    }
    if (mediaType === "audio") {
        // Handle remote audio
        user.audioTrack.play();
    }
}); */

client.on("user-published", async (user, mediaType) => {
    // Subscribe to a remote user's media stream
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
        const remoteVideoContainer = document.createElement("div");
        remoteVideoContainer.id = `remote_video_container_${user.uid}`;

        const remoteVideoElement = document.createElement("video");
        remoteVideoElement.id = `remote_video_${user.uid}`;
        remoteVideoElement.autoplay = true;
        remoteVideoContainer.appendChild(remoteVideoElement);

        // Create a mute/unmute button for audio
        const muteButton = document.createElement("button");
        muteButton.textContent = "Mute";
        
        muteButton.onclick = () => {
            const mediaStreamTrack = user.audioTrack._originMediaStreamTrack;
            if (mediaStreamTrack) {
                mediaStreamTrack.enabled = !mediaStreamTrack.enabled;  // Toggle mute/unmute
                muteButton.textContent = mediaStreamTrack.enabled ? "Mute" : "Unmute";
            }
        };

        remoteVideoContainer.appendChild(muteButton);
        remoteStreamsContainer.appendChild(remoteVideoContainer);

        // Play the remote video
        user.videoTrack.play(remoteVideoElement.id);
    }

    if (mediaType === "audio") {
        // Handle remote audio
        user.audioTrack.play();
    }
});






// Handle when a remote user leaves
client.on("user-left", (user) => {
    const remoteVideo = document.getElementById(`remote_video_${user.uid}`);
    if (remoteVideo) remoteVideo.remove();
});

// Start the streaming process
startStreaming();