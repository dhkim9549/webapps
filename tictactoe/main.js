/*
  File: main.js
  Abstract: JavaScript file for TicTacToe sample.
  
  Version: 1.0
  
  Disclaimer: IMPORTANT:  This Apple software is supplied to you by 
  Apple Inc. ("Apple") in consideration of your agreement to the
  following terms, and your use, installation, modification or
  redistribution of this Apple software constitutes acceptance of these
  terms.  If you do not agree with these terms, please do not use,
  install, modify or redistribute this Apple software.

  In consideration of your agreement to abide by the following terms, and
  subject to these terms, Apple grants you a personal, non-exclusive
  license, under Apple's copyrights in this original Apple software (the
  "Apple Software"), to use, reproduce, modify and redistribute the Apple
  Software, with or without modifications, in source and/or binary forms;
  provided that if you redistribute the Apple Software in its entirety and
  without modifications, you must retain this notice and the following
  text and disclaimers in all such redistributions of the Apple Software. 
  Neither the name, trademarks, service marks or logos of Apple Inc. 
  may be used to endorse or promote products derived from the Apple
  Software without specific prior written permission from Apple.  Except
  as expressly stated in this notice, no other rights or licenses, express
  or implied, are granted by Apple herein, including but not limited to
  any patent rights that may be infringed by your derivative works or by
  other works in which the Apple Software may be incorporated.

  The Apple Software is provided by Apple on an "AS IS" basis.  APPLE
  MAKES NO WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
  THE IMPLIED WARRANTIES OF NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS
  FOR A PARTICULAR PURPOSE, REGARDING THE APPLE SOFTWARE OR ITS USE AND
  OPERATION ALONE OR IN COMBINATION WITH YOUR PRODUCTS.

  IN NO EVENT SHALL APPLE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL
  OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) ARISING IN ANY WAY OUT OF THE USE, REPRODUCTION,
  MODIFICATION AND/OR DISTRIBUTION OF THE APPLE SOFTWARE, HOWEVER CAUSED
  AND WHETHER UNDER THEORY OF CONTRACT, TORT (INCLUDING NEGLIGENCE),
  STRICT LIABILITY OR OTHERWISE, EVEN IF APPLE HAS BEEN ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.
  
  Copyright (C) 2010 Apple Inc. All Rights Reserved.
*/

/***************************************/
/*         intial setup                */
/***************************************/
var board = new Array(9);

function init() {
  /* use touch events if they're supported, otherwise use mouse events */
  var down = "mousedown"; var up = "mouseup"; 
  if ('createTouch' in document) { down = "touchstart"; up ="touchend"; }
  
  /* add event listeners */
  document.querySelector("input.button").addEventListener(up, newGame, false);
  var squares = document.getElementsByTagName("td");
  for (var s = 0; s < squares.length; s++) {
    squares[s].addEventListener(down, function(evt){squareSelected(evt, getCurrentPlayer());}, false);
  }
  
  setInitialPlayer();
  newGame();
  
  /* create the board and set the initial player */
  //createBoard();
  //setInitialPlayer();
}


/****************************************************************************************/
/* creating or restoring a game board, adding Xs and Os to the board, saving game state */
/****************************************************************************************/
function createBoard() {

  document.getElementById('display').innerHTML = ""
  
  /* create a clean board */
  for (var i = 0; i < board.length; i++) {
    board[i] = "";                               
    document.getElementById(i).innerHTML = "";
  }
}

/*** call this function whenever a square is clicked or tapped ***/
function squareSelected(evt, currentPlayer) {
  var square = evt.target;
  
  if(document.getElementById('display').innerHTML != "") {
    alert("Sorry, the game is over.");
	return;
  }
  
  /* check to see if the square already contains an X or O marker */
  if (square.className.match(/marker/)) {
    alert("Sorry, that space is taken! Please choose another square.");
    return;
  }

  if(getCurrentPlayer() == 'X') {
    alert("Sorry, it's AI's turn! Please wait.");
	return;
  }

  /* if not already marked, mark the square, update the array that tracks our board, check for a winner, and switch players */
    fillSquareWithMarker(square, currentPlayer);
    updateBoard(square.id, currentPlayer);
    checkForWinner();
    switchPlayers(); 
	
  /* if the board is not full, let AI select a move */
  if (JSON.stringify(board).match(/,"",/)) {
    ajaxGo();
  }
}

/*** call this function when AI places a move ***/
function squareSelectedAI(move, currentPlayer) {
  
  fillSquareWithMarker(document.getElementById(move), currentPlayer);
  updateBoard(move, currentPlayer);
  checkForWinner();
  switchPlayers(); 
}

/*** call bada.ai for the AI's move ***/
function ajaxGo() {
  
  // Query AI for the move.
  var boardObj = new Object();
  boardObj.board = board;
  boardObj.currentPlayer = getCurrentPlayer();
  
	jQuery.ajax({
		type: "GET",
		url: "linkRequestStd.jsp",
		data: {
			board: JSON.stringify(boardObj)
		},
		datatype: "JSON",
		async: true,
		success: function(obj) {
			var data = JSON.parse(obj);
			console.log(obj);
			// Select AI's move
			squareSelectedAI(data.a, getCurrentPlayer())
		},
		complete: function(data) {
			console.log(data);
		},
		error: function(xhr, status, error) {
			alert("ERROR!!!");
		}
	});
}

/*** create an X or O div and append it to the square ***/
function fillSquareWithMarker(square, player) {
  var marker = document.createElement('div');
  /* set the class name on the new div to X-marker or O-marker, depending on the current player */
  marker.className = player + "-marker";
  square.appendChild(marker);
}

/*** update our array which tracks the state of the board, and write the current state to local storage ***/
function updateBoard(index, marker) {
  board[index] = marker;
}


/***********************************************************************************/
/* checking for and declaring a winner, after a square has been marked with X or O */
/***********************************************************************************/
/* Our Tic Tac Toe board, an array:
  0 1 2
  3 4 5
  6 7 8
*/
function declareWinner() {
  var display = document.getElementById('display');
  if(getCurrentPlayer() == 'X') {
    display.innerHTML = "bada.AI win!"
  } else if(getCurrentPlayer() == 'O') {
    display.innerHTML = "Human win!"
  }
}

function weHaveAWinner(a, b, c) {
  if ((board[a] === board[b]) && (board[b] === board[c]) && (board[a] != "" || board[b] != "" || board[c] != "")) {
    setTimeout(declareWinner(), 100);
    return true;
  }
  else
    return false;
}

function checkForWinner() {
  /* check rows */
  var a = 0; var b = 1; var c = 2;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=3; b+=3; c+=3;
  }
    
  /* check columns */
  a = 0; b = 3; c = 6;
  while (c < board.length) {
    if (weHaveAWinner(a, b, c)) {
      return;
    }
    a+=1; b+=1; c+=1;
  }

  /* check diagonal right */
  if (weHaveAWinner(0, 4, 8)) {
    return;
  }
  /* check diagonal left */
  if (weHaveAWinner(2, 4, 6)) {
    return;
  }
  
  /* if there's no winner but the board is full, ask the user if they want to start a new game */
  if (!JSON.stringify(board).match(/,"",/)) {
    document.getElementById('display').innerHTML = "It's a draw."
  }
}


/****************************************************************************************/
/* utilities for getting the current player, switching players, and creating a new game */
/****************************************************************************************/
function getCurrentPlayer() {
  var p = document.querySelector(".current-player");
  if(p == null) {
    return "";
  } else {
    return document.querySelector(".current-player").id;
  }
}

/* set the initial player, when starting a whole new game or restoring the game state when the page is revisited */
function setInitialPlayer() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");
  playerX.className = "";
  playerO.className = "";
    
  var lastPlayer = getCurrentPlayer();
  if (lastPlayer == 'X') {
    playerO.className = "current-player";
  }
  else {
    playerX.className = "current-player";
  }
}

function switchPlayers() {
  var playerX = document.getElementById("X");
  var playerO = document.getElementById("O");
  
  if (playerX.className.match(/current-player/)) {
    playerO.className = "current-player";
    playerX.className = "";
  }
  else {
    playerX.className = "current-player";
    playerO.className = "";
  }
}

function newGame() {  
  
  /* create a new game */
  createBoard();
  
  if(getCurrentPlayer() == 'X') {
    ajaxGo();
  }
}




