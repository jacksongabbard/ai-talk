import React, { useCallback, useMemo, useState } from 'react';

export type DialogProps<TResult> = {
  isOpen: boolean;
  onClose: (result: TResult) => void;
};

type HookResult<TProps, TResult> = [
  JSX.Element | null,
  (props: Omit<TProps, 'isOpen' | 'onClose'>) => Promise<TResult>,
];

export default function useDialog<TResult, TProps = {}>(
  DialogComponent: React.FunctionComponent<DialogProps<TResult> & TProps>,
): HookResult<TProps, TResult> {
  const [dialogProps, setDialogProps] = useState<
    (DialogProps<TResult> & TProps) | null
  >(null);

  const dialog = useMemo(
    () => (dialogProps ? <DialogComponent {...dialogProps} /> : null),
    [DialogComponent, dialogProps],
  );

  const openDialogPromise = useCallback(
    (props: Omit<TProps, 'isOpen' | 'onClose'>) =>
      new Promise((resolve: (result: TResult) => void) => {
        const onClose = (result: TResult) => {
          setDialogProps((props) => ({ ...props!, isOpen: false }));
          resolve(result);
        };
        const dialogProps = {
          isOpen: true,
          onClose,
          ...props,
        } as DialogProps<TResult> & TProps;
        setDialogProps(dialogProps);
      }),
    [],
  );

  return [dialog, openDialogPromise];
}
