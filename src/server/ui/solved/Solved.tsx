import { useEffect } from 'react';

const Solved = () => {
  useEffect(() => {
    const message = 'SOLVED';
    const bigMessage = document.createElement('div');
    bigMessage.className = 'bigMessage';
    message.split('').forEach((letter, idx) => {
      const letterDiv = document.createElement('div');
      letterDiv.className = 'letter';
      letterDiv.innerHTML = letter;
      letterDiv.style.animationDelay = idx * 100 + 'ms';
      bigMessage.appendChild(letterDiv);
    });
    document.body.appendChild(bigMessage);
    const style = document.createElement('style');
    style.appendChild(
      document.createTextNode(
        `
        .bigMessage {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          font-size: ${Math.ceil(100 / (message.length * 2)) * 2}vw;
          height: 100vh;
          justify-content: center;
          left: 0;
          overflow: hidden;
          padding: 10vmin;
          pointer-events: none;
          position: absolute;
          top: 0;
          white-space: pre;
          width: 100vw;
          z-index: 99999999;
        }
        .letter {
          align-items: center;
          animation-duration: 5s;
          animation-iteration-count: 1;
          animation-name: drop;
          animation-timing-function: ease-in;
          background: #000;
          display: flex;
          height: 100vh;
          justify-content: center;
          position: relative;
          top: -100vh;
        }
        .letter:first-child {
          padding-left: 10vw;
        }
        
        .letter:last-child {
          padding-right: 10vw;
        }


        @keyframes drop {
          0% {
            top: -100vh;
          }
        
          5% {
            color: #70ee70;
            top: 0;
          }
       
          25% {
            color: #bbeebb;
          }          

          50% {
            color: #70ee70;
          }          

          75% {
            color: #bbeebb;
          }          

          95% {
            color: #70ee70;
            top: 0;
          }
          
          100% {
            top: 100vh;
          }
        }
      `,
      ),
    );
    document.body.appendChild(style);
  }, []);
  return <></>;
};

export default Solved;
