// game.js for Perlenspiel 3.1

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-14 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

var G;

( function () {
	"use strict";

	G = {

		// Floor constant
		FLOOR_VALUE : 0,

		// Wall constant
		WALL_VALUE : 1,

		// Blue avatar constant
		BLUE_AVATAR_VALUE : 2,

		// Green avatar constant
		GREEN_AVATAR_VALUE : 3,

		// Blue goal constant
		BLUE_GOAL_VALUE : 4,

		// Green goal constant
		GREEN_GOAL_VALUE : 5,

		// Box constant
		BOX_VALUE : 6,

		// Box switch constant
		BOX_SWITCH_VALUE : 7,

		// Blue switch constant
		BLUE_SWITCH_VALUE : 8,

		// Green switch constant
		GREEN_SWITCH_VALUE : 9,

		// Door constant
		DOOR_VALUE : 10,

		// Floor color
		floorColor : 0xDCC49A,

		// Array for floor colors
		floorColorArray : [0xDCC49A, 0xE7D6B8, 0xD7BB8C, 0xE4CA7A, 0xEABD73],

		// Wall color
		wallColor : 0x5F5F5F,

		// Array for wall colors
		//wallColorArray : [0x5F5F5F, 0x4D6A71, 0x6F7E88, 0x526174, 0x555F7B],
		wallColorArray : [0x545454, 0x3C3C3C, 0x505050, 0x444444, 0x464646],

		// Blue avatar color
		blueAvatarColor : 0x303D74,

		// Green avatar color
		greenAvatarColor : 0x4B8307,

		// Goal color
		goalColor : 0xFFC90E,

		// Box color
		boxColor : 0x765200,

		// Switch color
		switchColor : 0xC3C3C3,

		// Floor border color
		floorBorderColor : 0xD0BCA6,

		// Wall border color
		wallBorderColor : 0x474747,

		// Array for level rotation
		levelRotation : [0,0,0],

		// Grid X value
		gridX : 20,

		// Grid Y value
		gridY : 20,

		// Blue avatar X
		blueAvatarX : -1,

		// Blue avatar Y
		blueAvatarY: -1,

		// Green avatar X
		greenAvatarX : -1,

		// Green avatar Y
		greenAvatarY : -1,

		// X-coord of Blue goal
		blueGoalX : -1,

		// Y-coord of Blue goal
		blueGoalY : -1,

		// X-coord of Green goal
		greenGoalX : -1,

		// Y-coord of Green goal
		greenGoalY: -1,

		// Length of borders around certain objects
		borderWidth : 3,

		// The current avatar that the player is controlling
		isControllingBlue : true,

		// True if blue is on its goal
		blueOnGoal : false,

		// True if green is on its goal
		greenOnGoal : false,

		// The array that maps pressure plates to the door
		pressurePlates : new Array(),

		// Number of pressure plates in the level
		numberOfPlates : 0,

		// Indicates the current level
		currentLevel : 0,

		// True if tutorial step 1 is complete
		isStep1Complete : false,

		// True if tutorial step 2 is complete
		isStep2Complete : false,

		// True if tutorial step 3 is complete
		isStep3Complete : false,

		// True if tutorial step 4 is complete
		isStep4Complete : false,

		// Sets a custom set of audio options
		makeAudioPath : function() {
			//var path = document.location.pathname;
			//var dir = "file:///C:/" + path.substring(path.indexOf('/', 1)+1, path.lastIndexOf('/'));
			//dir += "/audio/";
			var audioOptions;

            var location = "~" + document.location.pathname.substring(0,document.location.pathname.lastIndexOf("\\")+1) + "/audio/";

			audioOptions = {
					volume: 0.5,
					loop: false,
					lock: true,
					path: location,
					fileTypes: ["mp3", "ogg", "wav"]
			}


			return audioOptions;
		},

		// Makes customs audio options for music
		makeMusicOptions : function() {
			//var path = document.location.pathname;
			//var dir = "file:///C:/" + path.substring(path.indexOf('/', 1)+1, path.lastIndexOf('/'));
			//dir += "/audio/";
			var location = "~" + document.location.pathname.substring(0,document.location.pathname.lastIndexOf("\\")+1) + "/audio/";
			var musicOptions;

			musicOptions = {
				volume: 0.5,
				loop: true,
				lock: true,
				path: location,
				fileTypes: ["mp3", "ogg", "wav"]
			}


			return musicOptions;
		},

		// Puts the current avatar at the given position
		placeAvatar : function (x, y){
			if (G.isControllingBlue) {
				var plateId;
				plateId = G.findPressurePlate(G.blueAvatarX, G.blueAvatarY);
				if (G.isOnPlate(G.blueAvatarX, G.blueAvatarY, G.BLUE_AVATAR_VALUE)){
					G.deactivatePressurePlate(plateId);
					PS.data(G.blueAvatarX, G.blueAvatarY, G.pressurePlates[plateId].plateType);
				}
				else if (plateId > 0 ){
					PS.data(G.blueAvatarX, G.blueAvatarY, G.pressurePlates[plateId].plateType);
				}
				if((G.blueAvatarX === G.greenGoalX) && (G.blueAvatarY === G.greenGoalY)) {
					PS.border(G.greenGoalX, G.greenGoalY, G.borderWidth);
					PS.borderColor(G.greenGoalX, G.greenGoalY, G.greenAvatarColor);
				}
				PS.gridPlane(1);
				PS.alpha(x, y, 255);
				G.blueAvatarX = x;
				G.blueAvatarY = y;
				PS.color(x, y, G.blueAvatarColor);
				PS.border(x, y, G.borderWidth);
				PS.borderColor(x, y, PS.COLOR_BLACK);
				PS.data(x, y, G.BLUE_AVATAR_VALUE);
				PS.gridPlane(0);
				if(G.blueOnGoal) {
					G.blueOnGoal = false;
					PS.border(G.blueGoalX, G.blueGoalY, G.borderWidth);
					PS.borderColor(G.blueGoalX, G.blueGoalY, G.blueAvatarColor);
				}
			}
			else {
				var plateId;
				plateId = G.findPressurePlate(G.greenAvatarX, G.greenAvatarY);
				if((G.greenAvatarX === G.blueGoalX) && (G.greenAvatarY === G.blueGoalY)) {
					PS.border(G.blueGoalX, G.blueGoalY, G.borderWidth);
					PS.borderColor(G.blueGoalX, G.blueGoalY, G.blueAvatarColor);
				}
				if (G.isOnPlate(G.greenAvatarX, G.greenAvatarY, G.GREEN_AVATAR_VALUE)){
					G.deactivatePressurePlate(plateId);
					PS.data(G.greenAvatarX, G.greenAvatarY, G.pressurePlates[plateId].plateType);
				}
				else if (plateId > 0){
					PS.data(G.greenAvatarX, G.greenAvatarY, G.pressurePlates[plateId].plateType);
				}
				PS.gridPlane(1);
				G.greenAvatarX = x;
				G.greenAvatarY = y;
				PS.color(x, y, G.greenAvatarColor);
				PS.border(x, y, G.borderWidth);
				PS.borderColor(x, y, PS.COLOR_BLACK);
				PS.data(x, y, G.GREEN_AVATAR_VALUE);
				PS.alpha(x, y, 255);
				PS.gridPlane(0);
				if(G.greenOnGoal) {
					G.greenOnGoal = false;
					PS.border(G.greenGoalX, G.greenGoalY, G.borderWidth);
					PS.borderColor(G.greenGoalX, G.greenGoalY, G.greenAvatarColor);
				}
			}
		},

		placeBox : function(boxX, boxY, nx, ny){
			if (G.isOnPlate(boxX, boxY, G.BOX_VALUE)){
				var plateId = G.findPressurePlate(boxX, boxY);
				G.deactivatePressurePlate(plateId);
				PS.data(boxX, boxY, G.pressurePlates[plateId].plateType);
			}
			PS.glyph(nx, ny, PS.DEFAULT);
			PS.gridPlane(1);
			PS.alpha(nx, ny, 255);
			PS.color(nx, ny, G.boxColor);
			PS.data(nx, ny, G.BOX_VALUE);
			PS.gridPlane(0);
		},

		// Sets up a location for the avatar to move
		setupAvatarPlace : function(newAvatarX, newAvatarY) {
			PS.gridPlane(1);
			var plateId;
			if (G.isControllingBlue) {
				// If not on a pressure plate
				plateId = G.findPressurePlate(G.blueAvatarX, G.blueAvatarY);
				if (plateId === -1) {
					PS.color(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
					PS.border(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
					PS.borderColor(G.blueAvatarX, G.blueAvatarY, G.floorBorderColor);
					PS.alpha(G.blueAvatarX, G.blueAvatarY, 0);
					PS.data(G.blueAvatarX, G.blueAvatarY, G.FLOOR_VALUE);
				}
				else {
					PS.color(G.blueAvatarX, G.blueAvatarY, G.switchColor);
					switch(G.pressurePlates[plateId].plateType){
						case G.BLUE_SWITCH_VALUE:
						{
							PS.border (G.blueAvatarX, G.blueAvatarY, G.borderWidth);
							PS.borderColor(G.blueAvatarX, G.blueAvatarY, G.blueAvatarColor);
							PS.data(G.blueAvatarX, G.blueAvatarY, G.BLUE_SWITCH_VALUE);
							break;
						}
						case G.GREEN_SWITCH_VALUE:
						{
							PS.border(G.blueAvatarX, G.blueAvatarY, G.borderWidth);
							PS.borderColor(G.blueAvatarX, G.blueAvatarY, G.greenAvatarColor);
							PS.data(G.blueAvatarX, G.blueAvatarY, G.GREEN_SWITCH_VALUE);
							break;
						}
						case G.BOX_SWITCH_VALUE:
						{
							PS.border(G.blueAvatarX, G.blueAvatarY, G.borderWidth);
							PS.borderColor(G.blueAvatarX, G.blueAvatarY, G.boxColor);
							PS.data(G.blueAvatarX, G.blueAvatarY, G.BOX_SWITCH_VALUE);
							break;
						}
					}
				}
			}
			else {
				// TODO Change if switch
				plateId = G.findPressurePlate(G.greenAvatarX, G.greenAvatarY);
				if (plateId === -1) {
					PS.color(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
					PS.border(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
					PS.borderColor(G.greenAvatarX, G.greenAvatarY, G.floorBorderColor);
					PS.alpha(G.greenAvatarX, G.greenAvatarY, 0);
					PS.data(G.greenAvatarX, G.greenAvatarY, G.FLOOR_VALUE);
				}
				else {
					PS.color(G.greenAvatarX, G.greenAvatarY, G.switchColor);
					switch(G.pressurePlates[plateId].plateType){
						case G.BLUE_SWITCH_VALUE:
						{
							PS.border (G.greenAvatarX, G.greenAvatarY, G.borderWidth);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, G.blueAvatarColor);
							PS.data(G.greenAvatarX, G.greenAvatarY, G.BLUE_SWITCH_VALUE);
							break;
						}
						case G.GREEN_SWITCH_VALUE:
						{
							PS.border(G.greenAvatarX, G.greenAvatarY, G.borderWidth);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, G.greenAvatarColor);
							PS.data(G.greenAvatarX, G.greenAvatarY, G.GREEN_SWITCH_VALUE);
							break;
						}
						case G.BOX_SWITCH_VALUE:
						{
							PS.border(G.greenAvatarX, G.greenAvatarY, G.borderWidth);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, G.boxColor);
							PS.data(G.greenAvatarX, G.greenAvatarY, G.BOX_SWITCH_VALUE);
							break;
						}
					}
				}
			}
			PS.gridPlane(0);
			G.placeAvatar(newAvatarX, newAvatarY);
		},

		// Move function to move the player avatar when in play mode
		moveAvatar : function (x, y){
			var nx, ny, data;

			if (!G.isStep1Complete && G.currentLevel === 0){
				G.isStep1Complete = true;
				PS.statusText("Push the box onto the grey switch");
			}

			if (G.isControllingBlue) {
				nx = G.blueAvatarX + x;
				ny = G.blueAvatarY + y;
			}
			else {
				nx = G.greenAvatarX + x;
				ny = G.greenAvatarY + y;
			}

			// If the move is leaving the maze board, return without moving
			if ( ( nx < 0 ) || ( nx >= G.gridX ) ||
				( ny < 0 ) || ( ny >= G.gridY ) ) {
				return;
			}

			// If the move hits a wall or the other avatar, return without moving
			data = PS.data(nx, ny, PS.CURRENT);

			if (data === G.WALL_VALUE || data === G.BLUE_AVATAR_VALUE || data === G.GREEN_AVATAR_VALUE
				|| data === G.DOOR_VALUE){
				PS.audioPlay("fx_hoot");
				return;
			}
			// If the avatar hits a box, call the boxMove function
			else if (data === G.BOX_VALUE) {
				var wasBoxMoved = G.moveBox(nx, ny, x, y);
				// If the box was able to move, then the avatar moves, otherwise return
				if (wasBoxMoved){
					G.setupAvatarPlace(nx, ny);
					if(((nx === G.blueGoalX) && (ny === G.blueGoalY)) ||
						((nx === G.greenGoalX) && (ny === G.greenGoalY))) {
						G.checkGoals(nx, ny);
					}
					var plateId = G.findPressurePlate(nx, ny);
					if (plateId >= 0){
						var plate = G.pressurePlates[plateId];
						if (plate.plateType === G.BLUE_SWITCH_VALUE && G.isControllingBlue){
							G.activatePressurePlate(plateId);
						}
						else if (plate.plateType === G.GREEN_SWITCH_VALUE && !G.isControllingBlue){
							G.activatePressurePlate(plateId);
						}
					}
				}
				else {
					return;
				}
			}

			// If the avatar hits a goal, check to see who is on which switch
			//else if ((data === G.BLUE_GOAL_VALUE) || (data === G.GREEN_GOAL_VALUE)) {
			else if(((nx === G.blueGoalX) && (ny === G.blueGoalY)) ||
					((nx === G.greenGoalX) && (ny === G.greenGoalY))) {
				G.setupAvatarPlace(nx, ny);
				G.checkGoals(nx, ny);
			}

			// If the hits a switch matches his color, call activateSwitch
			else if ((data === G.BLUE_SWITCH_VALUE && G.isControllingBlue) || (data === G.GREEN_SWITCH_VALUE && !G.isControllingBlue)){
				var i;
				// Find which pressure plate in the array is the one that has been stepped on
				for (i = 0; i < G.numberOfPlates; i+= 1){
					if ((G.pressurePlates[i].plateX === nx) && (G.pressurePlates[i].plateY === ny)){
						if (G.pressurePlates[i].plateType === G.GREEN_SWITCH_VALUE && !G.isStep4Complete && G.currentLevel === 0){
							PS.statusText("Move avatars to respective to gold beads");
						}
						G.activatePressurePlate(i);
						PS.audioPlay("fx_blast4");
						break;
					}
				}
				G.setupAvatarPlace(nx, ny);
			}

			// Legal move, so erase avatars current location and move it
			else {
				G.setupAvatarPlace(nx, ny);
			}
		},

		// Move function for boxes, called when an avatar pushes it
		// Returns true if box was moved, false otherwise
		moveBox : function(x, y, avatarMoveX, avatarMoveY){
			var nx, ny, data;

			// Avatar moves right
			if(avatarMoveX === 1) {
				nx = x + 1;
				ny = y;
			}

			// Avatar moves left
			if(avatarMoveX === -1) {
				nx = x - 1;
				ny = y;
			}

			// Avatar moves down
			if(avatarMoveY === 1) {
				nx = x;
				ny = y + 1;
			}

			// Avatar moves up
			if(avatarMoveY === -1) {
				nx = x;
				ny = y - 1;
			}

			// Now see if the box can be moved
			data = PS.data(nx, ny, PS.CURRENT);
			if((data === G.BLUE_AVATAR_VALUE) || (data === G.GREEN_AVATAR_VALUE) || (data === G.WALL_VALUE)
				|| (data === G.DOOR_VALUE) || (data === G.BOX_VALUE)) {
				// Box was not moved.
				PS.audioPlay("fx_hoot");
				return false;
			}
			else if (data === G.BOX_SWITCH_VALUE){
				var i;
				for (i = 0; i < G.numberOfPlates; i += 1){
					var doorX = G.pressurePlates[i].doorX;
					if ((G.pressurePlates[i].plateX === nx) && (G.pressurePlates[i].plateY === ny)){
						G.activatePressurePlate(i);
						PS.audioPlay("fx_blast4");
						break;
					}
				}
				G.placeBox(x, y, nx, ny);
				PS.audioPlay("fx_blast3");
				return true;
			}
			else {
				// Else the spot is open
				G.placeBox(x, y, nx, ny);
				PS.audioPlay("fx_blast3");
				return true;

			}
		},

		// Adds a pressure plate to the map and the array
		// x = the x coordinate of the pressure plate
		// y = the y coordinate of the pressure plate
		// dX = the x coordinate of the door associated with the plate
		// dY = the y coordinate of the door associated with the plate
		// lengthX = the width of the door
		// lengthY = the height of the door
		// type = the type of pressure plate it is
		addPressurePlate : function (x, y, dX, dY, lengthX, lengthY, type){
			var pressurePlate = {
				doorX : dX,
				doorY : dY,
				doorLengthX : lengthX,
				doorLengthY : lengthY,
				plateType : type,
				plateX : x,
				plateY : y
			};
			PS.color(x, y, G.switchColor);
			switch(type){
				case G.BLUE_SWITCH_VALUE:
				{
					PS.border(x, y, G.borderWidth);
					PS.borderColor(x, y, G.blueAvatarColor);
					PS.data(x, y, G.BLUE_SWITCH_VALUE);
					break;
				}
				case G.GREEN_SWITCH_VALUE:
				{
					PS.border(x, y, G.borderWidth);
					PS.borderColor(x, y, G.greenAvatarColor);
					PS.data(x, y, G.GREEN_SWITCH_VALUE);
					break;
				}
				case G.BOX_SWITCH_VALUE:
				{
					PS.border(x, y, G.borderWidth);
					PS.borderColor(x, y, G.boxColor);
					PS.data(x, y, G.BOX_SWITCH_VALUE);
					break;
				}
			}
			G.pressurePlates[G.numberOfPlates] = pressurePlate;
			G.numberOfPlates += 1;
		},

		// Draws a door at the given location with the given length and height
		drawDoor : function(doorX, doorY, length, height){
			PS.gridPlane(1);
			var i, j, width;
			if (length > 0){
				for (i = doorX; i < (doorX + length); i++){
					PS.color(i, doorY, G.wallColor);
					width = {
						top : 5,
						left : 0,
						bottom : 5,
						right : 0
					};
					PS.border(i, doorY, width);
					PS.borderColor(i, doorY, G.floorColor);
					PS.data(i, doorY, G.DOOR_VALUE);
					PS.alpha(i, doorY, 255);
				}
			}
			else if (height > 0){
				for (j = doorY; j < (doorY + height); j++){
					PS.color(doorX, j, G.wallColor);
					width = {
						top : 0,
						left : 5,
						bottom : 0,
						right : 5
					};
					PS.border(doorX, j, width);
					PS.borderColor(doorX, j, G.floorColor);
					PS.data(doorX, j, G.DOOR_VALUE);
					PS.alpha(doorX, j, 255);
				}
			}
			PS.gridPlane(0);
		},

		// Checks if the avatars are on their goals
		checkGoals : function(goalX, goalY) {
			var data;

			if((goalX === G.greenGoalX) && (goalY === G.greenGoalY)) {
				data = G.GREEN_GOAL_VALUE;
			}
			// This will be blue always if we get here
			else {
				data = G.BLUE_GOAL_VALUE;
			}
			// Now we check to see if the goals are stepped on.
			if((data === G.GREEN_GOAL_VALUE) && (!G.isControllingBlue)) {
				// If we get here, the green character is on green goal
				G.greenOnGoal = true;
				PS.audioPlay("fx_coin3");
			}
			else if((data === G.BLUE_GOAL_VALUE) && (G.isControllingBlue)) {
				G.blueOnGoal = true;
				PS.audioPlay("fx_coin3");
			}
			if(G.greenOnGoal && G.blueOnGoal) {
				PS.statusText("Level Complete!");
				G.loadNextLevel();
				//PS.audioPlay("fx_tada");
				PS.audioPlay( "fanfare", G.makeAudioPath() );
				// TODO go to next level
			}
		},

		// Activates a pressure plate, called when the correct object moves on top of it
		// plateId = the value used to get the plate from the array of pressure plate
		activatePressurePlate : function(plateId){
			var plate = G.pressurePlates[plateId];
			var i;
			if (!G.isStep2Complete && G.currentLevel === 0){
				PS.statusText("Switch to green by hitting space bar");
				G.isStep2Complete = true;
			}
			if (plate.doorLengthX > 0) {
				for (i = plate.doorX; i < (plate.doorX + plate.doorLengthX); i += 1){
					PS.gridPlane(1);
					G.drawFloor(i, plate.doorY);
					PS.border(i, plate.doorY, PS.DEFAULT);
					PS.gridPlane(0);
				}
			}
			else if (plate.doorLengthY > 0){
				for (i = plate.doorY; i < (plate.doorY + plate.doorLengthY); i += 1){
					PS.gridPlane(1);
					G.drawFloor(plate.doorX, i);
					PS.border(plate.doorX, i, PS.DEFAULT);
					PS.gridPlane(0);
				}
			}
		},

		// Called when something moves off of a pressure plate, restores the door associated with it
		deactivatePressurePlate : function(plateId){
			var plate = G.pressurePlates[plateId];
			var i, data;
			var somethingInDoorway = false;
			var typeInDoorway, inDoorwayX, inDoorwayY;
			PS.audioPlay("fx_bang");
			if (plate.doorLengthX > 0) {
				for (i = plate.doorX; i < plate.doorX + plate.doorLengthX; i += 1){
					data = PS.data(i, plate.doorY);
					if (data === G.BOX_VALUE || data === G.BLUE_AVATAR_VALUE || data === G.GREEN_AVATAR_VALUE){
						somethingInDoorway = true;
						typeInDoorway = data;
						inDoorwayX = i;
						inDoorwayY = plate.doorY;
						if (data !== G.BOX_VALUE){
							PS.audioPlay("fx_wilhelm");
						}
					}
				}
			}
			else if (plate.doorLengthY > 0){
				for (i = plate.doorY; i < plate.doorY  + plate.doorLengthY; i += 1){
					data = PS.data(plate.doorX, i);
					if (data === G.BOX_VALUE || data === G.BLUE_AVATAR_VALUE || data === G.GREEN_AVATAR_VALUE){
						somethingInDoorway = true;
						typeInDoorway = data;
						inDoorwayX = plate.doorX;
						inDoorwayY = i;
						if (data !== G.BOX_VALUE){
							PS.audioPlay("fx_wilhelm");
						}
					}
				}
			}
			if (!somethingInDoorway) {
				G.drawDoor(plate.doorX, plate.doorY, plate.doorLengthX, plate.doorLengthY);
			}
			else if (typeInDoorway === G.BLUE_AVATAR_VALUE){
				// If it is a horizontal door, push the avatar up or down
				if (plate.doorLengthX > 0){
					if (PS.data(G.blueAvatarX, G.blueAvatarY + 1, PS.CURRENT) === G.FLOOR_VALUE){
						var wasControllingBlue = true;
						if (G.isControllingBlue === false) {
							G.isControllingBlue = true;
							wasControllingBlue = false;
						}
						G.moveAvatar(0, 1);
						if (!wasControllingBlue) {
							G.isControllingBlue = false;
						}
						PS.border(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
						PS.borderColor(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
					}
					else if (PS.data(G.blueAvatarX, G.blueAvatarY - 1, PS.CURRENT) === G.FLOOR_VALUE){
						var wasControllingBlue = true;
						if (G.isControllingBlue === false) {
							G.isControllingBlue = true;
							wasControllingBlue = false;
						}
						G.moveAvatar(0, -1);
						if (!wasControllingBlue) {
							G.isControllingBlue = false;
						}
						PS.border(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
						PS.borderColor(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
					}
				}
				else if (plate.doorLengthY > 0){
					if (PS.data(G.blueAvatarX + 1, G.blueAvatarY, PS.CURRENT) === G.FLOOR_VALUE){
						var wasControllingBlue = true;
						if (G.isControllingBlue === false) {
							G.isControllingBlue = true;
							wasControllingBlue = false;
						}
						G.moveAvatar(1, 0);
						if (!wasControllingBlue) {
							G.isControllingBlue = false;
						}
						PS.border(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
						PS.borderColor(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
					}
					else if (PS.data(G.blueAvatarX - 1, G.blueAvatarY, PS.CURRENT) === G.FLOOR_VALUE){
						var wasControllingBlue = true;
						if (G.isControllingBlue === false) {
							G.isControllingBlue = true;
							wasControllingBlue = false;
						}
						G.moveAvatar(-1, 0);
						if (!wasControllingBlue) {
							G.isControllingBlue = false;
						}
						PS.border(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
						PS.borderColor(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
					}
				}
				G.drawDoor(plate.doorX, plate.doorY, plate.doorLengthX, plate.doorLengthY);
			}
			else if (typeInDoorway === G.GREEN_AVATAR_VALUE) {
				// If it is a horizontal door, push the avatar up or down
				if (plate.doorLengthX > 0) {
					if (PS.data(G.greenAvatarX, G.greenAvatarY + 1, PS.CURRENT) === G.FLOOR_VALUE) {
						var wasControllingGreen = true;
						if (G.isControllingBlue === true) {
							G.isControllingBlue = false;
							wasControllingGreen = false;
						}
						G.moveAvatar(0, 1);
						if (!wasControllingGreen) {
							G.isControllingBlue = true;
						}
						if (G.isControllingBlue) {
							PS.border(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
						}
					}
					else if (PS.data(G.greenAvatarX, G.greenAvatarY - 1, PS.CURRENT) === G.FLOOR_VALUE) {
						var wasControllingGreen = true;
						if (G.isControllingBlue === true) {
							G.isControllingBlue = false;
							wasControllingGreen = false;
						}
						G.moveAvatar(0, -1);
						if (!wasControllingGreen) {
							G.isControllingBlue = true;
						}
						if (G.isControllingBlue) {
							PS.border(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
						}
					}
				}
				else if (plate.doorLengthY > 0) {
					if (PS.data(G.greenAvatarX + 1, G.greenAvatarY, PS.CURRENT) === G.FLOOR_VALUE) {
						var wasControllingGreen = true;
						if (G.isControllingBlue === true) {
							G.isControllingBlue = false;
							wasControllingGreen = false;
						}
						G.moveAvatar(1, 0);
						if (!wasControllingGreen) {
							G.isControllingBlue = true;
						}
						if (G.isControllingBlue) {
							PS.border(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
						}
					}
					else if (PS.data(G.greenAvatarX - 1, G.greenAvatarY, PS.CURRENT) === G.FLOOR_VALUE) {
						var wasControllingGreen = true;
						if (G.isControllingBlue === true) {
							G.isControllingBlue = false;
							wasControllingGreen = false;
						}
						G.moveAvatar(-1, 0);
						if (!wasControllingGreen) {
							G.isControllingBlue = true;
						}
						if (G.isControllingBlue) {
							PS.border(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
							PS.borderColor(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
						}
					}
				}
				G.drawDoor(plate.doorX, plate.doorY, plate.doorLengthX, plate.doorLengthY);
			}
			else if (typeInDoorway === G.BOX_VALUE){
				if (plate.doorLengthX > 0){
					if (PS.data(plate.doorX, plate.doorY - 1, PS.CURRENT) === G.FLOOR_VALUE){
						G.moveBox(plate.doorX, plate.doorY, 0, -1);
					}
					else if (PS.data(plate.doorX, plate.doorY + 1, PS.CURRENT) === G.FLOOR_VALUE){
						G.moveBox(plate.doorX, plate.doorY, 0, 1);
					}
				}
				else if (plate.doorLengthY > 0){
					if (PS.data(plate.doorX - 1, plate.doorY, PS.CURRENT) === G.FLOOR_VALUE){
						G.moveBox(plate.doorX, plate.doorY, -1, 0);
					}
					else if (PS.data(plate.doorX + 1, plate.doorY, PS.CURRENT) === G.FLOOR_VALUE){
						G.moveBox(plate.doorX, plate.doorY, 1, 0);
					}
				}
				G.drawDoor(plate.doorX, plate.doorY, plate.doorLengthX, plate.doorLengthY);
			}

			PS.data(plate.plateX, plate.plateY, plate.plateType);
		},

		// Draws walls along the edge of the grid.
		drawEdges : function() {
			var i, j, wallArrayID;
			for (i = 0; i < G.gridX; i+=1) {
				for (j = 0; j < G.gridY; j+=1) {
					if((i === 0) || (i === G.gridX - 1) || (j === 0) || (j === G.gridY - 1)) {
						PS.gridPlane(1);
						PS.alpha(i, j, 255);
						wallArrayID = Math.floor(Math.random() * 5);
						PS.color(i, j, G.wallColorArray[wallArrayID]);
						PS.data(i, j, G.WALL_VALUE);
						PS.gridPlane(0);
						PS.borderColor(i, j, G.wallBorderColor);
					}
				}
			}
		},

		// Checks if the specified object is on a pressure plate. Returns true if the object is on a plate that matches it
		isOnPlate : function(x, y, type){
			var plate, i;
			var onPlate = false;
			for (i = 0; i < G.numberOfPlates; i += 1){
				if ((G.pressurePlates[i].plateX === x) && (G.pressurePlates[i].plateY === y)){
					plate = G.pressurePlates[i];
					onPlate = true;
				}
			}
			if (onPlate){
				if (((plate.plateType === G.BLUE_SWITCH_VALUE) && (type === G.BLUE_AVATAR_VALUE)) ||
						((plate.plateType === G.GREEN_SWITCH_VALUE) && (type === G.GREEN_AVATAR_VALUE)) ||
						((plate.plateType === G.BOX_SWITCH_VALUE) && (type === G.BOX_VALUE))){
					return true;
				}
				else {
					return false;
				}
			}
		},

		// Returns the pressure plate id based on the coordinates, returns -1 if there is no pressure plate at
		// the given coordinates
		findPressurePlate: function(x, y){
			var i;
			for (i = 0; i < G.numberOfPlates; i += 1){
				if ((G.pressurePlates[i].plateX === x) && (G.pressurePlates[i].plateY === y)){
					return i;
				}
			}
			return -1;
		},

		// Draws a Green Avatar at the specified location x,y
		drawGreenAvatar : function(x,y) {
			PS.data(x, y, G.GREEN_AVATAR_VALUE);
			PS.gridPlane(1);
			PS.alpha(x, y, 255);
			PS.color(x, y, G.greenAvatarColor);
			G.greenAvatarX = x;
			G.greenAvatarY = y;
			PS.gridPlane(0);
			PS.color(x,y, G.floorColor);
		},

		// Draws a Blue Avatar at the specified location x,y
		drawBlueAvatar : function(x,y) {
			PS.data(x, y, G.BLUE_AVATAR_VALUE);
			PS.gridPlane(1);
			PS.alpha(x, y, 255);
			PS.color(x, y, G.blueAvatarColor);
			PS.border(x, y, G.borderWidth);
			PS.borderColor(x, y, PS.COLOR_BLACK);
			G.blueAvatarX = x;
			G.blueAvatarY = y;
			PS.gridPlane(0);
			PS.color(x,y, G.floorColor);
		},

		// Draw a box at the specified location x,y
		drawBox : function(x ,y) {
			PS.data(x,y, G.BOX_VALUE);
			PS.gridPlane(1);
			PS.alpha(x, y, 255);
			PS.color(x, y, G.boxColor);
			PS.gridPlane(0);
			PS.color(x, y, G.floorColor);
		},

		//Draws the Blue Goal at a specified location x,y
		drawBlueGoal : function(x, y) {
			PS.data(x, y, G.BLUE_GOAL_VALUE);
			G.blueGoalX = x;
			G.blueGoalY = y;
			PS.color(x,y, G.goalColor);
			PS.border(x,y,3);
			PS.borderColor(x,y, G.blueAvatarColor);
		},

		// Draws the Green Goal at a specified location x,y
		drawGreenGoal : function(x, y) {
			PS.data(x,y, G.GREEN_GOAL_VALUE);
			G.greenGoalX = x;
			G.greenGoalY = y;
			PS.color(x,y, G.goalColor);
			PS.border(x,y,3);
			PS.borderColor(x,y, G.greenAvatarColor);
		},

		// Draws a floor at the specified x,y
		drawFloor : function(x, y) {
			var floorArrayID;
			PS.borderColor(x, y, G.floorBorderColor);
			floorArrayID = Math.floor(Math.random() * 5);
			PS.data(x, y, G.FLOOR_VALUE);
			PS.color(x, y, G.floorColorArray[floorArrayID]);
		},

		// Draws a wall at the specified x,y
		drawWall : function(x, y) {
			var wallArrayID;
			PS.gridPlane(1);
			PS.alpha(x, y, 255);
			wallArrayID = Math.floor(Math.random() * 5);
			PS.color(x, y, G.wallColorArray[wallArrayID]);
			PS.data(x, y, G.WALL_VALUE);
			PS.borderColor(x, y, G.wallBorderColor);
			PS.gridPlane(0);
		},

		//Draws the tutorial level
		drawTutorial : function() {
			PS.borderColor(PS.ALL, PS.ALL, G.floorBorderColor);
			G.currentLevel = 0;

			var i,j;

			for (i = 0; i < G.gridX; i += 1){
				for (j = 0; j < G.gridY; j += 1){
					G.drawFloor(i, j);
				}
			}

			// First draw the world borders
			G.drawEdges();

			// Clear the PressurePlate array
			while(G.pressurePlates > 0) {
				G.pop();
			}

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Use the arrow keys to control the blue bead");

			// Hide the gridlines
			//PS.border(PS.ALL, PS.ALL, 0);

			// Now fill in all the walls
			// NOTE: Ordinary levels are 20x20, the tutorial is 14x18,
			// so need to "resize"
			for(i = 1; i < G.gridX-1; i+=1) {
				for(j = 1; j < G.gridY-1; j+=1){
					if(i===1 || i===2 || i===3 || i=== G.gridX-2 || i === G.gridX-3 || i === G.gridX-4) {
						G.drawWall(i, j);
					}
					else if(j===1 || j=== G.gridY-2) {
						G.drawWall(i, j);

					}
					else if(i===10)  {
						if(j!==9 && j!==10) {
							G.drawWall(i,j);
						}
					}
					else if(j===12) {
						if(i > 10 && i < 16 && i!==13) {
							G.drawWall(i,j);
						}
					}
				}
			}

			// Lastly fill place all the other objects
			for(i = 1; i < G.gridX-1; i+=1) {
				for(j = 1; j < G.gridY-1; j+=1) {
					if(j === 2) {
						if(i === 6) {
							G.drawBlueGoal(i ,j);
						}
						if(i === 13) {
							G.drawGreenGoal(i, j);
						}
					}
					else if(j === 5) {
						if(i === 4) {
							G.addPressurePlate(i, j, 10, 9, 0, 2, G.BLUE_SWITCH_VALUE);
						}
						if(i === 8) {
							G.addPressurePlate(i, j, 10, 5, 0, 2, G.GREEN_SWITCH_VALUE);
						}
						if (i === 10){
							G.drawDoor(i, j, 0, 2);
						}
					}
					else if(j === 9) {
						if(i === 10) {
							G.drawDoor(i, j, 0, 2);
						}
					}
					else if(j === 12) {
						if(i === 13) {
							G.drawDoor(i, j, 1, 0);
						}
					}
					else if(j === 13) {
						if(i === 12) {
							G.addPressurePlate(i, j, 13, 12, 1, 0, G.BOX_SWITCH_VALUE);
						}
						if(i === 14) {
							G.drawBox(i, j);
						}
					}
					else if(j === 17) {
						if(i === 6) {
							G.drawGreenAvatar(i, j);
						}
						if(i === 13) {
							G.drawBlueAvatar(i, j);
						}
					}
				}
			}
		},

		// Draw the level Boxed In
		drawLevelOne : function() {
			PS.borderColor(PS.ALL, PS.ALL, G.floorBorderColor);
			G.currentLevel = 1;

			var i,j;

			// First draw the world borders
			G.drawEdges();

			// Clear the PressurePlate array
			while(G.pressurePlates > 0) {
				G.pop();
			}

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Boxed In");

			// Hide the gridlines
			//PS.border(PS.ALL, PS.ALL, 0);

			for (i = 1; i < G.gridX - 1; i += 1){
				for(j = 1; j < G.gridY - 1; j += 1){
					G.drawFloor(i,j);
				}
			}

			// Draw the inner walls and floors
			for(i = 1; i < G.gridX-1; i+=1) {
				for(j = 1; j < G.gridY-1; j+=1) {
					if(j === 3) {
						if( i > 11 && i < 18) {
							G.drawWall(i,j);
						}
					}
					else if(j === 4) {
						if( i === 12 || i === 17) {
							G.drawWall(i,j);
						}
					}
					else if(j === 5) {
						if( i > 7 && i < 13 || i === 17) {
							G.drawWall(i,j);
						}
					}
					else if(j === 6 && i === 17) {
						G.drawWall(i,j);
					}
					else if(j === 7) {
						if(i === 6 || i === 8 || i === 10 || (i > 11 && i < 18)) {
							G.drawWall(i,j);
						}
					}
					else if(j === 8) {
						if(i === 6 || i === 12) {
							G.drawWall(i,j);
						}
					}
					else if(j === 9) {
						if(i === 6 || i === 8 || i === 10 || i === 12) {
							G.drawWall(i,j);
						}
					}
					else if(j === 11) {
						if( i > 7 && i < 11 ) {
							G.drawWall(i,j);
						}
					}
					else if(j === 15) {
						if( i > 2 && i < 18 ) {
							G.drawWall(i,j);
						}
					}
					else if(j === 16 && i == 7) {
						G.drawWall(i,j);
					}
					else if(j === 17 ) {
						if(i > 6 && i < 14 && i !== 10) {
							G.drawWall(i,j);
						}
					}
					else if(j === 18 && i === 13) {
						G.drawWall(i,j);
					}
				}
			}

			// Now draw the rest of the game objects
			for(i = 1; i < G.gridX-1; i+=1) {
				for(j = 1; j < G.gridY-1; j+=1) {
					if(j === 5) {
						if (i === 15) {
							G.drawGreenAvatar(i,j);
						}
					}
					else if(j === 6) {
						if(i === 12) {
							G.drawDoor(i,j,0,1);
						}
					}
					else if(j === 7) {
						if (i === 9) {
							G.drawBox(i,j);
						}
					}
					else if(j === 8) {
						if (i === 8 || i === 10) {
							G.drawBox(i,j);
						}
						else if(i === 9) {
							G.drawBlueAvatar(i,j);
						}
					}
					else if(j === 9) {
						if(i === 9) {
							G.drawBox(i,j);
						}
					}
					else if(j === 10) {
						if(i === 9) {
							G.addPressurePlate(i,j,12,6,0,1, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 12) {
						if(i === 1) {
							G.addPressurePlate(i,j,1,15,2,0, G.BLUE_SWITCH_VALUE);
						}
					}
					else if(j === 15) {
						if(i === 1) {
							G.drawDoor(i,j,2,0);
						}
						else if(i === 17) {
							G.drawDoor(i,j,2,0);
						}
					}
					else if(j === 16) {
						if(i === 10) {
							G.drawBox(i,j);
						}
					}
					else if(j === 17) {
						if(i === 1) {
							G.drawBlueGoal(i,j);
						}
						else if(i === 6) {
							G.addPressurePlate(i,j,17,15,2,0, G.GREEN_SWITCH_VALUE);
						}
						else if(i === 10) {
							G.drawBox(i,j);
						}
						else if(i === 18) {
							G.drawGreenGoal(i,j);
						}
					}
					else if(j === 18) {
						if(i === 10) {
							G.drawBox(i,j);
						}
					}
				}
			}
		},

		// Draws the level Breakout
		drawLevelTwo : function() {
			PS.borderColor(PS.ALL, PS.ALL, G.floorBorderColor);
			G.currentLevel = 2;

			var i,j;

			// First draw the world borders
			G.drawEdges();

			// Clear the PressurePlate array
			while(G.pressurePlates > 0) {
				G.pop();
			}

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Breakout!");

			// Hide the gridlines
			//PS.border(PS.ALL, PS.ALL, 0);

			for (i = 1; i < G.gridX - 1; i += 1){
				for (j = 1; j < G.gridY - 1; j += 1){
					G.drawFloor(i, j);
				}
			}

			// First draw the walls
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 1) {
						if( i === 5) {
							G.drawWall(i,j);
						}
					}
					else if(j === 2) {
						if( i === 5) {
							G.drawWall(i,j);
						}
					}
					else if(j === 3) {
						if( i === 3 || i === 5) {
							G.drawWall(i,j);
						}
					}
					else if(j === 4) {
						if((i > 0) && (i < 6) && (i !== 4)){
							G.drawWall(i,j);
						}
						else if((i > 12) && (i < 19)) {
							G.drawWall(i,j);
						}
					}
					else if(j > 4 && j < 7) {
						if(i === 3 || i === 13) {
							G.drawWall(i, j);
						}
					}
					else if(j === 7) {
						if(i > 2 && i < 6 || i === 13) {
							G.drawWall(i,j);
						}
					}
					else if(j === 8) {
						if(i === 5) {
							G.drawWall(i,j);
						}
					}
					else if(j === 9) {
						if(i === 5 || i === 13) {
							G.drawWall(i,j);
						}
					}
					else if(j === 10) {
						if(((i > 0) && (i < 6)) || ((i > 12) && (i < 19))) {
							G.drawWall(i,j);
						}
					}
					else if(j === 11) {
						if(i === 4 || i === 13) {
							G.drawWall(i,j);
						}
					}
					else if(j === 12) {
						if(i === 4) {
							G.drawWall(i,j);
						}
					}
					else if(j === 13) {
						if(i === 13) {
							G.drawWall(i,j);
						}
					}
					else if(j === 14) {
						if(((i > 0) && (i < 5)) || ((i > 12) && (i < 19))) {
							G.drawWall(i,j);
						}
					}
					else if(j === 15) {
						if(i === 13) {
							G.drawWall(i,j);
						}
					}
					else if(j === 16) {
						if(i === 13) {
							G.drawWall(i,j);
						}
					}
					else if(j === 18) {
						if(i === 13) {
							G.drawWall(i,j);
						}
					}
				}
			}

			// Now place the rest of the game objects
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 2) {
						if(i === 2) {
							G.drawBlueAvatar(i,j);
						}
						else if(i === 16) {
							G.drawGreenAvatar(i,j);
						}
					}
					else if(j === 3) {
						if(i === 4) {
							G.drawDoor(i,j,1,0);
						}
					}
					else if(j === 5) {
						if(i === 4) {
							G.addPressurePlate(i,j,4,3,1,0, G.BOX_SWITCH_VALUE);
						}
						else if(i === 6) {
							G.drawBox(i,j);
						}
						else if(i === 16) {
							G.addPressurePlate(i,j,13,17,0,1, G.GREEN_SWITCH_VALUE);
						}
					}
					else if(j === 6) {
						if(i === 6) {
							G.drawBox(i,j);
						}
					}
					else if(j === 7) {
						if(i === 16) {
							G.drawGreenGoal(i,j);
						}
					}
					else if(j === 8) {
						if(i === 13) {
							G.drawDoor(i,j,0,1);
						}
					}
					else if(j === 11) {
						if(i === 6) {
							G.addPressurePlate(i,j,13,12,0,1, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 12) {
						if(i === 2) {
							G.drawBox(i,j);
						}
						else if(i === 13) {
							G.drawDoor(i,j,0,1);
						}
						else if(i === 16) {
							G.addPressurePlate(i,j,13,8,0,1, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 13) {
						if(i === 4) {
							G.drawDoor(i,j,0,1);
						}
					}
					else if(j === 14) {
						if(i === 6) {
							G.addPressurePlate(i,j,4,13,0,1, G.GREEN_SWITCH_VALUE);
						}
					}
					else if(j === 17) {
						if(i === 13) {
							G.drawDoor(i,j,0,1);
						}
						else if(i === 16) {
							G.drawBlueGoal(i,j);
						}
					}
				}
			}
		},

		// Draws the level Hallway Hijinks
		drawLevelThree : function() {
			PS.borderColor(PS.ALL, PS.ALL, G.floorBorderColor);
			G.currentLevel = 3;

			var i,j;

			// First draw the world borders
			G.drawEdges();

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Hallway Hijinks");

			// Hide the gridlines
			//PS.border(PS.ALL, PS.ALL, 0);

			for (i = 1; i < G.gridX - 1; i += 1) {
				for (j = 1; j < G.gridY - 1; j += 1) {
					G.drawFloor(i, j);
				}
			}

			// Place the walls
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(i === 10) {
						if(j !== 15 && j !== 16 && j!== 17) {
							G.drawWall(i,j);
						}
					}
					else if(i === 12) {
						if(j > 10 && j < 18) {
							G.drawWall(i,j);
						}
					}
					if(j === 4) {
						if(!((i > 3 && i < 7) || (i > 15 && i < 19))){
							G.drawWall(i,j);
						}
					}
					else if(j === 8) {
						if(i > 13 && i < 19) {
							G.drawWall(i,j);
						}
					}
					else if(j === 9){
						if(i === 7 || i === 8) {
							G.drawWall(i,j);
						}
					}
					else if(j === 10) {
						if(i === 8){
							G.drawWall(i,j);
						}
					}
					else if(j === 11) {
						if((i > 0 && i < 7) || (i > 7 && i < 13)) {
							G.drawWall(i, j);
						}
					}
				}
			}

			// Place other game objects
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 1) {
						if(i === 1) {
							G.drawBlueGoal(i,j);
						}
						else if( i === 3) {
							G.drawDoor(i,j,0,3);
						}
						else if(i === 7) {
							G.drawDoor(i,j,0,3);
						}
						else if(i === 18) {
							G.drawGreenGoal(i,j);
						}
					}
					else if(j === 2) {
						if(i === 8) {
							G.drawBox(i,j);
						}
						else if( i === 12) {
							G.addPressurePlate(i,j,3,1,0,3, G.GREEN_SWITCH_VALUE);
						}
					}
					else if(j === 4) {
						if(i === 16) {
							G.drawDoor(i,j,3,0);
						}
					}
					else if(j === 5) {
						if(i === 9) {
							G.addPressurePlate(i,j,16,4,3,0, G.BLUE_SWITCH_VALUE);
						}
					}
					else if(j === 6) {
						if(i === 2) {
							G.drawBox(i,j);
						}
					}
					else if(j === 8) {
						if(i === 9) {
							G.addPressurePlate(i,j,11,8,3,0, G.BOX_SWITCH_VALUE);
						}
						else if( i === 11) {
							G.drawDoor(i,j,3,0);
						}
					}
					else if(j === 10) {
						if( i === 9) {
							G.addPressurePlate(i,j,13,11,6,0, G.BOX_SWITCH_VALUE);
						}
						else if(i === 12) {
							G.addPressurePlate(i,j,7,1,0,3, G.GREEN_SWITCH_VALUE);
						}
					}
					else if(j === 11) {
						if(i === 7) {
							G.drawDoor(i,j,1,0);
						}
						else if(i === 13) {
							G.drawDoor(i,j,6,0);
						}
					}
					else if(j === 12) {
						if(i === 11) {
							G.addPressurePlate(i,j,7,11,1,0, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 15 || j === 16 || j === 17) {
						if(i === 10) {
							G.drawBox(i,j);
						}
					}
					else if(j === 18) {
						if(i === 1) {
							G.drawBlueAvatar(i,j);
						}
						else if(i === 18) {
							G.drawGreenAvatar(i,j);
						}
					}
				}
			}
		},

		// Draws the level 4 Door and 7 Years Ago
		drawLevelFour : function() {
			PS.borderColor(PS.ALL, PS.ALL, G.floorBorderColor);
			G.currentLevel = 4;

			var i,j;

			// First draw the world borders
			G.drawEdges();

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Four Door and Seven Years Ago...");

			// Hide the gridlines
			//PS.border(PS.ALL, PS.ALL, 0);

			for (i = 1; i < G.gridX - 1; i += 1){
				for(j = 1; j < G.gridY - 1; j += 1){
					G.drawFloor(i,j);
				}
			}
			// Place the walls
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 1) {
						if(i === 11) {
							G.drawWall(i,j);
						}
					}
					else if(j === 2) {
						if((i > 1 && i < 7) || (i === 8 || i === 9 || i === 11)) {
							G.drawWall(i,j);
						}
					}
					else if(j === 3) {
						if(i === 2 || i === 6 || i === 11) {
							G.drawWall(i,j);
						}
					}
					else if(j === 4) {
						if(i === 2 || i === 3 || i === 9 || i === 11) {
							G.drawWall(i,j);
						}
					}
					else if(j === 5) {
						if(i == 2 || i === 3 || (i > 4 && i < 10) || (i > 10 && i < 17 && i !== 13)) {
							G.drawWall(i,j);
						}
					}
					else if(j === 6) {
						if( i === 11 || i === 17) {
							G.drawWall(i,j);
						}
					}
					else if(j === 7) {
						if(i !== 9 && i !== 14 && i !== 15 && i !== 16) {
							G.drawWall(i,j);
						}
					}
					else if(j === 8) {
						if(i === 17) {
							G.drawWall(i,j);
						}
					}
					else if(j === 11) {
						if(i !== 3 && i !== 4 && i !== 8 && i!== 9 && i !== 10 && i !== 16) {
							G.drawWall(i,j);
						}
					}
					else if(j === 12) {
						if(i === 7 || i === 11 || i === 12 || i === 15) {
							G.drawWall(i,j);
						}
					}
					else if(j === 13) {
						if(i === 5 || i === 6 || i === 7 || i == 11 || i === 12) {
							G.drawWall(i,j);
						}
					}
					else if(j === 14) {
						if(i === 3 || i === 4 || i === 7 || i === 11 || i === 12 || i === 14 || i === 16) {
							G.drawWall(i,j);
						}
					}
					else if(j === 15 || j === 16) {
						if(i === 3 || i === 7 || i === 11 || i === 12 || i === 14) {
							G.drawWall(i,j);
						}
					}
					else if(j === 17) {
						if(i === 7 || i === 11 || (i > 13 && i < 19)) {
							G.drawWall(i,j);
						}
					}
					else if(j === 18) {
						if(i === 7 || i === 11) {
							G.drawWall(i,j);
						}
					}
				}
			}

			// Place game objects
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 2) {
						if(i === 13) {
							G.addPressurePlate(i,j,9,7,1,0, G.BLUE_SWITCH_VALUE);
						}
						else if(i === 15) {
							G.drawBox(i,j);
						}
						else if(i === 17) {
							G.addPressurePlate(i,j,8,14,3,0, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 3) {
						if(i === 3) {
							G.addPressurePlate(i,j,8,13,3,0, G.BOX_SWITCH_VALUE);
						}
						else if(i === 9) {
							G.drawBox(i,j);
						}
					}
					else if(j === 6) {
						if(i === 14 || i === 16) {
							G.drawBox(i,j);
						}
					}
					else if(j === 7) {
						if(i === 9) {
							G.drawDoor(i,j,1,0);
						}
					}
					else if(j === 8) {
						if(i === 14 || i === 15 || i === 16) {
							G.drawBox(i,j);
						}
					}
					else if(j === 11) {
						if(i === 16) {
							G.drawDoor(i,j,1,0);
						}
					}
					else if(j === 12) {
						if(i === 8) {
							G.drawGreenAvatar(i,j);
						}
						else if(i === 10){
							G.drawBlueAvatar(i,j);
						}
					}
					else if(j === 13) {
						if(i === 8) {
							G.drawDoor(i,j,3,0);
						}
					}
					else if(j === 14) {
						if(i === 5) {
							G.addPressurePlate(i,j,8,15,3,0, G.BOX_SWITCH_VALUE);
						}
						else if(i === 8) {
							G.drawDoor(i,j,3,0);
						}
					}
					else if(j === 15) {
						if(i === 8){
							G.drawDoor(i,j,3,0);
						}
						else if(i === 15 || i === 17) {
							G.drawBox(i,j);
						}
					}
					else if(j === 16) {
						if(i === 8) {
							G.drawDoor(i,j,3,0);
						}
					}
					else if(j === 17) {
						if(i === 5) {
							G.addPressurePlate(i,j,16,11,1,0, G.GREEN_SWITCH_VALUE);
						}
					}
					else if(j === 18) {
						if(i === 8) {
							G.drawBlueGoal(i, j);
						}
						else if(i === 10) {
							G.drawGreenGoal(i, j);
						}
						else if(i === 18) {
							G.addPressurePlate(i,j,8,16,3,0, G.BOX_SWITCH_VALUE);
						}
					}
				}
			}

		},

		// Draws the boombox level
		drawLevelFive : function() {
			PS.borderColor(PS.ALL, PS.ALL, G.floorBorderColor);
			G.currentLevel = 5;

			var i,j;

			// First draw the world borders
			G.drawEdges();

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("The Boombox");

			// Hide the gridlines
			//PS.border(PS.ALL, PS.ALL, 0);

			for (i = 1; i < G.gridX - 1; i += 1){
				for(j = 1; j < G.gridY - 1; j += 1){
					G.drawFloor(i,j);
				}
			}

			// Place the walls
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 2 || j === 17) {
						if(i > 8 && i < 19) {
							G.drawWall(i,j);
						}
					}
					else if(j === 3 || j === 16) {
						if(i === 5 || i === 6 || i ===9 || i === 10 || i === 13
						|| i === 17 || i === 18) {
							G.drawWall(i,j);
						}
					}
					else if(j === 4 || j === 15) {
						if(i === 6 || i === 9 || i === 10) {
							G.drawWall(i,j);
						}
					}
					else if(j === 5) {
						if(i === 6 || i === 9 || i === 10 || i === 13 || i === 17) {
							G.drawWall(i,j);
						}
					}
					else if(j === 6 || j === 12 ) {
						if((i > 0 && i < 4) || i === 5 || i === 6 || (i > 6 && i < 15) || i === 16) {
							G.drawWall(i,j);
						}
					}
					else if(j === 7 || j === 11) {
						if(i === 3 || (i > 4 && i < 15) || i === 16 || i === 17) {
							G.drawWall(i,j);
						}
					}
					else if(j === 8 || j === 10) {
						if( i === 6 || i === 14 || i === 16) {
							G.drawWall(i,j);
						}
					}
					else if(j === 13) {
						if((i > 0 && i < 4) || i === 5 || i === 6 || (i > 8 && i < 15) || i === 16) {
							G.drawWall(i,j);
						}
					}
					else if(j === 14) {
						if(i === 6 || i === 9 || i === 10 || i === 13 || i === 17) {
							G.drawWall(i,j);
						}
					}
				}
			}

			// Place game objects
			for(i = 1; i < G.gridX - 1; i += 1) {
				for(j = 1; j < G.gridY - 1; j += 1) {
					if(j === 1) {
						if(i === 5) {
							G.drawDoor(i,j,0,2);
						}
					}
					else if(j === 2) {
						if(i === 2) {
							G.addPressurePlate(i, j, 13, 4, 0, 1, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 4) {
						if(i === 11) {
							G.addPressurePlate(i,j,5,1,0,2, G.BOX_SWITCH_VALUE);
						}
						else if(i === 12) {
							G.drawBox(i,j);
						}
						else if(i === 13) {
							G.drawDoor(i,j,0,1);
						}
						else if(i === 15) {
							G.addPressurePlate(i,j,4,7,1,0, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 5) {
						if(i === 7) {
							G.addPressurePlate(i,j,6,9,0,1, G.BOX_SWITCH_VALUE);
							PS.glyph(i,j,0x264F);
						}
					}
					else if(j === 7) {
						if(i === 2) {
							G.addPressurePlate(i,j,18,7,1,0, G.BLUE_SWITCH_VALUE);
						}
						else if(i===4) {
							G.drawDoor(i,j,1,0);
						}
						else if(i === 18) {
							G.drawDoor(i,j,1,0);
						}
					}
					else if(j === 8) {
						if( i === 4){
							G.drawBox(i,j);
						}
						if(i === 6) {
							PS.glyph(i,j,0x264F);
						}
						else if(i === 9 || i === 11) {
							G.drawDoor(i,j,0,3);
						}
						else if(i === 10) {
							G.drawBlueGoal(i,j);
						}
						else if(i === 14) {
							PS.glyph(i,j,0x2648);
						}
					}
					else if(j === 9) {
						if(i === 1){
							G.drawBlueAvatar(i,j);
						}
						else if(i === 5 || i === 16) {
							G.drawBox(i,j);
						}
						else if(i === 6 || i === 14) {
							G.drawDoor(i,j,0,1);
						}
						else if(i === 8) {
							G.addPressurePlate(i,j,9,8,0,3, G.BOX_SWITCH_VALUE);
						}
						else if(i === 12) {
							G.addPressurePlate(i,j,11,8,0,3, G.BOX_SWITCH_VALUE);
						}
						else if(i === 18) {
							G.drawGreenAvatar(i,j);
						}
					}
					else if(j === 10) {
						if(i === 4) {
							G.drawBox(i,j);
						}
						else if(i === 6) {
							PS.glyph(i,j,0x264F);
						}
						else if(i === 10) {
							G.drawGreenGoal(i,j);
						}
						else if(i === 14) {
							PS.glyph(i,j,0x2648);
						}
					}
					else if(j === 11) {
						if(i === 2) {
							G.addPressurePlate(i,j,18,11,1,0, G.BLUE_SWITCH_VALUE);
						}
						else if(i === 4){
							G.drawDoor(i,j,1,0);
						}
						else if(i === 18) {
							G.drawDoor(i,j,1,0);
						}
					}
					else if(j === 13) {
						if(i === 7) {
							G.addPressurePlate(i,j,14,9,0,1, G.BOX_SWITCH_VALUE);
							PS.glyph(i,j,0x2648);
						}
					}
					else if(j === 15) {
						if(i === 11) {
							G.addPressurePlate(i,j,5,17,0,2, G.BOX_SWITCH_VALUE);
						}
						else if(i === 12) {
							G.drawBox(i,j);
						}
						else if(i === 13) {
							G.drawDoor(i,j,0,1);
						}
						else if(i === 15) {
							G.addPressurePlate(i,j,4,11,1,0, G.BOX_SWITCH_VALUE);
						}
					}
					else if(j === 17) {
						if(i === 2) {
							G.addPressurePlate(i,j,13,15,0,1, G.BOX_SWITCH_VALUE);
						}
						else if(i === 5) {
							G.drawDoor(i,j,0,2);
						}
					}
				}
			}
		},

		// Draws the level Master and Commander.
		drawLevelSix : function() {
			G.currentLevel = 6;

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Master and Commander");

			G.drawEdges();
			var levelArray = [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
				0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0,
				0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0,
				0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0,
				0, 0, 1, 1, 1, 1, 0, 6, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0,
				0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1,
				0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 1, 0, 0, 0, 6, 0, 0, 0, 1, 0, 0, 0, 0,
				1, 1, 1, 0, 0, 1, 0, 0, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0,
				1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1,
				1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 6, 0, 1, 0, 1,
				1, 1, 1, 1, 0, 0, 0, 1, 0, 4, 1, 0, 1, 0, 1, 1, 0, 1,
				1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1,
				1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1,
				1, 1, 1, 1, 1, 5, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
				1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 3, 1, 1, 1, 0, 0, 1];
			var i, j, arrayPos;
			arrayPos = 0;
			for (j = 1; j < G.gridY - 1; j += 1){
				for (i = 1; i < G.gridX - 1; i += 1){
					switch(levelArray[arrayPos]) {
						case G.FLOOR_VALUE:
						{
							G.drawFloor(i, j);
							break;
						}
						case G.WALL_VALUE:
						{
							G.drawWall(i, j);
							break;
						}
						case G.BLUE_AVATAR_VALUE:
						{
							G.drawBlueAvatar(i, j);
							break;
						}
						case G.GREEN_AVATAR_VALUE:
						{
							G.drawGreenAvatar(i, j);
							break;
						}
						case G.BLUE_GOAL_VALUE:
						{
							G.drawBlueGoal(i, j);
							break;
						}
						case G.GREEN_GOAL_VALUE:
						{
							G.drawGreenGoal(i, j);
							break;
						}
						case G.BOX_VALUE:
						{
							G.drawBox(i, j);
							break;
						}
					}
					arrayPos += 1;
				}
			}
			// Draw the doors and pressure plates
			// Door + plate 1
			G.drawDoor(14, 14, 1, 0);
			G.addPressurePlate(11, 10, 14, 14, 1, 0, G.BOX_SWITCH_VALUE);

			// Door + plate 2
			G.drawDoor(13, 17, 0, 1);
			G.addPressurePlate(14, 17, 13, 17, 0, 1, G.BOX_SWITCH_VALUE);

			// Door + plate 3
			G.drawDoor(16, 4, 0, 1);
			G.addPressurePlate(11, 8, 16, 4, 0, 1, G.BOX_SWITCH_VALUE);

			// Door + plate 4
			G.drawDoor(15, 2, 1, 0);
			G.addPressurePlate(13, 8, 15, 2, 1, 0, G.BLUE_SWITCH_VALUE);

			// Door + plate 5
			G.drawDoor(8, 6, 1, 0);
			G.addPressurePlate(17, 4, 8, 6, 1, 0, G.BOX_SWITCH_VALUE);

			// Door + plate 6
			G.drawDoor(12, 4, 0, 2);
			G.addPressurePlate(8, 5, 12, 4, 0, 2, G.BOX_SWITCH_VALUE);

			// Door + plate 7
			G.drawDoor(5, 2, 0, 1);
			G.addPressurePlate(8, 8, 5, 2, 0, 1, G.BOX_SWITCH_VALUE);

			// Door + plate 8
			G.drawDoor(1, 5, 2, 0);
			G.addPressurePlate(7, 7, 1, 5, 2, 0, G.BLUE_SWITCH_VALUE);

			// Door + plate 9
			G.drawDoor(5, 4, 0, 1);
			G.addPressurePlate(8, 10, 5, 4, 0, 1, G.BOX_SWITCH_VALUE);

			// Door + plate 10
			G.drawDoor(9, 12, 2, 0);
			G.addPressurePlate(5, 16, 9, 12, 2, 0, G.BOX_SWITCH_VALUE);
		},

		clearBoard : function(){
			var i, j;
			for (i = 0; i < G.numberOfPlates; i += 1){
				G.pressurePlates[i] = null;
			}
			G.numberOfPlates = 0;
			for (i = 0; i < G.gridX; i += 1){
				for (j = 0; j < G.gridY; j += 1){
					PS.data(i, j, G.FLOOR_VALUE);
					PS.color(i, j, G.floorColor);
					PS.border(i, j, PS.DEFAULT);
					PS.borderColor(i, j, PS.DEFAULT);
					PS.gridPlane(1);
					PS.alpha(i, j, 0);
					PS.color(i, j, PS.DEFAULT);
					PS.gridPlane(0);
					PS.glyph(PS.ALL, PS.ALL, PS.DEFAULT);
				}
			}
		},


		drawLevelSeven : function(){
			G.currentLevel = 7;

			// Other initialization
			G.blueOnGoal = false;
			G.greenOnGoal = false;
			G.isControllingBlue = true;

			// Put the level's witty status message up top.
			PS.statusText("Watergate by Josh Allard");

			G.drawEdges();
			var levelArray = [2, 3, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
				6, 0, 1, 6, 6, 6, 6, 6, 1, 1, 1, 0, 1, 0, 6, 0, 0, 0,
				0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 0, 1, 1,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
				0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 1, 0, 6, 6, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 6, 6, 0, 1, 0,
				0, 1, 0, 0, 0, 0, 0, 0, 0, 6, 0, 1, 0, 6, 6, 6, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 0, 6, 0, 1, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 1, 0, 1, 1, 1, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
				6, 6, 6, 0, 6, 6, 6, 1, 0, 0, 5, 1, 0, 0, 0, 0, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				6, 6, 6, 0, 6, 6, 6, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 6,
				6, 6, 6, 0, 6, 6, 6, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];
			var i, j, arrayPos;
			arrayPos = 0;
			for (j = 1; j < G.gridY - 1; j += 1){
				for (i = 1; i < G.gridX - 1; i += 1){
					switch(levelArray[arrayPos]) {
						case G.FLOOR_VALUE:
						{
							G.drawFloor(i, j);
							break;
						}
						case G.WALL_VALUE:
						{
							G.drawWall(i, j);
							break;
						}
						case G.BLUE_AVATAR_VALUE:
						{
							G.drawBlueAvatar(i, j);
							break;
						}
						case G.GREEN_AVATAR_VALUE:
						{
							G.drawGreenAvatar(i, j);
							break;
						}
						case G.BLUE_GOAL_VALUE:
						{
							G.drawBlueGoal(i, j);
							break;
						}
						case G.GREEN_GOAL_VALUE:
						{
							G.drawGreenGoal(i, j);
							break;
						}
						case G.BOX_VALUE:
						{
							G.drawBox(i, j);
							break;
						}
					}
					arrayPos += 1;
				}
			}

			// Draw door + plate 1
			G.drawDoor(2, 6, 0, 1);
			G.addPressurePlate(1, 5, 2, 6, 0, 1, G.BOX_SWITCH_VALUE);

			// Draw door + plate 2
			G.drawDoor(3, 2, 0, 1);
			G.addPressurePlate(4, 1, 3, 2, 0, 1, G.BOX_SWITCH_VALUE);

			// Draw door + plate 3
			G.drawDoor(12, 4, 1, 0);
			G.addPressurePlate(9, 4, 12, 4, 1, 0, G.BLUE_SWITCH_VALUE);

			// Draw door + plate 4
			G.drawDoor(13, 7, 1, 0);
			G.addPressurePlate(12, 6, 13, 7, 1, 0, G.BOX_SWITCH_VALUE);

			// Draw door + plate 5
			G.drawDoor(4, 6, 0, 1);
			G.addPressurePlate(1, 6, 4, 6, 0, 1, G.BOX_SWITCH_VALUE);

			// Draw door + plate 6
			G.drawDoor(9, 2, 0, 1);
			G.addPressurePlate(10, 1, 9, 2, 0, 1, G.BOX_SWITCH_VALUE);

			// Draw door + plate 7
			G.drawDoor(13, 12, 1, 0);
			G.addPressurePlate(16, 11, 13, 12, 1, 0, G.BOX_SWITCH_VALUE);
			PS.glyph(16, 11, 0x264B);
			PS.glyph(12, 12, 0x264B);
			PS.glyph(14, 12, 0x264B);

			// Draw door + plate 8
			G.drawDoor(17, 11, 0, 1);
			G.addPressurePlate(16, 9, 17, 11, 0, 1, G.BOX_SWITCH_VALUE);

			// Draw door + plate 9
			G.drawDoor(18, 12, 1, 0);
			G.addPressurePlate(18, 15, 18, 12, 1, 0, G.BOX_SWITCH_VALUE);
			PS.glyph(18, 15, 0x2650);
			PS.glyph(17, 12, 0x2650);
			PS.glyph(19, 12, 0x2650);

			// Draw door + plate 11
			G.drawDoor(10, 17, 0, 1);
			G.addPressurePlate(18, 14, 10, 17, 0, 1, G.BOX_SWITCH_VALUE);
			PS.glyph(18, 14, 0x2649);
			PS.glyph(10, 16, 0x2649);
			PS.glyph(10, 18, 0x2649);

			// Draw door + plate 12
			G.drawDoor(8, 10, 0, 1);
			G.addPressurePlate(7, 9, 8, 10, 0, 1, G.BLUE_SWITCH_VALUE);

			// Draw door + plate 13
			G.drawDoor(8, 12, 0, 1);
			G.addPressurePlate(9, 13, 8, 12, 0, 1, G.GREEN_SWITCH_VALUE);

			// Draw door + plate 14
			G.drawDoor(1, 11, 1, 0);
			G.addPressurePlate(4, 16, 1, 11, 1, 0, G.BOX_SWITCH_VALUE);

			// Draw door + plate 15
			G.drawDoor(1, 10, 1, 0);
			G.addPressurePlate(4, 14, 1, 10, 1, 0, G.BOX_SWITCH_VALUE);
		},

		loadNextLevel : function() {
			G.clearBoard();
			switch(G.currentLevel){
				case 0:
				{
					G.drawLevelOne();
					break;
				}
				case 1:
				{
					G.drawLevelTwo();
					break;
				}
				case 2:
				{
					G.drawLevelThree();
					break;
				}
				case 3:
				{
					G.drawLevelFour();
					break;
				}
				case 4:
				{
					G.drawLevelFive();
					break;
				}
				case 5:
				{
					G.drawLevelSix();
					break;
				}
				case 6:
				{
					G.drawLevelSeven();
					break;
				}
				case 7:
				{
					G.currentLevel = 0;
					G.drawTutorial();
					break;
				}
			}
		}
	};
}() );
PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize(G.gridX, G.gridY);

	// Preload the audio
	PS.audioLoad( "fx_hoot" );
	PS.audioLoad( "fx_powerup4" );
	PS.audioLoad( "fx_blast3" );
	PS.audioLoad( "fx_blast4" );
	PS.audioLoad( "fx_tada" );
	PS.audioLoad( "fx_bang" );
	PS.audioLoad( "fx_wilhelm" );
	PS.audioLoad( "fx_coin3" );
	PS.audioLoad( "fanfare", G.makeAudioPath() );
	PS.audioLoad( "music", G.makeMusicOptions() );

	// Draw the first level
	G.drawTutorial();
	PS.audioPlay( "music", G.makeMusicOptions() );
	//G.drawLevelOne();
	//G.drawLevelTwo();
	//G.drawLevelThree();
	//G.drawLevelFour();
	//G.drawLevelFive();
	//G.drawLevelSix();

};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on -the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	switch (key) {
		// If the spacebar is pressed, switch control of the avatars
		case 32:
		{
			if (!G.isStep3Complete && G.currentLevel === 0){
				PS.statusText("Move to the green switch to open door");
				G.isStep3Complete = true;
			}
			// Change borders to indicate the currently selected bead
			if(G.isControllingBlue) {
				PS.border(G.greenAvatarX, G.greenAvatarY, G.borderWidth);
				PS.border(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
				PS.borderColor(G.greenAvatarX, G.greenAvatarY, PS.COLOR_BLACK);
				PS.borderColor(G.blueAvatarX, G.blueAvatarY, PS.DEFAULT);
			}
			else {
				PS.border(G.blueAvatarX, G.blueAvatarY, G.borderWidth);
				PS.border(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
				PS.borderColor(G.greenAvatarX, G.greenAvatarY, PS.DEFAULT);
				PS.borderColor(G.blueAvatarX, G.blueAvatarY, PS.COLOR_BLACK);
			}

			G.isControllingBlue = !G.isControllingBlue;
			PS.audioPlay("fx_powerup5");
			break;
		}
		case PS.KEY_ARROW_UP:
		{
			// Code to move the avatar being controlled up
			G.moveAvatar(0, -1);
			break;
		}
		case PS.KEY_ARROW_DOWN:
		{
			// Code to move the avatar being controlled down
			G.moveAvatar(0, 1);
			break;
		}
		case PS.KEY_ARROW_LEFT:
		{
			// Code to move the avatar being controlled left
			G.moveAvatar(-1, 0);
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		{
			// Code to move the avatar being controlled right
			G.moveAvatar(1, 0);
			break;
		}
		case 114:
		{
			// Restart the current level
			G.clearBoard();
			switch(G.currentLevel){
				case 0:
				{
					G.drawTutorial();
					break;
				}
				case 1:
				{
					G.drawLevelOne();
					break;
				}
				case 2:
				{
					G.drawLevelTwo();
					break;
				}
				case 3:
				{
					G.drawLevelThree();
					break;
				}
				case 4:
				{
					G.drawLevelFour();
					break;
				}
				case 5:
				{
					G.drawLevelFive();
					break;
				}
				case 6:
				{
					G.drawLevelSix();
					break;
				}
				case 7:
				{
					G.drawLevelSeven();
					break;
				}
			}
		}
	}

	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

PS.swipe = function( data, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters

	/*
	 var len, i, ev;
	 PS.debugClear();
	 PS.debug( "PS.swipe(): start = " + data.start + ", end = " + data.end + ", dur = " + data.duration + "\n" );
	 len = data.events.length;
	 for ( i = 0; i < len; i += 1 ) {
	 ev = data.events[ i ];
	 PS.debug( i + ": [x = " + ev.x + ", y = " + ev.y + ", start = " + ev.start + ", end = " + ev.end +
	 ", dur = " + ev.duration + "]\n");
	 }
	 */

	// Add code here for when an input event is detected
};