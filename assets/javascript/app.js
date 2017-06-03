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

//TODO - Add code to track how many questions were asked and stop the game when there are no more questions left
//TODO - Add code to update the current progress bar based on the percentage of questions asked
//TODO - Fix the CSS for the Your Time and Your stats sections
//TODO - Clean up the reset function so that all values are reset


//Global Variables
var initialTimeSet = 10;
var timeAllowed = 21;
var currentQuestionID = 0;
var rightAnswer = 0;
var questionCount = 0;
var numRight = 0;
var numWrong = 0;
var freezeScreen = false;


//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

//Gamestate Object
var gameState = {
    inProgress: false,
    waitingForAnswer: false,
    currentQuestionRight: false,
    timeUp: false,
    gameOver: false
};

/**
 * Our stopwatch object.
 * @type {{time: number, lap: number, lapText: Array, reset: reset, start: start, stop: stop, recordLap: recordLap, count: count, timeConverter: timeConverter}}
 */
var stopwatch = {
    time: 0,
    lap: 1,
    lapText: [],

    reset: function () {
        console.log('Reset function called');
        stopwatch.time = 0;
        stopwatch.lap = 1;
        clockRunning = false;

        $("#display").text("00:00");
        $("#messageBar").text("");
    },

    start: function () {
        if (!clockRunning) {
            intervalId = setInterval(stopwatch.count, 1000);
            clockRunning = true;
        }
    },
    stop: function () {
        clearInterval(intervalId);
        clockRunning = false;
    },

    recordLap: function () {
        var currentTime = stopwatch.timeConverter(stopwatch.time);
        stopwatch.lapText.push("<br/><b>Question #: </b> " + stopwatch.lap + " Current Time: " + currentTime);
        //$("#laps").html(stopwatch.lapText.join('<br/>'));
        stopwatch.lap = stopwatch.lap + 1;
    },
    count: function () {
        if (stopwatch.time < timeAllowed) {
            stopwatch.time++;
            var displayTime = stopwatch.timeConverter(stopwatch.time);
            $("#display").text(displayTime);
            var timerBarVal = Math.round((stopwatch.time / timeAllowed) * 100);
            setTimerBar(timerBarVal);
        }

    },

    timeConverter: function (t) {
        //Takes the current time in seconds and convert it to minutes and seconds (mm:ss).
        var minutes = Math.floor(t / 60);
        var seconds = t - minutes * 60;

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        if (minutes === 0) {
            minutes = "00";
        } else if (minutes < 10) {
            minutes = "0" + minutes;
        }

        return minutes + ":" + seconds;
    }
};

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
$(document).ready(function () {
        gameInit();


//Click event handlers

        $('#startBtn').click(function () {
            console.log('---- Button Question function');
            console.log(gameState);
            if (!gameState.gameOver) {
                gameState.inProgress = true
                gameState.waitingForAnswer = true;
                displayQuestion();
            }

        });
        $('#resetBtn').on('click', gameInit);


        function evaluateResponse() {

            console.log('---- Evaluate Response Function');

            console.log(gameState);
            if (gameState.waitingForAnswer && !freezeScreen) {
                //gameState.waitingForAnswer = false;
                var selectedAnswer = $(this).attr('ID');
                //If we got the answer right
                console.log('Selected answer: ' + selectedAnswer);
                if (selectedAnswer == rightAnswer) {
                    console.log('clicked right answer');
                    stopwatch.recordLap();
                    stopwatch.reset();
                    stopwatch.stop();
                    gameState.currentQuestionRight = true;
                    $(this).addClass('rightAnswer');
                    console.log('ID Selected ' + $(this).attr('ID'));
                    console.log('right answer ' + rightAnswer);
                    setTimerBar(0);
                    numRight++;
                    $("#messageBar").html('You got the question right!!<br/>');

                } else {
                    //If we got the answer wrong put a border around it and reset the display.
                    $(this).addClass('wrongAnswer');
                    stopwatch.reset();
                    stopwatch.recordLap();
                    gameState.currentQuestionRight = false;
                    stopwatch.stop();
                    $("#messageBar").html("Sorry but you got this answer wrong. :-(");
                    console.log('ID Selected ' + $(this).attr('ID'));
                    console.log('right answer ' + rightAnswer);
                    setTimerBar(0);
                    numWrong++;
                }

                //Write the num lost and the num won
                var stats = '<br/>';
                stats += '<b>Num Right: </b>' + numRight + '<br/>';
                stats += '<b>Num Wrong: </b>' + numWrong + '<br/>';
                $('#laps').html(stats);

                //Evaluate if there are anymore questions in the question bank
                //Do not allow anyone to do anything while we are waiting.
                console.log('Question Count: ' + questionCount);

                if ((questionCount <= questionBank.length) && !freezeScreen) {
                    freezeScreen = true;
                    setTimeout(function () {
                        gameState.waitingForAnswer = true;
                        displayQuestion();
                    }, 5000);

                    if (questionCount == (questionBank.length)) {
                        console.log('This is the final question');
                        gameState.inProgress = false;
                        gameState.waitingForAnswer = false;
                        $("#messageBar").html("GAME OVER!!");
                        gameState.gameOver = true;
                    }
                } else {
                    console.log('Evaluating the response as Game Over');
                    gameState.inProgress = false;
                    gameState.waitingForAnswer = false;
                    $("#messageBar").html("GAME OVER!!");
                    gameState.gameOver = true;
                }

            }

        }

        /**
         * This function takes no parms and initializes thhe game
         */
        function gameInit() {
            gameState.inProgress = false;
            gameState.currentQuestionRight = false;
            gameState.waitingForAnswer = false;

            stopwatch.stop();
            stopwatch.reset();
            numRight = 0;
            numWrong = 0;
            setProgressBar(0);
            setTimerBar(0);
            currentQuestionID = 0;
            gameState.gameOver = false;
            questionCount = 0;
            $('#qa').remove();
            $('#messageBar').text('');
            $('#laps').text('');

            console.log('game initialized');
        }

        /**
         * This function obtains a question from the question back and passes it to the calling function.
         * @return {Object}
         */
        function getQuestion() {

            //var randNum = getRandomInt(0, questionBank.length - 1);
            //console.log(questionBank[randNum]);
            var question = questionBank[currentQuestionID];
            console.log('---- Get Question');
            console.log(currentQuestionID);
            currentQuestionID++;
            return question;
        }

        /**
         * This function displays the question in the Your Questions section
         */
        function displayQuestion() {
            console.log('---- Display Question function');
            console.log(gameState);
            //Clear the question if there was one
            $('#qa').remove();

            //Display a question
            if (gameState.inProgress && gameState.waitingForAnswer) {
                gameState.waitingForAnswer = true;
                freezeScreen = false;
                stopwatch.start()
                questionCount++;

                //console.log(getQuestion());
                var currQ = getQuestion();
                var qp = $('#questionPanel');
                var qa = $('<div>'); //question & answer group
                qa.attr('ID', 'qa');
                var qh = $('<div>');
                qh.addClass('alert alert-info');
                qh.text(currQ.question);
                qa.append(qh);

                //This displays each answer line.
                for (var i = 0; i < currQ.answers.length; i++) {
                    var ans = $('<div>');
                    ans.addClass('answer');
                    ans.attr('id', i);
                    var icon = $('<span>');
                    //icon.addClass('glyphicon glyphicon-check answerIcon');
                    var text = $('<span>');
                    text.addClass('answerText');
                    text.append(displayAnswer(currQ.answers[i]));
                    icon.append(text);
                    ans.append(icon);
                    qa.append(ans);
                }
                qp.append(qa);

                //Have to bind the event after the item is created at run time
                $('.answer').bind('click', evaluateResponse);
                rightAnswer = currQ.rightAnswerID;
                console.log('---- Right Answer ID ' + currQ.rightAnswerID)
            }

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

        /**
         * This function creates an HTML formatted answer to be displayed.
         * @param answerTxt Text of the answer from the question object
         * @param answerId The Index of the particular answer
         * @returns {*|jQuery|HTMLElement}
         */
        function displayAnswer(answerTxt, answerId) {
            var answer = $('<span>');
            answer.attr('id', answerId);
            //answer.addClass('answer');
            answer.text(answerTxt);
            return answer
        }


    }
);




