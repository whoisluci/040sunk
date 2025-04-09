"use strict";

import { serveFile, serveDir } from "jsr:@std/http/file-server";

// Sends a message as { event: event, data: data } to `socket` (i.e. a connection)
function send(socket, event, data) {
  socket.send(JSON.stringify({ event, data }));
}

function generateClientID() {
  let d = new Date().getTime();
	
	if( globalThis.performance && typeof globalThis.performance.now === "function" )
	{
		d += performance.now();
	}
	
	const uuid = 'xxxxxxxx-xxxx-8xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
	{
		const r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});

  return uuid;
}

function handleHTTPRequest(rqst) {
    const pathname = new URL(rqst.url).pathname;

    if (pathname.startsWith("/media")) {
        return serveDir(rqst, { fsRoot: "media", urlRoot: "media" });
    } else if (pathname.startsWith("/start")) {
        return serveDir(rqst, { fsRoot: "start", urlRoot: "start" });
    } else if (pathname.startsWith("/app")) {
        return serveDir(rqst, { fsRoot: "app", urlRoot: "app"});
    } else if (pathname.startsWith("/public")) {
        return serveDir(rqst, { fsRoot: "public", urlRoot: "public"})
    } else if (pathname === "/debug") {
        return new Response(JSON.stringify(STATE.rooms));
    }

    return serveFile(rqst, "./index.html"); 
}

const STATE = {
    "clients": [],
    "clientID": null,
    /* ändra om det behövs */
};

/*                                      SERVER                                                 */
Deno.serve( {
    port: 8888,
    handler: (rqst) => {
  
        if (rqst.headers.get("upgrade") != "websocket"){
        return handleHTTPRequest(rqst);
        }

        const { socket, response } = Deno.upgradeWebSocket(rqst);
        
        socket.addEventListener("open", async () => {
            STATE.clientID = generateClientID();
            
            STATE.clients.push({
                "id": STATE.clientID,
                "connection": socket
            });
        });

        socket.addEventListener("close", (event) => {
            console.log(`[SERVER]: Disconnect :: Goodbye ${STATE.clientID}`);
        });

        socket.addEventListener("error", (error) => {
            console.log(`[SERVER]: Error ${error}`);
        });

        return response;
    }
});
