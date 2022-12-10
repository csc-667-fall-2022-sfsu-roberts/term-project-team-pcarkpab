//This const is just a placeholder for the amount of players to take in
//Not sure what logic to use to fetch amount of player in game
//Make it another item in gameid? or count number of gameruserid's associated to one gameid?
const playercount = 2;

//This const is just a placeholder for the number of sessions
//not sure how te logic to get this variable is either
const active_session = 3;

var gameid = 1;
//Placeholder to represent game_id value for now

var room_owner = 1;
//Placeholder bool variable to represent if the user is the one that create the room

var currentPage = window.location;
//verifies which page you're on
//document.write(currentPage);

checkPages();

function checkPages(){

    var path = window.location.pathname;
    var currentPage = path.substring(path.lastIndexOf('/') + 1);

    if (currentPage == "lobby"){
        displayRooms();
    } else if(currentPage == "waitingRoom"){
        checkOwner();
    } else {
        document.write("No room detected");
    }
}

function checkOwner(){

    //Logic to check user implemented backend or frontend?
    if(room_owner == 1){
        makeRoomButton(gameid);
    }
}

function makeRoomButton(gameid){
    let btn = document.createElement("a");
        btn.innerHTML = "Game {{gameid}} ";
        btn.type = "submit";
        btn.name = "formBtn";
        btn.className = "button1";

        var t = btn.setAttribute("href","/auth/game");
        document.body.appendChild(btn);
}


function displayRooms(){
    for(let i = 0; i < active_session; i++){

        if(playercount >= 1){
            makeRoomButton(gameid);
        }
    }
}






