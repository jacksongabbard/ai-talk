import { useCallback, useEffect, useState } from 'react';
import { errorThingToString } from 'src/lib/error/errorThingToString';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { INSTANCE_ACTION, SET_PUZZLE } from 'src/types/SocketMessage';

function sendJSON(s: WebSocket, thing: any) {
  console.log(thing);
  s.send(JSON.stringify(thing));
}

function setPuzzle(s: WebSocket, puzzleName: string) {
  sendJSON(s, {
    type: SET_PUZZLE,
    payload: {
      puzzleName,
    },
  });
}

function sendInstanceAction(s: WebSocket, something: object) {
  sendJSON(s, {
    type: INSTANCE_ACTION,
    payload: something,
  });
}

export type SendInstanceAction = (payload: object) => void;
type SetPuzzle = (puzzleName: string) => void;

// WHERE DID YOU LEAVE OFF?
// I WAS TRYING TO DECIDE HOW TO FEED THE onMessage, etc.
// function down to the puzzle.

export function useWebSocket(
  onConnected: () => void,
  onClose: () => void,
  onMessage: (data: object) => void,
  onError: (error: string) => void,
): { sendInstanceAction: SendInstanceAction; setPuzzle: SetPuzzle } {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    // Connect a websocket
    let s: WebSocket;
    if (!socket) {
      s = new WebSocket(
        'wss://' +
          window.location.hostname +
          (window.location.port ? ':' + window.location.port : ''),
      );
      s.onmessage = (messageEvent) => {
        if (
          messageEvent &&
          messageEvent.data &&
          typeof messageEvent.data === 'string'
        ) {
          try {
            const data = JSON.parse(messageEvent.data);
            if (data && typeof data === 'object') {
              if (data.success) {
                return;
              }
              if (data.error) {
                throw new Error(data.error);
              }
              onMessage(data);
            } else {
              throw new Error('Invalid WebSocket message');
            }
          } catch (e) {
            let message = 'Unexpected error: ' + errorThingToString(e);
            console.error('Ah, yeah, no... we fucked it. ' + message);
            onError(message);
          }
        } else {
          console.log('Bad input: ', messageEvent);
        }
      };

      s.onopen = () => {
        onConnected();
        sendJSON(s, {
          type: 'hello',
          payload: {},
        });
      };

      s.onclose = () => {
        onClose();
        setSocket(undefined);
      };
      setSocket(s);
    }
  }, [socket, setSocket, onMessage]);

  const _sendInstanceAction = useCallback(
    (payload: object) => {
      if (socket) {
        sendInstanceAction(socket, payload);
      }
    },
    [socket],
  );

  const _setPuzzle = useCallback(
    (puzzleName: string) => {
      if (socket) {
        setPuzzle(socket, puzzleName);
      }
    },
    [socket],
  );

  return { sendInstanceAction: _sendInstanceAction, setPuzzle: _setPuzzle };
}
