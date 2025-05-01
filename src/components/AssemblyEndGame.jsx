import React from "react";
import { languages } from "../languages";
import { clsx } from "clsx";
import { getFarewellText,getRandomWord } from "../utils.js";
import Confetti from 'react-confetti'

export default function AssemblyEndGame() {
  //State Values
  const [currentWord, setCurrentWord] = React.useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = React.useState([]);

  //Derived Values
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  /* for New Game button */
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));

  const isGameLost = wrongGuessCount >= languages.length - 1;

  const isGameOver = isGameWon || isGameLost;

  /* last guessed letter */
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  //Static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  //to not repeat the same letter clicked in keyboard
  function handleGuessedLetter(letter) {
    setGuessedLetters((prevLetters) =>
      prevLetters.includes(letter)
        ? prevLetters /*there is no change bec i have clicked the same letter again*/
        : [...prevLetters, letter]
    );
  }

  const languageElements = languages.map((lang, index) => {
    // Changing the language element according to the number of wrong guesses made on the keyboard.
    /* see at last for explaination*/
    const isLanguageLost = index < wrongGuessCount;

    const className = clsx("chip", isLanguageLost && "lost");

    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <span className={className} style={styles} key={lang.name}>
        {lang.name}
      </span>
    );
  });

  const letterElements = currentWord
    .split("")
    .map((letter, index) => {

      const ShouldRevealLetters=isGameLost || guessedLetters.includes(letter)

      const missedLetterClassName=clsx(
        isGameLost && !guessedLetters.includes(letter) && "missed-letters"
      )

      return(<span key={index} className={missedLetterClassName}>
        {ShouldRevealLetters ? letter.toUpperCase() : ""}
      </span>)
});    //hiding the content(letters) and displaying the empty <span>

  const keyboardElements = alphabet.split("").map((letter, index) => {
    //for changing the color of the button
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !currentWord.includes(letter);
    //using clsx to get the classname that statisfy the condition
    const className = clsx({
      correct: isCorrect, //correct -> classname and isCorrect -> condition
      wrong: isWrong,
    });

    return (
      <button
        key={index}
        disabled={isGameOver}
        onClick={() => handleGuessedLetter(letter)}
        className={className}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  //changing the status of the game

  const gameStatusClass = clsx("status_container", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });

  function returnGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return <p>{getFarewellText(languages[wrongGuessCount - 1].name)}</p>;
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }
  }

  //we just need to empty the guessedLetters and currentWord to getrandomWord
  function startNewGame(){
    setGuessedLetters([])
    setCurrentWord(()=>getRandomWord())
  }

  return (
    <main>
      {isGameWon && <Confetti
      recycle={false} // cutting infinite confetti
      numberOfPieces={1000} //setting only 1000 colour sparks
      />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>

      <section className={gameStatusClass}>
        {returnGameStatus()}
      </section>

      <section className="language-chips">{languageElements}</section>

      <section className="display_word">{letterElements}</section>

      <section className="keyboard_word">{keyboardElements}</section>

      {isGameOver && <button className="new-game-btn" onClick={()=> startNewGame()}>New Game</button>}
    </main>
  );
}

// We check the wrongGuessCount against each element's index.
// If the condition (index < wrongGuessCount) is true, then we apply the "lost" CSS class.
// Otherwise, we keep the default "chip" class.
//
// Example:
// If wrongGuessCount = 2:
//   index 0 < 2 → true  → lost (chip is marked lost)
//   index 1 < 2 → true  → lost
//   index 2 < 2 → false → not lost
//
// If wrongGuessCount = 0:
//   No language chips (like HTML, JavaScript, etc.) are marked as lost.
