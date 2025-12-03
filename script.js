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

// Добавляем поддержку открытия карточки на мобильных устройствах
document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('card');
    let isCardOpen = false;
    
    // Проверяем, является ли устройство мобильным
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                     || window.innerWidth <= 768;
    
    if (isMobile) {
        // Для мобильных устройств используем клик/тач
        card.addEventListener('click', function(e) {
            // Если клик по кнопке "Нажми сюда", не открываем/закрываем карточку
            if (e.target.closest('.noto-sans-regular[onclick]')) {
                return;
            }
            
            if (!isCardOpen) {
                card.classList.add('card-open');
                isCardOpen = true;
            } else {
                card.classList.remove('card-open');
                isCardOpen = false;
            }
        });
        
        // Убираем класс hover если он есть
        card.classList.remove('card-hover');
    }
});