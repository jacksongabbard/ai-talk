import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import PuzzleIcon from '@mui/icons-material/Extension';

import type { DialogProps } from 'src/server/ui/dialogs/useDialog';
import { useCallback, useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const DIFFICULTY_LABELS: { [index: string]: string } = {
  1: 'I could have done it with both hands tied behind my back',
  2: `I could have done it with one hand tied behind my back`,
  3: `Perfectly balanced, as all things should be`,
  4: 'I almost gave up',
  5: `I'll go stare at the sun for 25 to clear my head after this`,
};

const RATING_LABELS: { [index: string]: string } = {
  1: `If I could give it 0 stars, I'd give it -100`,
  2: 'Bad',
  3: 'Alright',
  4: 'Pretty decent',
  5: '10/10, would do it again',
};

export type PuzzleFeedback = {
  rating: number;
  difficulty: number;
  feedbackText: string | undefined;
};

const getLabel = (
  hoverIndex: number,
  chosenRatingIndex: number | null,
  labels: Record<string, string>,
) => {
  if (hoverIndex === -1 && !chosenRatingIndex) {
    return '';
  }

  if (hoverIndex >= 0) {
    return labels[hoverIndex];
  }

  if (chosenRatingIndex) {
    return labels[chosenRatingIndex];
  }

  return '';
};

type Props = {
  puzzleId: string;
  existingFeedback: PuzzleFeedback | undefined;
};

export default function PuzzleFeedbackDialog(
  props: DialogProps<PuzzleFeedback | null> & Props,
) {
  const { puzzleId, isOpen, onClose, existingFeedback } = props;
  const [feedbackText, setFeedbackText] = useState<string | undefined>(
    existingFeedback?.feedbackText,
  );
  const [rating, setRating] = useState<number | null>(
    existingFeedback?.rating ?? null,
  );
  const [hoverOnRating, setHoverOnRating] = useState(-1);
  const [difficulty, setDifficulty] = useState<number | null>(
    existingFeedback?.difficulty ?? null,
  );
  const [hoverOnDifficulty, setHoverOnDifficulty] = useState(-1);

  useEffect(() => {
    if (!existingFeedback) {
      return;
    }
    setFeedbackText(existingFeedback.feedbackText);
    setRating(existingFeedback.rating);
    setDifficulty(existingFeedback.difficulty);
  }, [existingFeedback]);

  const handleSave = useCallback(() => {
    if (rating && difficulty) {
      onClose({ rating, difficulty, feedbackText });
    }
  }, [difficulty, feedbackText, onClose, rating]);

  const handleCancel = () => {
    onClose(null);
  };

  const handleChangeFeedbackText = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFeedbackText(event.target.value);
  };

  return (
    <Dialog open={isOpen} maxWidth="md" fullWidth onClose={handleCancel}>
      <DialogTitle
        css={{
          '&::first-letter': {
            textTransform: 'capitalize',
          },
        }}
      >
        {puzzleId} feedback
      </DialogTitle>
      <DialogContent
        css={{
          whiteSpace: 'pre-line',
        }}
      >
        <div
          css={{
            display: 'grid',
            gap: 'var(--spacing-xlarge)',
          }}
        >
          <Box>
            <Typography>How difficult was it?</Typography>
            <div css={{ display: 'flex', gap: 'var(--spacing-xlarge)' }}>
              <Rating
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#33ff3388',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#3f3',
                  },
                }}
                value={difficulty}
                onChange={(event, newValue) => {
                  setDifficulty(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHoverOnDifficulty(newHover);
                }}
                emptyIcon={
                  <PuzzleIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
                icon={<PuzzleIcon fontSize="inherit" />}
              />
              <Box>
                {getLabel(hoverOnDifficulty, difficulty, DIFFICULTY_LABELS)}
              </Box>
            </div>
          </Box>
          <Box>
            <Typography>How good was it?</Typography>
            <div css={{ display: 'flex', gap: 'var(--spacing-xlarge)' }}>
              <Rating
                value={rating}
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#33ff3388',
                  },
                  '& .MuiRating-iconHover': {
                    color: '#3f3',
                  },
                }}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHoverOnRating(newHover);
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              <Box>{getLabel(hoverOnRating, rating, RATING_LABELS)}</Box>
            </div>
          </Box>

          <TextField
            margin="dense"
            id="feedback"
            label="More thoughts..."
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={feedbackText}
            onChange={handleChangeFeedbackText}
            placeholder={`I got stuck here..., I really enjoyed X because..., I wish I could/had/didn't have to...`}
          />
        </div>
      </DialogContent>
      <DialogActions data-test="confirmationDialogActions">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
