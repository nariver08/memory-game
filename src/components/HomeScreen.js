import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const [cardCount, setCardCount] = useState(6); // デフォルトで6枚
  const navigate = useNavigate();

  const handleCardCountChange = (event) => {
    setCardCount(Number(event.target.value));
  };

  const startGame = () => {
    // ゲーム画面にカード枚数を渡して遷移
    navigate(`/game?cardCount=${cardCount}`);
  };

  return (
    <div className="home-screen">
      <h1>動く神経衰弱</h1>
      <label>
        使用するカードのセット数(1セット=2枚):
        <input
          type="number"
          value={cardCount}
          onChange={handleCardCountChange}
          min="2"
          max="10"
        />
      </label>
      <button onClick={startGame}>ゲーム開始</button>
    </div>
  );
};

export default HomeScreen;
