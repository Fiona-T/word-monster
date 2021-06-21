//variable for wordObject which will be chosen at random in startGame function 
let wordObject;
//the array of spans showing the letters to user once guessed
let wordSpanArray = [];
//counter for wrong guesses
let wrongGuesses = 0;

/**
 * listen for click on Category Buttons in word-area, on click hide button and run getWord using wordCategory
 */
function initialiseCategories() {
    let categoryButtons = document.getElementsByClassName("category-btn");
    //listen for click, on click set wordTyp e run getWordType and hide button. Using forEach to allow for more categories in future
    Array.from(categoryButtons).forEach(button => button.addEventListener("click", function () {
        let wordCategory = this.innerHTML;
        this.parentElement.parentElement.classList.add("hidden");
        getWord(wordCategory);
    }));
}

/**
 * to get word to be guessed at various stages in game
 * @returns word from wordObject in uppercase
 */
 function getWordToGuess() {
    return wordObject.word.toUpperCase();
}

/**
 * show blank spaces for word, show hint button, hide wordtype buttons and intro text.
 * @param {*string} wordCategory Verb or Adjective
 */
function startGame(wordCategory) {
    //show the div with text and hint button
    showOrHideElement("word-area-in-play");
    //show word category
    document.getElementById("category").innerText = `${wordCategory.toUpperCase()}`;
    //show the words spaces - equal to length of the chosen word
    createLetterSpaces();
    updateKeyboard("enable");
    //when the Hint button is clicked, run the function giveHint
    document.getElementById("hint").addEventListener("click", giveHint);
}

/**
 * create spans for each letter in word to be guessed, push them to wordSpanArray used later to check letter
 */
function createLetterSpaces() {
    // the word from the wordObject, in uppercase
    let selectedWord = getWordToGuess();
    //for each letter in the selected word, create a span, add class and append to the wordSpaces div, and push to wordSpanArray
    for (let i = 0; i < selectedWord.length; i++) {
        //create span element
        let span = document.createElement("span");
        //set the innerText to blank space
        span.innerText = " ";
        //add the class of letter-space to each span
        span.setAttribute("class", "letter-space");
        //add the spans to the div
        document.getElementById("span-container").appendChild(span);
        //add the span to the wordSpanArray (used later to show letters to user when correct)
        wordSpanArray.push(span);
        console.log(wordSpanArray);
    };
}

/**
 * add or remove the "hidden" class from element
 * @param {string} elementId 
 */
function showOrHideElement(elementId) {
    document.getElementById(elementId).classList.toggle("hidden");
}

/**
 * change keyboard state, depending on the value of update
 * @param {string} update can be enable, disable or revertColours 
 */
function updateKeyboard(update) {
    let keys = document.querySelectorAll(".key");
    if (update === "enable") {
        keys.forEach(key => key.removeAttribute("disabled"));
        keys[0].focus();
        keys.forEach(key => key.addEventListener("click", checkLetter));
    } else if (update === "disable") {
        keys.forEach(key => key.setAttribute("disabled", true));
    } else if (update === "revertColours") {
        keys.forEach(key => key.classList.remove("correct"));
        keys.forEach(key => key.classList.remove("incorrect"));
    }
}

/**
 * shows the text of the hint associated with the word, when the Hint button is clicked
 */
function giveHint() {
    //hide the button that was clicked, i.e. the Hint button
    this.classList.add("hidden");
    // show the hint text p tag (sibling of Hint button) by removing hidden class
    this.nextElementSibling.classList.remove("hidden");
    //add the hint to the element so that it shows on screen
    this.nextElementSibling.children[1].innerText = `${wordObject.hint}`;
}

/**
 * when the key click event, disable the key, check if wrong or right guess and run appropriate function
 */
function checkLetter() {
    //disable the key that was pressed so it can't be pressed again
    let keyPressed = this;
    keyPressed.setAttribute("disabled", true);
    let wordToGuess = getWordToGuess();
    //wrong guess will be if indexOf is -1, i.e. letter is not in the word
    let isWrongGuess = wordToGuess.indexOf(keyPressed.innerHTML) === -1;
    // if it's a wrong guess, run wrongGuess function, otherwise run correctGuess function
    isWrongGuess ? wrongGuess(keyPressed) : correctGuess(keyPressed);
}

/**
 * increase wrongGuesses counter, show lives used up, check if game lost, if all lives used up
 */
function wrongGuess(keyPressed) {
    //add class to turn letter red
    keyPressed.classList.add("incorrect");
    // increase the wrong guesses counter by 1
    wrongGuesses++;
    //remove one of the lives from the guess area
    //get the img tag with the data-guess value equal to the wrongGuesses value
    let lifeUsed = document.querySelector(`img[data-guess="${wrongGuesses}"]`);
    //add the hidden class to it
    lifeUsed.classList.add("hidden");
    // get the monster graphic
    let monster = document.querySelector(".monster");
    // add the jump class to animate it with transforms
    monster.classList.add("jump");
    // timeout to remove the jump class 
    setTimeout (() => {
        monster.classList.remove("jump");
    }, 150);
    //check if max guesses used up, if they are then run endGame
    if (wrongGuesses >= 7) {
        endGame("lost");
    }
}

/**
 * update the letter on screen, check if game won, if all letters now guessed
 * @param {*} guessedLetter - the letter clicked on
 */
function correctGuess(keyPressed) {
    keyPressed.classList.add("correct");
    let guessedLetter = keyPressed.innerHTML
    let wordToGuess = getWordToGuess();
    console.log(wordToGuess);
    // loop through the word
    for (let i = 0; i < wordToGuess.length; i++) {
        //if the guess matches at that index
        if (wordToGuess[i] === guessedLetter) {
            //update the wordSpanArray with that letter
            wordSpanArray[i].innerText = guessedLetter;
        }
    }
    // then check if game is won or not
    console.log("won check needed");
    // wordCheck is the text from each span element in the word-to-guess div
    let wordCheck = document.getElementById("span-container").textContent;
    console.log(wordCheck);
    // if wordCheck is same as selectedWord then the word has been guessed and game is won
    if (wordCheck === wordToGuess) {
        //set status and run the endGame function using this status
        endGame("won");
    }
}

/**
 * show the game over text, show the Play Again button and hide divs from game-in-play
 * @param {string} status won or lost
 */
function endGame(status) {
    //get the game-over-text div and remove hidden class
    showOrHideElement("game-over-text-box");
    // add class to parent div, to center the text and icon
    document.getElementById("game-over-text-box").parentElement.classList.add("centered");
    let message = document.getElementById("won-or-lost-msg");
    if (status === "lost") {
        message.textContent = "SORRY, YOU LOST!"
    } else {
        message.textContent = "YOU WON A TROPHY!";
        // hide the monster and lives from guesses area, leaving the trophy icon 
        let guesses = document.querySelectorAll("img.guess:not(.trophy)");
        guesses.forEach(guess => guess.classList.add("hidden"));
        // update the score
        // get the number from the span with id of score
        let score = parseInt(document.getElementById("score").textContent);
        // add one to it
        document.getElementById("score").textContent = ++score;
    }
    // show the Game Over div
    showOrHideElement("word-area-game-over");
    // show the word
    document.querySelector(".word").textContent = `${wordObject.word}`;
    // show the word meaning
    document.querySelector(".definition").textContent = `${wordObject.meaning}`;
    // hide the word-area-in-play div
    showOrHideElement("word-area-in-play");
    //lock the keyboard
    updateKeyboard("disable");
    // add event listener for Play Again button to run reset function
    document.getElementById("reset").addEventListener("click", resetGame);
}

function resetGame() {
    //show the div for game at start
    showOrHideElement("word-area-at-start");
    // hide the div that was previously shown at game over stage
    showOrHideElement("word-area-game-over");
    // re-set the wrong guesses back to 0
    wrongGuesses = 0;
    // remove the game over text
    document.querySelector(".game-over-text").classList.add("hidden");
    // show the monster icon, guesses and trophy
    let lives = document.querySelectorAll(".guess");
    lives.forEach(life => life.classList.remove("hidden"));
    // remove the spans from word-spaces div (spans were created during game, for each letter of word to guess)
    let wordSpaces = document.getElementById("span-container");
    while(wordSpaces.hasChildNodes()) {
        wordSpaces.removeChild(wordSpaces.firstChild);
    } 
    // clear the wordSpanArray back to empty
    wordSpanArray = [];
    // hide the hint text and show the Hint button
    let hintButton = document.getElementById("hint");
    hintButton.classList.remove("hidden");
    hintButton.nextElementSibling.classList.add("hidden");
    //remove class from .guesses div that centered the element
    document.querySelector(".guesses").classList.remove("centered");
    //remove colours from pressedKeys
    updateKeyboard("revertColours");
}

/**
 * listen for click to open Instructions Modal box
 */
function initialiseModal() {
    //open modal button variable
    const open = document.getElementById("instructions-open")
    //close modal button variable
    const close = document.getElementById("close-modal")
    // on click of Instructions button, get the instructions-modal el and add visible class to it
    open.addEventListener("click", function () {
        document.getElementById("instructions-modal").classList.add("visible");
        //add focus to close button so user can press enter to close
        close.focus();
    });
    // on click of close button, remove the visible class from modal
    close.addEventListener("click", function () {
        document.getElementById("instructions-modal").classList.remove("visible");
    });
    // to close the modal if user clicks anywhere on window
    window.onclick = function (event) {
        if (event.target == document.querySelector(".modal.visible")) {
            document.querySelector(".modal.visible").classList.remove("visible");
        }
    }
}

//when DOM has loaded, listen for button click on Adjective/Verb buttons to start game, or click on open Modal
document.addEventListener("DOMContentLoaded", function () {
    initialiseCategories();
    initialiseModal();
})