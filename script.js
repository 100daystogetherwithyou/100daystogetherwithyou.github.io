function showLetter(){
    document.getElementById("letter").classList.add("show");
}

function hideLetter(){
    document.getElementById("letter").classList.remove("show");
}

function playSong(){
    var song = document.getElementById("song");
    song.volume = 0.07;
    song.play();
}