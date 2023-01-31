import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import type { DialogProps } from 'src/server/ui/dialogs/useDialog';

type Props = {
  // The action that this dialog is confirming.
  action: string;
  // Used to apply warning styling - for deletion and such
  isActionDestructive?: boolean;
  // The object that is being modified.
  object: string;
  // If we have a specific object that is being modified (e.g. the name of the team),
  // we should use it to populate the question.
  specificObject?: string;
  // Optional additional information about the impact of the action.
  additionalMessage?: string;
  // Optional custom label for the button that dismisses the dialog
  cancelButtonLabel?: string;
  // Optional custom label for the button that confirms the dialog
  confirmButtonLabel?: string;
};

export default function ConfirmationDialog(
  props: DialogProps<boolean> & Props,
) {
  const { action, object, specificObject, additionalMessage, isOpen, onClose } =
    props;
  const title = `${action} the ${object}?`;
  const objectName = specificObject ? `"${specificObject}"` : `the ${object}`;
  const confirmationQuestion = `Are you sure you want to ${action} ${objectName}?`;
  const confirmButton =
    props.confirmButtonLabel || `Yes, ${action} the ${object}`;

  const handleOK = () => {
    onClose(true);
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Dialog open={isOpen} maxWidth="sm" fullWidth onClose={handleCancel}>
      <DialogTitle
        css={{
          '&::first-letter': {
            textTransform: 'capitalize',
          },
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        css={{
          whiteSpace: 'pre-line',
        }}
      >
        {confirmationQuestion} {additionalMessage}
      </DialogContent>
      <DialogActions data-test="confirmationDialogActions">
        <Button onClick={handleCancel}>
          {props.cancelButtonLabel || 'No'}
        </Button>
        <Button
          onClick={handleOK}
          color="primary"
          css={{ color: props.isActionDestructive ? 'deeppink' : 'inherit' }}
        >
          {confirmButton}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
