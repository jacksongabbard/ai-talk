import { useCallback, useEffect, useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating, { RatingProps } from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import PuzzleIcon from '@mui/icons-material/Extension';
import Typography from '@mui/material/Typography';

import type { DialogProps } from 'src/server/ui/dialogs/useDialog';

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
  feedbackText: string | null;
};
export type AverageFeedbackByPuzzleId = {
  [puzzleId: string]: { avgRating: number; avgDifficulty: number };
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
  const [feedbackText, setFeedbackText] = useState<string>(
    existingFeedback?.feedbackText ?? '',
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
    setFeedbackText(existingFeedback?.feedbackText ?? '');
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
            <PuzzleScoring
              hoveringIndex={hoverOnDifficulty}
              setHoveringIndex={setHoverOnDifficulty}
              score={difficulty}
              setScore={setDifficulty}
              type="difficulty"
            />
          </Box>
          <Box>
            <Typography>How good was it?</Typography>
            <PuzzleScoring
              hoveringIndex={hoverOnRating}
              setHoveringIndex={setHoverOnRating}
              score={rating}
              setScore={setRating}
              type="rating"
            />
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
        <Button
          onClick={handleSave}
          disabled={!rating || !difficulty}
          color="primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const CUSTOM_STYLE = {
  '& .MuiRating-iconFilled': {
    color: '#33ff3388',
  },
  '& .MuiRating-iconHover': {
    color: '#3f3',
  },
};

function PuzzleScoring({
  type,
  score,
  setScore,
  hoveringIndex,
  setHoveringIndex,
}: {
  score: number | null;
  setScore: (newScore: number | null) => void;
  hoveringIndex: number;
  setHoveringIndex: (index: number) => void;
  type: 'difficulty' | 'rating';
}) {
  const labels = type === 'difficulty' ? DIFFICULTY_LABELS : RATING_LABELS;
  const Icon = type === 'difficulty' ? PuzzleIcon : StarIcon;

  return (
    <div css={{ display: 'flex', gap: 'var(--spacing-xlarge)' }}>
      <Rating
        value={score}
        sx={CUSTOM_STYLE}
        onChange={(event, newValue) => {
          setScore(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHoveringIndex(newHover);
        }}
        emptyIcon={<Icon style={{ opacity: 0.55 }} fontSize="inherit" />}
        icon={<Icon fontSize="inherit" />}
      />
      {score || hoveringIndex >= 0 ? (
        <Box>{getLabel(hoveringIndex, score, labels)}</Box>
      ) : (
        <Box css={{ color: 'deeppink' }}>Required</Box>
      )}
    </div>
  );
}

export function PuzzleScoringViewOnly({
  score,
  type,
  size = 'small',
}: {
  score: number | null;
  type: 'difficulty' | 'rating';
  size?: RatingProps['size'];
}) {
  const Icon = type === 'difficulty' ? PuzzleIcon : StarIcon;

  return (
    <Rating
      value={score}
      size={size}
      sx={CUSTOM_STYLE}
      emptyIcon={<Icon style={{ opacity: 0.55 }} fontSize="inherit" />}
      icon={<Icon fontSize="inherit" />}
      readOnly
    />
  );
}
