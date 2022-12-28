import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import callAPI from 'src/client/lib/callAPI';
import { hasOwnProperty } from 'src/lib/hasOwnProperty';

type UserNameTextFieldProps = {
  onTextChange: (t: string) => void;
};

const UserNameTextField: React.FC<TextFieldProps & UserNameTextFieldProps> = (
  props,
) => {
  const { onChange, onTextChange, value, ...rest } = props;

  if (typeof value !== 'string') {
    throw new Error('User name value must be a string');
  }

  const [_value, setValue] = useState<string>(value);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [checkingName, setCheckingName] = useState(false);
  const [available, setAvailable] = useState<true | false | undefined>();

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  const _onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value.substring(0, 32));
    },
    [setValue],
  );

  const checkingRef = useRef<NodeJS.Timeout | undefined>(undefined);
  useEffect(() => {
    checkingRef.current && clearTimeout(checkingRef.current);

    if (value === _value) {
      return;
    }

    setAvailable(undefined);
    setCheckingName(false);
    setErrorMessage(undefined);
    setValue(value);
  }, [value, setValue]);

  useEffect(() => {
    checkingRef.current && clearTimeout(checkingRef.current);
    setCheckingName(false);

    if (value === _value) {
      return;
    }

    setAvailable(undefined);
    setErrorMessage(undefined);

    if (_value.length < 2) {
      setErrorMessage('User names must be at least 2 characters long');
      return;
    }

    checkingRef.current = setTimeout(() => {
      (async () => {
        setCheckingName(true);
        setAvailable(undefined);
        const resp = await callAPI('check-user-name-is-available', {
          userName: _value,
        });

        setCheckingName(false);
        if (
          hasOwnProperty(resp, 'available') &&
          typeof resp.available === 'boolean'
        ) {
          setAvailable(resp.available);
          if (resp.available) {
            onTextChange(_value);
          }
        }
        checkingRef.current = undefined;
      })();
    }, 1000);
  }, [_value, value, setCheckingName, setAvailable, onTextChange]);

  return (
    <>
      <TextField onChange={_onChange} value={_value} {...rest} />
      {checkingName && (
        <Typography
          variant="subtitle2"
          css={{ color: 'var(--theme-charcoal)' }}
        >
          Checking...
        </Typography>
      )}
      {available === true && (
        <Typography variant="subtitle2" css={{ color: 'var(--theme-sea)' }}>
          Hooray, that user name is available!
        </Typography>
      )}
      {available === false && (
        <Typography variant="subtitle2" css={{ color: 'var(--theme-orange)' }}>
          Sorry, that user name is not available.
        </Typography>
      )}
      {errorMessage !== undefined && (
        <Typography variant="subtitle2" css={{ color: 'var(--theme-orange)' }}>
          {errorMessage}
        </Typography>
      )}
    </>
  );
};

export default UserNameTextField;
