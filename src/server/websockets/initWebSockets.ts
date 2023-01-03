import type https from 'https';
import WebSocket, { WebSocketServer } from 'ws';
import cookie from 'cookie';
import CookieParser from 'cookie-parser';

import { authFromDatr } from '../lib/authMiddleware';
import {
  addWebSocketToMaps,
  getDetailsForSocket,
  removeWebSocketFromMaps,
} from './SocketMaps';
import {
  INSTANCE_ACTION,
  SET_PUZZLE,
  SocketMessage,
  assertIsSetPuzzleMessage,
  assertIsSocketMessage,
} from 'src/types/SocketMessage';
import getDotEnv from 'src/lib/dotenv';
import { handleSetPuzzle } from './handleSetPuzzle';
import { handlePuzzleInstanceAction } from './handlePuzzleInstanceAction';
import { errorThingToString } from 'src/lib/error/errorThingToString';

const config = getDotEnv();

const sendJSON = (ws: WebSocket, thing: any) => {
  ws.send(JSON.stringify(thing, null, 4));
};

// Might need to add some basic heartbeat stuff like this:
// https://github.com/websockets/ws#how-to-detect-and-close-broken-connectionshttps://github.com/websockets/ws#how-to-detect-and-close-broken-connectionshttps://github.com/websockets/ws#how-to-detect-and-close-broken-connections

export function initWebSockets(server: https.Server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws) => {
    ws.on('message', async (msg) => {
      // Super basic DOS protection
      if (msg && String(msg).length > 5000) {
        console.log('massive-socket-request');
        return;
      }

      let data;
      let sm: SocketMessage;
      try {
        data = JSON.parse(String(msg));
        console.log(data);
        sm = assertIsSocketMessage(data);
      } catch (e) {
        ws.send(
          JSON.stringify({
            error:
              "Look, I'm really trying here, but garbage in -- garbage out: " +
              (e as Error).message,
          }),
        );
        console.log('bad-request', data);
        return;
      }

      if (sm.type === SET_PUZZLE) {
        const setPuzzleMessage = assertIsSetPuzzleMessage(sm.payload);
        try {
          await handleSetPuzzle(ws, setPuzzleMessage);
        } catch (e) {
          sendJSON(ws, {
            error: (e as Error).message,
          });
          return;
        }
        sendJSON(ws, { success: true });
        console.log('set-socket-puzzle', setPuzzleMessage.puzzleName);
      }

      if (sm.type === INSTANCE_ACTION) {
        if (typeof sm.payload !== 'object') {
          sendJSON(ws, { error: 'Bad instance action' });
          console.log('invalid-instance-action', sm);
          return;
        }

        try {
          await handlePuzzleInstanceAction(ws, sm.payload);
        } catch (e) {
          sendJSON(ws, {
            error:
              'Error handling puzzle instance action: ' + errorThingToString(e),
          });
          console.log('puzzle-instance-action-error', e);
        }
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

    ws.on('close', () => {
      removeWebSocketFromMaps(ws);
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

      if (
        signedCookies &&
        typeof signedCookies === 'object' &&
        signedCookies.datr &&
        typeof signedCookies.datr === 'string'
      ) {
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
