import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "./components/Card";
import "./styles.css";

const App = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [startTime, setStartTime] = useState(null); // ゲーム開始時間
  const [endTime, setEndTime] = useState(null); // ゲーム終了時間
  const [countdown, setCountdown] = useState(3); // カウントダウンの値
  const [countdownVisible, setCountdownVisible] = useState(true); // カウントダウンの表示制御
  const [isTapAllowed, setIsTapAllowed] = useState(false); // カードタップ可能かどうかのフラグ

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cardCount = queryParams.get("cardCount") || 6; // URL パラメータからカード枚数を取得、デフォルトは6枚

  const cardWidth = 80;
  const cardHeight = 120;
  const maxAttempts = 100;

  const navigate = useNavigate(); // useNavigate を使用して画面遷移

  useEffect(() => {
    const generateCards = () => {
      const values = [...Array(Number(cardCount)).keys()].map((i) => i + 1);
      const deck = [...values, ...values]; // 2枚ずつ
      deck.sort(() => Math.random() - 0.5); // シャッフル
      setCards(
        deck.map((value, index) => ({
          id: index,
          value,
          isFlipped: false,
          position: getRandomPosition(),
        }))
      );
    };

    generateCards();
    setStartTime(Date.now()); // ゲーム開始時間を記録
  }, [cardCount]);

  useEffect(() => {
    // カウントダウンの処理
    if (countdownVisible) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else {
            clearInterval(countdownInterval);
            setIsTapAllowed(true); // 3秒経過後にカードタップを許可
            setCountdownVisible(false); // カウントダウンを非表示
            return 0;
          }
        });
      }, 1000);
    }
  }, [countdownVisible]);

  useEffect(() => {
    // 定期的にカードの位置を更新
    const intervalId = setInterval(() => {
      setCards((prevCards) =>
        prevCards.map((card) => ({
          ...card,
          position: getUniqueRandomPosition(prevCards.map((c) => c.position)),
        }))
      );
    }, 3000);

    return () => clearInterval(intervalId); // コンポーネントのアンマウント時にインターバルを解除
  }, []); // 空の依存配列で初回のみ実行

  const handleCardClick = (card) => {
    if (!isTapAllowed || flippedCards.length === 2 || card.isFlipped) return;

    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);
    setFlippedCards([...flippedCards, card]);

    if (flippedCards.length === 1) {
      const [firstCard] = flippedCards;
      if (firstCard.value === card.value) {
        setMatchedCards([...matchedCards, card.value]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstCard.id || c.id === card.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isGameOver = matchedCards.length === cards.length / 2;

  const getUniqueRandomPosition = (existingPositions) => {
    let attempts = 0;

    const tryGetPosition = () => {
      const x = Math.random() * (window.innerWidth - cardWidth);
      const y = Math.random() * (window.innerHeight - cardHeight);

      const isOverlapping = existingPositions.some(
        (position) =>
          Math.abs(position.x - x) < cardWidth &&
          Math.abs(position.y - y) < cardHeight
      );

      if (!isOverlapping) {
        return { x, y };
      }

      return null;
    };

    let position = null;
    while (attempts < maxAttempts && position === null) {
      position = tryGetPosition();
      attempts++;
    }

    return position || { x: 0, y: 0 };
  };

  const getRandomPosition = () => {
    const x = Math.random() * (window.innerWidth - cardWidth);
    const y = Math.random() * (window.innerHeight - cardHeight);
    return { x, y };
  };

  const handleGoHome = () => {
    navigate("/"); // トップ画面に遷移
  };

  const handleShareOnTwitter = () => {
    const elapsedTime = Math.floor((endTime - startTime) / 1000) - 3; // 経過時間を秒単位で計算
    const minutes = Math.floor(elapsedTime / 60); // 分に変換
    const seconds = elapsedTime % 60; // 秒に変換

    const timeText = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`; // 分が0のときは秒のみ

    const tweetText = encodeURIComponent(
      `動く神経衰弱：${
        cardCount * 2
      }枚を${timeText}でクリアしました！ #神経衰弱 https://memory-game-seven-lac.vercel.app/`
    );
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, "_blank"); // Twitterの投稿画面を開く
  };

  useEffect(() => {
    if (isGameOver) {
      setEndTime(Date.now()); // ゲーム終了時の時間を記録
    }
  }, [isGameOver]);

  const elapsedTime = endTime ? Math.floor((endTime - startTime) / 1000) - 3 : 0;
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const timeText = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;

  return (
    <div className="app">
      <h1
        style={{
          color: "blue",
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        動く神経衰弱
      </h1>
      {countdownVisible && (
        <div
          className="countdown"
          style={{
            zIndex: 100,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "80px",
            fontWeight: "bold",
            color: "red",
          }}
        >
          <h2>{countdown}</h2>
        </div>
      )}
      {isGameOver ? (
        <div className="game-over">
          <div>
            ゲーム終了！おめでとうございます！
            <br />
            {cardCount * 2}枚を{timeText}でクリアしました！
          </div>
          <div>
            <button onClick={handleGoHome}>トップ画面へ戻る</button>
            <button onClick={handleShareOnTwitter}>Twitterへ投稿</button>
          </div>
        </div>
      ) : (
        <div className="card-container">
          {cards.map((card) => {
            const { x, y } = card.position || { x: 0, y: 0 };

            return (
              <div
                key={card.id}
                style={{
                  position: "absolute",
                  top: `${y}px`,
                  left: `${x}px`,
                  transition: "all 3s ease", // カードの動きに遅延を追加
                  zIndex: 1, // カードを一番後ろに表示
                }}
              >
                <Card
                  card={card}
                  onClick={handleCardClick}
                  isFlipped={
                    card.isFlipped || matchedCards.includes(card.value)
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
