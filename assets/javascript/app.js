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
var timeRemaining = 0;
var initialTimeSet = 10;
var timeAllowed = 21;
var currentQuestionID = 0;
var rightAnswer = 0;

//  Variable that will hold our setInterval that runs the stopwatch
var intervalId;

//prevents the clock from being sped up unnecessarily
var clockRunning = false;

//Gamestate Object
var gameState = {
    inProgress: false,
    waitingForAnswer: false,
    currentQuestionRight: false,
    timeUp: false
};


$(document).ready(function () {
        gameInit();


//Click event handlers

        $('#startBtn').click(displayQuestion);
        $('#resetBtn').on('click', gameInit);

        function evaluateResponse() {

            console.log('---- Evaluate Response Function');
            if (gameState.waitingForAnswer) {
                gameState.waitingForAnswer = false;
                var selectedAnswer = $(this).attr('ID');
                if (selectedAnswer === rightAnswer) {
                    console.log('clicked right answer');
                    stopwatch.recordLap();
                    stopwatch.reset();
                    gameState.currentQuestionRight = true;
                    console.log('ID Selected ' + $(this).attr('ID'));
                    console.log('right answer ' + rightAnswer);
                } else {

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
         * @return {Object}
         */
        function getQuestion() {

            //var randNum = getRandomInt(0, questionBank.length - 1);
            //console.log(questionBank[randNum]);

            console.log('---- Get Question');
            console.log(currentQuestionID);
            currentQuestionID++;
            return questionBank[currentQuestionID];
        }

        /**
         * This function displays the question in the Your Questions section
         */
        function displayQuestion() {
            //start the game
            if (!gameState.inProgress) {
                gameState.inProgress = true;
                gameState.waitingForAnswer = true;
                stopwatch.start()

                console.log('---- Display Question');
                //console.log(getQuestion());
                var currQ = getQuestion();
                var qp = $('#questionPanel');
                var qh = $('<div>');
                qh.addClass('alert alert-info');
                qh.text(currQ.question);
                qp.append(qh);

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
                    qp.append(ans);
                }

                $('.answer').bind('click', event, evaluateResponse);
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

        function showNextQuestion() {

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

        /**
         * Our stopwatch object.
         * @type {{time: number, lap: number, lapText: Array, reset: reset, start: start, stop: stop, recordLap: recordLap, count: count, timeConverter: timeConverter}}
         */
        var stopwatch = {
            time: 0,
            lap: 1,
            lapText: [],

            reset: function () {
                stopwatch.time = 0;
                stopwatch.lap = 1;
                clockRunning = false;

                //  TODO: Change the "display" div to "00:00."
                $("#display").text("00:00");
                $("#laps").text("");
            },

            start: function () {
                //TODO: Use setInterval to start the count here and set the clock to running.
                if (!clockRunning) {
                    intervalId = setInterval(stopwatch.count, 1000);
                    clockRunning = true;
                }
            },
            stop: function () {
                //TODO: Use clearInterval to stop the count here and set the clock to not be running.
                clearInterval(intervalId);
            },

            recordLap: function () {
                //TODO: Get the current time, pass that into the stopwatch.timeConverter function,
                //        and save the result in a variable.
                var currentTime = stopwatch.timeConverter(stopwatch.time);
                //TODO: Add the current lap and time to the "laps" div.
                stopwatch.lapText.push("Lap " + stopwatch.lap + " Current Time: " + currentTime);
                $("#laps").html(stopwatch.lapText.join('<br/>'));
                //TODO: Increment lap by 1. Remember, we can't use "this" here.
                stopwatch.lap++;
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
    }
);




