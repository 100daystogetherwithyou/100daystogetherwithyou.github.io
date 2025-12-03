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

// Переменная для отслеживания состояния карточки
var isCardOpen = false;

function toggleCard(event) {
    const card = document.getElementById('card');
    
    // Если клик по кнопке "Нажми сюда", не открываем/закрываем карточку
    if (event && event.target && event.target.closest('.noto-sans-regular[onclick]')) {
        return;
    }
    
    if (!isCardOpen) {
        card.classList.add('card-open');
        isCardOpen = true;
    } else {
        card.classList.remove('card-open');
        isCardOpen = false;
    }
}