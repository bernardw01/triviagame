/* 
 Bernard Williams
 UCF Bootcamp APR2017 Week 5
 Trivia Game
 */

//when the page loads do this

//Initialize the game area

//Tell the use to click the start button to start the game

/* When the user clicks start do the following
 1. Randomly select the first question to be displayed
 2. Display the first question
 3. Start the timer
 4. If the time runs out before the user selects the right answer. Fade out the wrong answers and display for a few seconds before moving to the next question.
 5. Update the score and display it in the stats panel

 */

//Global Variables
var totalElapsed = 0;
var questionTimer = 0;


//Gamestate Object
var gameState = {
    inProgress: false,
    waitingForAnswer: false,
    currentQuestionRight: false,
    timeUp: false
}

$(document).ready(function () {
    gameInit();


//Click event handlers

    $('#startBtn').click(displayQuestion);
    $('#resetBtn').on('click', gameInit);

    function gameInit() {
        gameState.inProgress = false;
        gameState.currentQuestionRight = false;
        gameState.waitingForAnswer = false;
        setProgressBar(0);
        setTimerBar(0);
        console.log('game initialized');
    }

    /**
     * This function sets the value of the on screen progress bar.
     * @param val
     */
    function setProgressBar(val) {
        $('#progressBar').attr('style', 'width:' + val + '%');
        $('#progressBar').attr('aria-valuenow', val);
        $('#progressBar').text(val + '%');
    }

    function setTimerBar(val) {
        $('#timerProgressBar').attr('style', 'width:' + val + '%');
        $('#timerProgressBar').attr('aria-valuenow', val);
        $('#timerProgressBar').text(val + '%');
    }

    /**
     * This function obtains a question from the question back and passes it to the calling function.
     * @return {Question Object}
     */
    function getQuestion() {

        var randNum = getRandomInt(0, questionBank.length - 1);
        //console.log(questionBank[randNum]);

        console.log('---- Get Question');
        console.log(randNum);
        return questionBank[randNum];
    }

    /**
     * This function displays the question in the Your Questions section
     */
    function displayQuestion() {
        console.log('---- Display Question');
        //console.log(getQuestion());
        var currQ = getQuestion();
        var qp = $('#questionPanel');
        var qh = $('<div>');
        qh.addClass('alert alert-info');
        qh.text(currQ.question);
        qp.append(qh);

    }

    /**
     * Get a random integer between `min` and `max`.
     *
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {int} a random integer
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    function displayAnswer(answerTxt, rightAnswer) {

    }

});



