import React from "react";
import "./styles.css";

const CardContainer = ({ cards, onCardClick }) => {
    const cardCount = cards.length;
    const radius = 200; // カードを配置する円の半径

    return (
        <div className="card-container">
            {cards.map((card, index) => {
                // 角度を計算
                const angle = (360 / cardCount) * index;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                return (
                    <div
                        key={card.id}
                        className="card"
                        style={{
                            transform: `translate(${x}px, ${y}px)`,
                        }}
                        onClick={() => onCardClick(card.id)}
                    >
                        {card.isFlipped ? card.value : "?"}
                    </div>
                );
            })}
        </div>
    );
};

export default CardContainer;
