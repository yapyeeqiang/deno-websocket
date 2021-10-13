import { serve } from 'https://deno.land/std@0.107.0/http/server_legacy.ts';
import {
	acceptWebSocket,
	acceptable,
} from 'https://deno.land/std@0.107.0/ws/mod.ts';
import { chatConnection } from './ws/chatroom.ts';

const server = serve({ port: 8000 });
console.log('http://localhost:8000/');

for await (const req of server) {
	// serve index page
	if (req.url === '/') {
		req.respond({
			status: 200,
			body: await Deno.open('./public/index.html'),
		});
	}

	// accept websocket connection
	if (req.url === '/ws' && acceptable(req)) {
		acceptWebSocket({
			conn: req.conn,
			bufReader: req.r,
			bufWriter: req.w,
			headers: req.headers,
		})
			.then(chatConnection)
			.catch(async (err) => {
				console.error(`error: ${err}`);
				await req.respond({
					status: 400,
				});
			});
	}
}
