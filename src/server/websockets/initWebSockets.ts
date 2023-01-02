import type https from 'https';
import WebSocket, { WebSocketServer } from 'ws';
import cookie from 'cookie';
import CookieParser from 'cookie-parser';

import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { authFromDatr } from '../lib/authMiddleware';
import { addWebSocketToMaps, getDetailsForSocket } from './SocketMaps';
import {
  INSTANCE_ACTION,
  SET_PUZZLE,
  assertSocketMessageType,
} from 'src/types/SocketMessage';
import getDotEnv from 'src/lib/dotenv';

const config = getDotEnv();

const sendJSON = (ws: WebSocket, thing: any) => {
  ws.send(JSON.stringify(thing, null, 4));
};

export function initWebSockets(server: https.Server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    const { user } = getDetailsForSocket(ws);
    console.log('Connection!', user);
    ws.on('message', async (msg) => {
      // Super basic DOS protection
      if (msg && String(msg).length > 5000) {
        console.log('massive-socket-request');
        return;
      }

      let data;
      try {
        data = JSON.parse(String(msg));
      } catch (e) {
        ws.send(
          JSON.stringify({
            error:
              "Look, I'm really trying here, but garbage in -- garbage out.",
          }),
        );
        console.log('bad-request', data);
        return;
      }

      if (typeof data !== 'object' || !data) {
        throw new Error('Bad payload');
      }

      ws.send(msg);
      if (!hasOwnProperty(data, 'type') || typeof data.type !== 'string') {
        sendJSON(ws, {
          error:
            "Not to be picky, but *no* `type` really isn't *my* type. I like labels. It's not your garbage JSON. It's me. Really. No, stop crying. Babe, I'm sorry.",
        });
        console.log('bad-request', data);
        return;
      }

      const messageType = assertSocketMessageType(data.type);

      if (messageType === SET_PUZZLE) {
        /*
        try {
          const puzzle = getPuzzleForRequest(ws.__user, data.payload);
          ws.__puzzle = puzzle;
        } catch (e) {
          sendJSON(ws, {
            error: (e as Error).message,
          });
          return;
        }
        sendJSON(ws, { success: "Aye aye, cap'n. Puzzle set!" });
        console.log('set-socket-puzzle', ws.__puzzle.name);
        */
      }

      if (messageType === INSTANCE_ACTION) {
        /*
        try {
          const apiResp = await PuzzleRunner.handleAPIRequest(
            ws.__puzzle,
            ws.__user,
            data.payload,
          );
          sendJSON(ws, apiResp);
          console.log('socket-api-request', {
            puzzleName: ws.__puzzle.name,
            body: data.payload,
          });
          return;
        } catch (e) {
          sendJSON(ws, {
            error:
              "Great, now it's broken. ARE YOU HAPPY? It definitely wasn't our shitty code...",
          });
          console.log('api-error', { data, error: e.message });
          return;
        }
        */
      }
    });

    ws.on('close', (ws) => {
      console.log('Close', ws);
    });
  });

  server.on('upgrade', async (request, socket, head) => {
    try {
      if (!request.headers.cookie) {
        throw new Error('No authentication information provided');
      }

      const cookies = cookie.parse(request.headers.cookie);
      const signedCookies = CookieParser.signedCookies(
        cookies,
        config.COOKIE_PARSER_SECRET,
      );

      console.log(124);
      if (
        signedCookies &&
        typeof signedCookies === 'object' &&
        signedCookies.datr &&
        typeof signedCookies.datr === 'string'
      ) {
        console.log(131);
        const { datr } = signedCookies;
        const { user, team } = await authFromDatr(datr);
        wss.handleUpgrade(request, socket, head, function done(ws) {
          addWebSocketToMaps(ws, user, team || undefined);
          wss.emit('connection', ws);
        });
      } else {
        throw new Error('Bad socket auth');
      }
    } catch (e) {
      console.log(e);
      socket.write('HTTP/1.1 401 Who the bloody hell are you?\r\n\r\n');
      socket.destroy();
    }
  });
}
