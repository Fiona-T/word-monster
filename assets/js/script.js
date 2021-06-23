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
    console.log(wordObject);
    return wordObject.word.toUpperCase();
    
}

/**
 * show blank spaces for letters in word to guess, show wordCategory, enable keyboard, eventListener on Hint btn 
 * @param {*string} wordCategory Verb or Adjective
 */
function startGame(wordCategory, wordObject) {
    //show the div with text and hint button
    showOrHideElement("word-area-in-play");
    //show word category
    document.getElementById("category").innerText = `${wordCategory.toUpperCase()}`;
    createLetterSpaces(wordObject);
    storeWordProperties(wordObject);
    updateKeyboard("enable");
    //when the Hint button is clicked, run the function giveHint
    document.getElementById("hint").addEventListener("click", giveHint);
}

/**
 * create span for letters in word to be guessed, add the letter as a data-attribute, used later to check guesses
 * @param {Object} wordObject word, type, hint, meaning
 */
function createLetterSpaces(wordObject) {
    let selectedWord = wordObject.word.toUpperCase();
    console.log(selectedWord);
    //for each letter in selected word, create a span, add class, add data-letter equal to that letter, append to the container div
    for (let i = 0; i < selectedWord.length; i++) {
        let span = document.createElement("span");
        span.setAttribute("class", "letter-space");
        span.setAttribute("data-letter", selectedWord[i]);
        document.getElementById("span-container").appendChild(span);
    };
}

function storeWordProperties(wordObject) {
    document.getElementById("hint").nextElementSibling.children[1].textContent = `${wordObject.hint}`;
    document.querySelector(".word").textContent = `${wordObject.word}`;
    document.querySelector(".definition").textContent = `${wordObject.meaning}`;
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
    // this.nextElementSibling.children[1].innerText = `${wordObject.hint}`;
}

/**
 * when the key click event, disable the key, check if wrong or right guess and run appropriate function
 */
function checkLetter() {
    //disable the key that was pressed so it can't be pressed again
    let keyPressed = this;
    keyPressed.setAttribute("disabled", true);
    let wordToGuess = document.querySelector(".word").textContent.toUpperCase();
    console.log(wordToGuess);
    //wrong guess will be if indexOf is -1, i.e. letter is not in the word
    let isWrongGuess = wordToGuess.indexOf(keyPressed.innerHTML) === -1;
    // if it's a wrong guess, run wrongGuess function, otherwise run correctGuess function
    isWrongGuess ? wrongGuess(keyPressed) : handleCorrectGuess(keyPressed);
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
    //check if max guesses used up, if they are then run endGame function with parameter false
    if (wrongGuesses >= 7) {
        endGame(false);
    }
}

/**
 * add correct colour to keyPressed, update letter on screen in appropriate span space, check if game won
 * @param {*} keyPressed the letter clicked on
 */
function handleCorrectGuess(keyPressed) {
    keyPressed.classList.add("correct");
    let guessedLetter = keyPressed.innerHTML
    //get the data-letter values from letter-space spans, put into array representing word to guess
    let letterSpans = document.querySelectorAll(".letter-space");
    let lettersArray = [];
    letterSpans.forEach(letter => lettersArray.push(letter.dataset.letter));
    console.log(lettersArray);
    // loop through the word, check if guessedLetter matches at that index, update innerText when it does
    for (let i = 0; i < lettersArray.length; i++) {
        if (lettersArray[i] === guessedLetter) {
            letterSpans[i].innerText = guessedLetter;
        }
    }
    // then check if game is won or not
    console.log("won check needed");
    // guessedLetters is the text from each span element i.e. letters already guessed correctly
    let guessedLetters = document.getElementById("span-container").textContent;
    console.log(guessedLetters);
    // if guessedLetters is same as the data-letter values then the word has been guessed and game is won
    if (guessedLetters === lettersArray.join("")) {
        //run the endGame function using "won" status, after short timeout so user can see last letter added to word
        setTimeout(() => {
            endGame(true);
        }, 300);
    }
}

/**
 * show the game over message, show word & meaning, disable keyboad, add evenListener on Play Again button
 * @param {boolean} gameWon true or false  
 */
function endGame(gameWon) {
    if (gameWon) {
        showGameOverMsg("YOU WON A TROPHY!")
        updateScore();
        showTrophy();
    } else {
        showGameOverMsg("SORRY, YOU LOST!")
    }
    showWordMeaning();
    updateKeyboard("disable");
    document.getElementById("reset").addEventListener("click", resetGame);
}

/**
 * show game-over box, add centered class, show text of won or lost msg parameter passed from endGame 
 * @param {string} msg won or lost message
 */
function showGameOverMsg(msg) {
    showOrHideElement("game-over-text-box");
    document.getElementById("game-over-text-box").parentElement.classList.add("centered");
    document.getElementById("won-or-lost-msg").textContent = msg;
}

/**
 * Show the word and its meaning in the word-area-game-over div, hide word-area-in-play div
 */
function showWordMeaning() {
    showOrHideElement("word-area-game-over");
    // document.querySelector(".word").textContent = `${wordObject.word}`;
    // document.querySelector(".definition").textContent = `${wordObject.meaning}`;
    showOrHideElement("word-area-in-play");
}

/**
 * add 1 to Score at endGame when status is won. Get previous score and add 1 to it
 */
function updateScore() {
    let score = parseInt(document.getElementById("score").textContent);
    document.getElementById("score").textContent = ++score;
}

/**
 * Show trophy and hide other guess imgs, animate trophy by adding .shake class and removing after 1second
 */
function showTrophy() {
    let guesses = document.querySelectorAll("img.guess:not(.trophy)");
    guesses.forEach(guess => guess.classList.add("hidden"));
    let trophy = document.querySelector(".trophy");
    trophy.classList.add("shake");
    setTimeout(() => {
        trophy.classList.remove("shake");
    }, 1000);
}

/**
 * show 'at-start', hide 'game-over' word areas, resetGuesses, removeLetterSpaces, resetHintBtn, remove colours from pressedKeys
 */
function resetGame() {
    showOrHideElement("word-area-at-start");
    showOrHideElement("word-area-game-over");
    resetGuesses();
    removeLetterSpaces();
    resetHintBtn();
    updateKeyboard("revertColours");
}

/**
 * reset Guesses area, hide game-over-text, show all the .guess graphics and remove centred class, re-set wrong guesses counter
 */
function resetGuesses() {
    showOrHideElement("game-over-text-box");
    let guessImgs = document.querySelectorAll(".guess");
    guessImgs.forEach(guessImg => guessImg.classList.remove("hidden"));
    document.querySelector(".guesses").classList.remove("centered");
    wrongGuesses = 0;
}

/**
 * // remove spans for letter spaces that were created at startGame
 */
function removeLetterSpaces() {
    let spanContainer = document.getElementById("span-container");
    while (spanContainer.hasChildNodes()) {
        spanContainer.removeChild(spanContainer.firstChild);
    }
}

/**
 * Hide the hint text, show the hint button
 */
function resetHintBtn() {
    let hintButton = document.getElementById("hint");
    hintButton.classList.remove("hidden");
    hintButton.nextElementSibling.classList.add("hidden");
}

/**
 * open or close instructions Modal when clicked
 */
function initialiseModal() {
    // on click add visible class to instructions-modal, put focus on close btn so user can press enter to close
    document.getElementById("instructions-open").addEventListener("click", function () {
        toggleModalVisibility();
        document.getElementById("close-modal").focus();
    });
    // on click of close button, remove the visible class from instructions-modal
    document.getElementById("close-modal").addEventListener("click", function () {
        toggleModalVisibility();
    });
    // to close the modal if user clicks anywhere on window
    window.onclick = function (event) {
        if (event.target == document.querySelector(".modal.visible")) {
            document.querySelector(".modal.visible").classList.remove("visible");
        }
    }
    /**
     * add or remove visible class to instructions-modal
     */
    function toggleModalVisibility() {
        document.getElementById("instructions-modal").classList.toggle("visible");
    }
}

//when DOM has loaded, listen for button click on Adjective/Verb buttons to start game, or click on instructions-open button
document.addEventListener("DOMContentLoaded", function () {
    initialiseCategories();
    initialiseModal();
})