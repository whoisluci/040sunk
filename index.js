import { renderLandingPage } from "./start/start.js";

// GLOBAL COMPONENTS

// START COMPONENTS

// Dela upp index.js lokalt

renderLandingPage("#wrapper");
console.log('hej');

const STATE = {

};

globalThis.addEventListener("load", () => {
    STATE.socket = new WebSocket("ws://localhost:8888");

    STATE.socket.addEventListener("open", (event) => {
        STATE.client = event;
        let _pingInterval = null;
        if (!_pingInterval) {
            _pingInterval = setInterval(() => {
                console.log("Sending ping to server...");
                STATE.socket.send(JSON.stringify({event: "ping", data: {}}));  
            }, 60000);
        }
        console.info("[CLIENT]: Connection established!");
    });
});