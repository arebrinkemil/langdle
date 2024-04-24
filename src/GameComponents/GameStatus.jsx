const GameStatus = ({ gameStatus }) => (
  <div className="game-status">
    {gameStatus === "win" && (
      <div className="win-message">Congratulations! You Win!</div>
    )}
    {gameStatus === "lose" && (
      <div className="lose-message">Game Over! You Lose!</div>
    )}
  </div>
);
export default GameStatus;
