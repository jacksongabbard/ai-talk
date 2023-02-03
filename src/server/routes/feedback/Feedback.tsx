import { useCallback, useRef, useState } from 'react';

import {
  CordProvider,
  Thread,
  useCordThreadActivitySummary,
} from '@cord-sdk/react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export type Feedback = {
  puzzleId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  difficulty: number;
  feedbackText: string | null;
}[];

type ActiveThread = {
  id: string;
  position: { top: number; left: number };
};

const FeedbackTable = ({
  feedback,
  cordToken,
}: {
  feedback: Feedback;
  cordToken: string;
}) => {
  const [activeThread, setActiveThread] = useState<ActiveThread | null>(null);

  const handleClickCell = useCallback(
    (threadId: string, cellRef: HTMLTableCellElement) => {
      const cellRect = cellRef.getBoundingClientRect();
      const belowTheCell = cellRect.top + cellRect.height + window.scrollY;
      const alignedWithCell = cellRect.left;

      setActiveThread({
        id: threadId,
        position: { top: belowTheCell, left: alignedWithCell },
      });
    },
    [],
  );

  const handleClickOutsideThread = useCallback(() => {
    setActiveThread(null);
  }, []);

  return (
    <CordProvider clientAuthToken={cordToken}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, borderCollapse: 'separate' }}>
          <TableHead>
            <TableRow>
              <TableCell>Puzzle id</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Feedback text</TableCell>
              <TableCell>Updated at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedback.map((row) => (
              <TableRow
                key={row.userName + row.puzzleId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <CustomCell
                  content={row.puzzleId}
                  threadId={`${row.userName + row.puzzleId} puzzleId`}
                  onClick={handleClickCell}
                />
                <CustomCell
                  content={row.userName}
                  threadId={`${row.userName + row.puzzleId} userName`}
                  onClick={handleClickCell}
                />
                <CustomCell
                  content={row.rating}
                  threadId={`${row.userName + row.puzzleId} rating`}
                  onClick={handleClickCell}
                />
                <CustomCell
                  content={row.difficulty}
                  threadId={`${row.userName + row.puzzleId} difficulty`}
                  onClick={handleClickCell}
                />
                <CustomCell
                  content={row.feedbackText}
                  threadId={`${row.userName + row.puzzleId} feedbackText`}
                  onClick={handleClickCell}
                />
                <CustomCell
                  content={new Date(row.updatedAt).toISOString()}
                  threadId={`${row.userName + row.puzzleId}-updatedAt`}
                  onClick={handleClickCell}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {activeThread && (
        <FloatingThread
          id={activeThread.id}
          position={activeThread.position}
          onClickOutside={handleClickOutsideThread}
        />
      )}
    </CordProvider>
  );
};

function CustomCell({
  content,
  threadId,
  onClick,
}: {
  content: string | number | null;
  threadId: string;
  onClick: (threadId: string, cellRef: HTMLTableCellElement) => void;
}) {
  const ref = useRef<HTMLTableCellElement>(null);
  const handleClick = useCallback(() => {
    if (!ref.current) {
      console.log("How did you even click on a cell that's not rendered.");
      return;
    }

    onClick(threadId, ref.current);
  }, [onClick, threadId]);

  // TODO(am) Things get extremely laggy for relatively small number of rows (~100);
  // Find a better solution for this.
  const summary = useCordThreadActivitySummary({ threadId });

  return (
    <TableCell
      ref={ref}
      css={{
        position: 'relative', // So the ::after is positioned correctly.
        ':hover': {
          boxShadow: '#3f3 0px 0px 5px',
        },
        '::after':
          (summary?.total ?? 0) > 0
            ? {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                borderColor: 'transparent',
                borderStyle: 'solid',
                borderWidth: '7px',
                borderRightColor: '#3f3',
                borderTopColor: '#3f3',
              }
            : undefined,
      }}
      onClick={handleClick}
    >
      {content}
    </TableCell>
  );
}

function FloatingThread({
  id,
  position,
  onClickOutside,
}: {
  id: string;
  position: { top: number; left: number };
  onClickOutside: () => void;
}) {
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          height: '100vh',
          width: '100vw',
          top: 0,
          left: 0,
        }}
        onClick={onClickOutside}
      />
      <Box
        sx={{
          position: 'absolute',
          top: position.top,
          left: position.left,
        }}
      >
        <Paper elevation={6}>
          <Thread threadId={id} location={{ threadId: id }} />
        </Paper>
      </Box>
    </>
  );
}

function _unsafe_only_for_testing_generateRandomRows(numOfRows: number) {
  const randomFeedback: Feedback = [];
  for (let i = 0; i < numOfRows; i++) {
    randomFeedback.push({
      puzzleId: Math.random().toString(),
      userName: Math.random().toString(),
      createdAt: '2023-02-02T14:43:55.812Z',
      updatedAt: '2023-02-02T18:36:41.689Z',
      rating: 3,
      difficulty: 1,
      feedbackText: 'Not great, not terrible.',
    });
  }
  return randomFeedback;
}

export default FeedbackTable;
