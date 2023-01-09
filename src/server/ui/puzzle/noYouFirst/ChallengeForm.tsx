import { useEffect, useState } from 'react';

type ChallengeFormProps = {
  input: string;
};

const ChallengeForm: React.FC<ChallengeFormProps> = ({ input }) => {
  const [deciphered, setDeciphered] = useState(input);

  useEffect(() => {
    setDeciphered(input);
  }, [input, setDeciphered]);

  return (
    <div css={{ display: 'flex', flexDirection: 'row' }}>
      <div css={{ flex: 0, flexShrink: 0, flexGrow: 0, width: 200 }}></div>
      <pre
        css={{
          height: 400,
          overflow: 'auto',
          flex: 1,
        }}
      >
        {input}
      </pre>
    </div>
  );
};
