import { useCallback, useEffect, useState } from 'react';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';
import { INSTANCE_ACTION } from 'src/types/SocketMessage';

function sendJSON(s: WebSocket, thing: any) {
  s.send(JSON.stringify(thing));
}

function sendInstanceAction(s: WebSocket, something: object) {
  sendJSON(s, {
    type: INSTANCE_ACTION,
    payload: something,
  });
}

type SendInstanceAction = (payload: object) => void;

export function useWebSocket(
  onConnected: () => void,
  onClose: () => void,
  onMessage: (data: object) => void,
  onError: (error: string) => void,
): SendInstanceAction {
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
      s.onmessage = (thing) => {
        if (
          thing &&
          hasOwnProperty(thing, 'data') &&
          typeof thing.data === 'string'
        ) {
          try {
            const data = JSON.parse(thing.data);
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
            let message = 'Unexpected error';
            if (e && typeof e === 'object' && hasOwnProperty(e, 'message')) {
              message += ': ' + e.message;
            }
            console.error('Ah, yeah, no... we fucked it. ' + message);
            onError(message);
          }
        }
      };

      s.onopen = () => {
        onConnected();
        sendJSON(s, {
          type: 'hello',
        });
      };

      s.onclose = () => {
        onClose();
        setSocket(undefined);
      };
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

  return _sendInstanceAction;
}
