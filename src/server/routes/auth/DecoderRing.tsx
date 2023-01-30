import React, {
  RefObject,
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

const RAD = Math.PI / 180;

type RotationMap = Map<number, number>;

function posFromIndex(
  index: number,
  wheel: number,
  rotationMap: RotationMap,
): { left: string; top: string } {
  let left = '0';
  let top = '0';

  const pos = index / 26;
  const deg = (rotationMap.get(wheel) || 0) + pos * 360;
  const rad = deg * RAD;
  const diameter = 270 - wheel * 40;

  // 280 = 580 / 2 - 10 (10 is half the size of a character)
  top = 280 + diameter * Math.cos(rad) + 'px';
  left = 280 + diameter * Math.sin(rad) + 'px';
  return { left, top };
}

const makeRotMap = () => {
  const rotMap: Map<number, number> = new Map();
  rotMap.set(0, 0);
  rotMap.set(1, 0);
  rotMap.set(2, 0);
  rotMap.set(3, 0);
  rotMap.set(4, 0);
  return rotMap;
};

const letterStyle: React.CSSProperties = {
  width: 20,
  height: 20,
  textAlign: 'center',
  position: 'absolute',
};

function positionAllLetters(
  letterRefs: { [keyName: string]: RefObject<HTMLDivElement> },
  rotationMap: RotationMap,
) {
  for (let keyName in letterRefs) {
    if (!hasOwnProperty(letterRefs, keyName)) {
      throw new Error('letterRefs does not contain: ' + keyName);
    }

    if (!letterRefs[keyName]) {
      throw new Error('letterRefs[' + keyName + '] is null?!');
    }

    const node = letterRefs[keyName].current;
    if (!node) {
      continue;
    }
    const index = parseInt(node.dataset.index || '0', 10);
    const wheel = parseInt(keyName.substring(1, 2));
    const { top, left } = posFromIndex(index, wheel, rotationMap);
    node.style.top = top;
    node.style.left = left;
  }
}

const SECTION_SIZE = 360 / 26;

const roundTo = (num: number, places: number): number => {
  return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
};

const toPositive = (num: number): number => {
  if (num < 0) {
    return 360 + num;
  }
  return num;
};

const answer = new Map<number, number>();
answer.set(0, roundTo(-13.846153846153847, 3));
answer.set(1, roundTo(83.07692307692308, 3));
answer.set(2, roundTo(110.76923076923077, 3));
answer.set(3, roundTo(110.76923076923077, 3));
answer.set(4, roundTo(290.7692307692308, 3));

type DecoderRingProps = {
  onSolve: () => void;
};

const DecoderRing: React.FC<DecoderRingProps> = ({ onSolve }) => {
  const letters = 'ABCDEҒGĤIJKLMNÔPQRŜTUVWXYZ'.split('');
  const rotationMap = useRef(makeRotMap());
  const userDragged = useRef(false);
  const initialSpinTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initialSpin = () => {
      const m = rotationMap.current;
      m.set(0, (m.get(0) || 0) + 0.1);
      m.set(1, (m.get(1) || 0) - 0.2);
      m.set(2, (m.get(2) || 0) + 0.3);
      m.set(3, (m.get(3) || 0) - 0.4);
      m.set(4, (m.get(4) || 0) + 0.5);

      positionAllLetters(letterRefs, rotationMap.current);

      if (!userDragged.current) {
        initialSpinTimeout.current = setTimeout(initialSpin, 17);
      }
    };
    initialSpin();
  }, []);

  const letterRefs: { [wheel_letter: string]: RefObject<HTMLDivElement> } = {};

  const letterRings = useMemo(() => {
    return [
      letters.map((l, idx) => {
        const ref = createRef<HTMLDivElement>();
        const keyName = 'w0_' + l;
        letterRefs[keyName] = ref;
        return (
          <div
            ref={ref}
            key={keyName}
            data-index={idx}
            style={{
              ...letterStyle,
              ...posFromIndex(idx, 0, rotationMap.current),
            }}
          >
            {l}
          </div>
        );
      }),

      letters.map((l, idx) => {
        const ref = createRef<HTMLDivElement>();
        const keyName = 'w1_' + l;
        letterRefs[keyName] = ref;
        return (
          <div
            ref={ref}
            key={keyName}
            data-index={idx}
            style={{
              ...letterStyle,
              ...posFromIndex(idx, 1, rotationMap.current),
            }}
          >
            {l}
          </div>
        );
      }),

      letters.map((l, idx) => {
        const ref = createRef<HTMLDivElement>();
        const keyName = 'w2_' + l;
        letterRefs[keyName] = ref;
        return (
          <div
            ref={ref}
            key={keyName}
            data-index={idx}
            style={{
              ...letterStyle,
              ...posFromIndex(idx, 2, rotationMap.current),
            }}
          >
            {l}
          </div>
        );
      }),
      letters.map((l, idx) => {
        const ref = createRef<HTMLDivElement>();
        const keyName = 'w3_' + l;
        letterRefs[keyName] = ref;
        return (
          <div
            ref={ref}
            key={keyName}
            data-index={idx}
            style={{
              ...letterStyle,
              ...posFromIndex(idx, 3, rotationMap.current),
            }}
          >
            {l}
          </div>
        );
      }),
      letters.map((l, idx) => {
        const ref = createRef<HTMLDivElement>();
        const keyName = 'w4_' + l;
        letterRefs[keyName] = ref;
        return (
          <div
            ref={ref}
            key={keyName}
            data-index={idx}
            style={{
              ...letterStyle,
              ...posFromIndex(idx, 4, rotationMap.current),
            }}
          >
            {l}
          </div>
        );
      }),
    ];
  }, []);

  const decoderRingRef = useRef<HTMLDivElement>(null);
  const hubCapRef = useRef<HTMLDivElement>(null);
  const [draggedWheel, setDraggedWheel] = useState<number | undefined>();
  const onGestureStart = useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (!decoderRingRef.current) {
        return;
      }

      let target = e.target;
      if (target === hubCapRef.current) {
        return;
      }

      const wheelIndex = parseInt(
        (e.target as HTMLDivElement).dataset.wheelindex || '-1',
        10,
      );

      if (wheelIndex === -1) {
        // Likely just clicked in the background
        // outside of the ring
        return;
      }

      const rect = decoderRingRef.current.getBoundingClientRect();

      const leftOffset = -rect.left - rect.width / 2;
      const topOffset = -rect.top - rect.height / 2;

      // We're in the touch event case
      let isTouch = !!(e as TouchEvent).touches;
      let startX = NaN;
      let startY = NaN;
      if (isTouch) {
        const touchEvent = e as TouchEvent;
        if (touchEvent.touches.length > 1) {
          return;
        }

        const t = touchEvent.touches[0];
        startX = t.pageX + leftOffset;
        startY = t.pageY + topOffset;
      } else {
        // We're in the mouse event case
        const mouseEvent = e as MouseEvent;
        startX = mouseEvent.pageX + leftOffset;
        startY = mouseEvent.pageY + topOffset;
      }

      e.preventDefault();
      e.stopPropagation();

      setDraggedWheel(wheelIndex);
      const startAngle = Math.atan2(startY, startX) * (180 / Math.PI);
      const prevWheelRotation = rotationMap.current.get(wheelIndex) || 0;

      const onGestureMove = (e: TouchEvent | MouseEvent) => {
        userDragged.current = true;
        if (initialSpinTimeout.current) {
          clearTimeout(initialSpinTimeout.current);
        }

        let x = 0;
        let y = 0;
        if (isTouch) {
          const touchEvent = e as TouchEvent;
          if (touchEvent.touches.length > 1) {
            return;
          }

          const t = touchEvent.touches[0];
          x = t.pageX + leftOffset;
          y = t.pageY + topOffset;
        } else {
          const mouseEvent = e as MouseEvent;
          x = mouseEvent.pageX + leftOffset;
          y = mouseEvent.pageY + topOffset;
        }

        const moveAngle = Math.atan2(y, x) * (180 / Math.PI);
        let newAngle = (prevWheelRotation + (startAngle - moveAngle)) % 360;
        const lockingDistance = Math.abs((newAngle / SECTION_SIZE) % 1) * 100;
        if (lockingDistance < 10 || lockingDistance > 90) {
          newAngle = SECTION_SIZE * Math.round(newAngle / SECTION_SIZE);
        }

        rotationMap.current.set(wheelIndex, newAngle);
        positionAllLetters(letterRefs, rotationMap.current);
      };

      const cleanup = () => {
        setDraggedWheel(undefined);

        if (isTouch) {
          document.removeEventListener('touchmove', onGestureMove);
          document.removeEventListener('touchend', cleanup);
          document.removeEventListener('touchcancel', cleanup);
        } else {
          document.removeEventListener('mousemove', onGestureMove);
          document.removeEventListener('mouseup', cleanup);
          document.removeEventListener('mouseleave', cleanup);
        }
        document.removeEventListener('blur', cleanup);

        let solved = true;
        for (let i = 0; i < 5; i++) {
          if (
            toPositive(answer.get(i) || 0) !==
            toPositive(roundTo(rotationMap.current.get(i) || 0, 3))
          ) {
            solved = false;
            break;
          }
        }
        if (solved) {
          onSolve();
        }
      };

      if (isTouch) {
        document.addEventListener('touchmove', onGestureMove);
        document.addEventListener('touchend', cleanup);
        document.addEventListener('touchcancel', cleanup);
      } else {
        document.addEventListener('mousemove', onGestureMove);
        document.addEventListener('mouseup', cleanup);
        document.addEventListener('mouseleave', cleanup);
      }

      document.addEventListener('blur', cleanup);
    },
    [setDraggedWheel],
  );

  useEffect(() => {
    if (!decoderRingRef.current) {
      return;
    }
    decoderRingRef.current.addEventListener('touchstart', onGestureStart, {
      passive: false,
    });
    decoderRingRef.current.addEventListener('mousedown', onGestureStart, {
      passive: false,
    });
  }, [onGestureStart]);

  return (
    <div
      ref={decoderRingRef}
      css={{
        width: 580,
        height: 580,
        fontFamily: 'monospace',
        fontSize: '20px',
        lineHeight: '20px',
        position: 'relative',
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      <div
        css={{
          background: draggedWheel === 0 ? '#131' : '#000',
          cursor: 'pointer',
          width: 580,
          height: 580,
          position: 'absolute',
          borderRadius: '100%',
          border: '1px #3f3 solid',
          fontFamily: 'monospace',
          top: 0,
          left: 0,
          '&:hover': {
            background: !draggedWheel || draggedWheel === 0 ? '#131' : '#000',
          },
        }}
        data-wheelindex="0"
      ></div>
      <div
        css={{
          background: draggedWheel === 1 ? '#131' : '#000',
          cursor: 'pointer',
          width: 500,
          height: 500,
          position: 'absolute',
          borderRadius: '100%',
          border: '1px #3f3 solid',
          fontFamily: 'monospace',
          top: 40,
          left: 40,
          '&:hover': {
            background: !draggedWheel || draggedWheel === 1 ? '#131' : '#000',
          },
        }}
        data-wheelindex="1"
      ></div>
      <div
        css={{
          background: draggedWheel === 2 ? '#131' : '#000',
          cursor: 'pointer',
          flexGrow: 0,
          flexShrink: 0,
          width: 420,
          height: 420,
          position: 'absolute',
          borderRadius: '100%',
          border: '1px #3f3 solid',
          top: 80,
          left: 80,
          '&:hover': {
            background: !draggedWheel || draggedWheel === 2 ? '#131' : '#000',
          },
        }}
        data-wheelindex="2"
      ></div>
      <div
        css={{
          background: draggedWheel === 3 ? '#131' : '#000',
          cursor: 'pointer',
          flexGrow: 0,
          flexShrink: 0,
          width: 340,
          height: 340,
          position: 'absolute',
          borderRadius: '100%',
          border: '1px #3f3 solid',
          top: 120,
          left: 120,
          '&:hover': {
            background: !draggedWheel || draggedWheel === 3 ? '#131' : '#000',
          },
        }}
        data-wheelindex="3"
      ></div>
      <div
        css={{
          background: draggedWheel === 4 ? '#131' : '#000',
          cursor: 'pointer',
          flexGrow: 0,
          flexShrink: 0,
          width: 260,
          height: 260,
          position: 'absolute',
          borderRadius: '100%',
          border: '1px #3f3 solid',
          top: 160,
          left: 160,
          '&:hover': {
            background: !draggedWheel || draggedWheel === 4 ? '#131' : '#000',
          },
        }}
        data-wheelindex="4"
      ></div>
      <div
        css={{
          background: '#000',
          flexGrow: 0,
          flexShrink: 0,
          width: 180,
          height: 180,
          position: 'absolute',
          borderRadius: '100%',
          border: '1px #3f3 solid',
          top: 200,
          left: 200,
        }}
        ref={hubCapRef}
      ></div>
      <div
        css={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {letterRings}
      </div>
      {/* Vertical box */}
      <div
        css={{
          borderLeft: '1px #3f3 solid',
          borderRight: '1px #3f3 solid',
          height: '200px',
          left: '278px',
          pointerEvents: 'none',
          position: 'absolute',
          top: '1px',
          width: '24px',
        }}
      ></div>
      {/* Down arrow */}
      <div
        css={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid #3f3',
          position: 'absolute',
          left: '285px',
          top: 0,
          pointerEvents: 'none',
        }}
      ></div>

      {/* Up arrow */}
      <div
        css={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: '5px solid #3f3',
          position: 'absolute',
          left: '285px',
          top: '195px',
          pointerEvents: 'none',
        }}
      ></div>
    </div>
  );
};

export default DecoderRing;
