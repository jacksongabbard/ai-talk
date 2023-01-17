type PathProps = {
  cell: {
    up?: boolean;
    right?: boolean;
    down?: boolean;
    left?: boolean;
  };
};

const bgColor = '#252';

const Paths: React.FC<PathProps> = ({ cell }) => {
  return (
    <>
      {cell.up && cell.down && (
        <div
          css={{
            width: '33.33%',
            height: '100%',
            backgroundColor: bgColor,
            position: 'absolute',
            left: '33.33%',
          }}
        ></div>
      )}
      {cell.left && cell.right && (
        <div
          css={{
            height: '33.33%',
            width: '100%',
            backgroundColor: bgColor,
            position: 'absolute',
            top: '33.33%',
          }}
        ></div>
      )}
      {cell.left && !cell.right && (
        <div
          css={{
            height: '33.33%',
            width: '66.66%',
            backgroundColor: bgColor,
            position: 'absolute',
            top: '33.33%',
          }}
        ></div>
      )}
      {cell.right && !cell.left && (
        <div
          css={{
            height: '33.33%',
            width: '66.66%',
            backgroundColor: bgColor,
            position: 'absolute',
            top: '33.33%',
            right: 0,
          }}
        ></div>
      )}
      {cell.up && !cell.down && (
        <div
          css={{
            width: '33.33%',
            height: '66.66%',
            backgroundColor: bgColor,
            position: 'absolute',
            top: 0,
            left: '33.33%',
          }}
        ></div>
      )}
      {cell.down && !cell.up && (
        <div
          css={{
            width: '33.33%',
            height: '66.66%',
            backgroundColor: bgColor,
            position: 'absolute',
            bottom: 0,
            left: '33.33%',
          }}
        ></div>
      )}
    </>
  );
};

export default Paths;
