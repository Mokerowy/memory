document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".memoryCard");
  let emojis = ["😀", "😂", "😍", "😎", "😭", "😡", "😱", "😴"];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let currentPlayer = 1;
  let player1Score = 0;
  let player2Score = 0;
  let player1Superpowers = { shuffle: false, hide: false, show: false };
  let player2Superpowers = { shuffle: false, hide: false, show: false };

  const shuffleEmojis = () => {
    emojis = emojis.concat(emojis); // Duplicate emojis for pairs
    emojis.sort(() => Math.random() - 0.5); // Shuffle emojis
  };

  const assignEmojisToCards = () => {
    shuffleEmojis();
    cards.forEach((card, index) => {
      if (!card.classList.contains("matched")) {
        let cardEmoji = (card.dataset.emoji = emojis[index]);
        card.innerHTML = `<div class="front"></div><div class="back">${cardEmoji}</div>`;
      }
    });
  };

  const flipCard = (card) => {
    if (lockBoard) return;
    if (card === firstCard) return;

    card.classList.add("is-flipped");

    if (!hasFlippedCard) {
      // First click
      hasFlippedCard = true;
      firstCard = card;
      return;
    }

    // Second click
    secondCard = card;
    checkForMatch();
  };

  const checkForMatch = () => {
    let isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
    if (isMatch) {
      disableCards();
      updateScore();
    } else {
      unflipCards();
      switchPlayer();
    }
  };

  const disableCards = () => {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.dataset.matchedBy = currentPlayer;
    secondCard.dataset.matchedBy = currentPlayer;
    firstCard.removeEventListener("click", handleCardClick);
    secondCard.removeEventListener("click", handleCardClick);

    resetBoard();
  };

  const unflipCards = () => {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove("is-flipped");
      secondCard.classList.remove("is-flipped");

      resetBoard();
    }, 1000);
  };

  const resetBoard = () => {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById("currentPlayer").textContent = `Player ${currentPlayer}'s turn`;
  };

  const updateScore = () => {
    if (currentPlayer === 1) {
      player1Score++;
      document.getElementById("player1Score").textContent = `Player 1: ${player1Score}`;
    } else {
      player2Score++;
      document.getElementById("player2Score").textContent = `Player 2: ${player2Score}`;
    }
  };

  const handleCardClick = (event) => {
    flipCard(event.currentTarget);
  };

  const shuffleCards = () => {
    if (currentPlayer === 1 && player1Superpowers.shuffle) return;
    if (currentPlayer === 2 && player2Superpowers.shuffle) return;

    if (currentPlayer === 1) {
      player1Superpowers.shuffle = true;
    } else {
      player2Superpowers.shuffle = true;
    }

    const unmatchedCards = Array.from(cards).filter(card => !card.classList.contains("matched"));
    const unmatchedEmojis = unmatchedCards.map(card => card.dataset.emoji);
    unmatchedEmojis.sort(() => Math.random() - 0.5);

    unmatchedCards.forEach((card, index) => {
      card.dataset.emoji = unmatchedEmojis[index];
      card.innerHTML = `<div class="front"></div><div class="back">${unmatchedEmojis[index]}</div>`;
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 500);
    });
  };

  const hideCards = () => {
    if (currentPlayer === 1 && player1Superpowers.hide) return;
    if (currentPlayer === 2 && player2Superpowers.hide) return;

    if (currentPlayer === 1) {
      player1Superpowers.hide = true;
    } else {
      player2Superpowers.hide = true;
    }

    const matchedCards = Array.from(cards).filter(card => card.classList.contains("matched"));
    if (matchedCards.length >= 2) {
      matchedCards[0].classList.add("fadeOut");
      matchedCards[1].classList.add("fadeOut");
      setTimeout(() => {
        matchedCards[0].classList.remove("is-flipped");
        matchedCards[1].classList.remove("is-flipped");
        matchedCards[0].classList.remove("fadeOut");
        matchedCards[1].classList.remove("fadeOut");

        // Deduct points from the player who matched the cards
        if (matchedCards[0].dataset.matchedBy === "1") {
          player1Score--;
          document.getElementById("player1Score").textContent = `Player 1: ${player1Score}`;
        } else {
          player2Score--;
          document.getElementById("player2Score").textContent = `Player 2: ${player2Score}`;
        }

        matchedCards[0].classList.remove("matched");
        matchedCards[1].classList.remove("matched");
        matchedCards[0].addEventListener("click", handleCardClick);
        matchedCards[1].addEventListener("click", handleCardClick);
      }, 500);
    }
  };

  const showCards = () => {
    if (currentPlayer === 1 && player1Superpowers.show) return;
    if (currentPlayer === 2 && player2Superpowers.show) return;

    if (currentPlayer === 1) {
      player1Superpowers.show = true;
    } else {
      player2Superpowers.show = true;
    }

    cards.forEach(card => {
      card.classList.add("fadeInOut");
      card.classList.add("is-flipped");
    });
    setTimeout(() => {
      cards.forEach(card => {
        if (!card.classList.contains("matched")) {
          card.classList.remove("is-flipped");
        }
        card.classList.remove("fadeInOut");
      });
    }, 1000);
  };

  assignEmojisToCards();

  cards.forEach((card) => {
    card.addEventListener("click", handleCardClick);
  });

  document.getElementById("shuffleButton").addEventListener("click", shuffleCards);
  document.getElementById("hideButton").addEventListener("click", hideCards);
  document.getElementById("showButton").addEventListener("click", showCards);

  document.getElementById("currentPlayer").textContent = `Player ${currentPlayer}'s turn`;
});