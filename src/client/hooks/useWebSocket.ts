import { useCallback, useEffect, useRef, useState } from 'react';
import { errorThingToString } from 'src/lib/error/errorThingToString';
import { INSTANCE_ACTION, SET_PUZZLE } from 'src/types/SocketMessage';

function sendJSON(s: WebSocket, thing: any) {
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

export function useWebSocket(
  onConnected: () => void,
  onClose: () => void,
  onMessage: (data: object) => void,
  onError: (error: string) => void,
): { sendInstanceAction: SendInstanceAction; setPuzzle: SetPuzzle } {
  const [socket, setSocket] = useState<WebSocket>();

  const onConnectedRef = useRef(onConnected);
  onConnectedRef.current = onConnected;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

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
              onMessageRef.current(data);
            } else {
              throw new Error('Invalid WebSocket message');
            }
          } catch (e) {
            const message = 'Unexpected error: ' + errorThingToString(e);
            console.error('Ah, yeah, no... we fucked it. ' + message);
            onErrorRef.current(message);
          }
        } else {
          console.log('Bad input: ', messageEvent);
        }
      };

      s.onopen = () => {
        onConnectedRef.current();
        sendJSON(s, {
          type: 'hello',
          payload: {},
        });
      };

      s.onclose = () => {
        onCloseRef.current();
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
