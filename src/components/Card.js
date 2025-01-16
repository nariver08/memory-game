import React from "react";
import "./styles.css"; // styles.css をインポート

const Card = ({ card, onClick, isFlipped }) => {
  const cardClass = isFlipped ? "card flipped" : "card";

  return (
      <div className={cardClass} onClick={() => onClick(card)}>
          {/* 修正: オブジェクトではなく、card.value を描画 */}
          {isFlipped ? card.value : "?"}
      </div>
  );
};

export default Card;

