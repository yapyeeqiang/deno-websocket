import {
	WebSocket,
	isWebSocketCloseEvent,
} from 'https://deno.land/std@0.107.0/ws/mod.ts';
import { v4 } from 'https://deno.land/std@0.107.0/uuid/mod.ts';

const sockets = new Map<string, WebSocket>();

interface BroadcastObj {
	name: string;
	message: string;
}

// broadcast events to all clients
function broadcastEvent(obj: BroadcastObj) {
	sockets.forEach((ws: WebSocket) => {
		ws.send(JSON.stringify(obj));
	});
}

export async function chatConnection(ws: WebSocket) {
	// add new ws connection to map
	const uid = v4.generate();
	sockets.set(uid, ws);

	for await (const e of ws) {
		// delete socket if connection close
		if (isWebSocketCloseEvent(e)) {
			sockets.delete(uid);
		}

		// create event object if its a string
		if (typeof e === 'string') {
			const eObj = JSON.parse(e);
			broadcastEvent(eObj);
		}
	}
}
