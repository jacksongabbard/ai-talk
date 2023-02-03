import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CordProvider } from '@cord-sdk/react';
import { beta } from '@cord-sdk/react/dist/mjs';

export type Feedback = {
  puzzleId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  difficulty: number;
  feedbackText: string | null;
}[];

const FeedbackTable = ({
  feedback,
  cordToken,
}: {
  feedback: Feedback;
  cordToken: string;
}) => {
  return (
    <CordProvider clientAuthToken={cordToken}>
      <beta.FloatingThreads />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                <TableCell component="th" scope="row">
                  {row.puzzleId}
                </TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell>{row.rating}</TableCell>
                <TableCell>{row.difficulty}</TableCell>
                <TableCell>{row.feedbackText}</TableCell>
                <TableCell>{new Date(row.updatedAt).toISOString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CordProvider>
  );
};

export default FeedbackTable;
