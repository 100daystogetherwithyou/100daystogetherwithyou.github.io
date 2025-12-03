function showLetter(){
    document.getElementById("letter").classList.add("show");
}

function hideLetter(){
    document.getElementById("letter").classList.remove("show");
}

// Protect letter and body from player clicks
(function(){
    // Override body onclick for player area
    var originalBodyOnClick = document.body.onclick;
    document.body.onclick = function(e){
        // Don't run original onclick if clicking player
        if(e.target.closest('#music-player') || e.target.closest('#player-toggle')){
            return;
        }
        if(originalBodyOnClick){
            originalBodyOnClick.call(this, e);
        }
    };
})();

function playSong(){
    var song = document.getElementById("song");
    song.play();
}

// --- Custom Music Player Logic ---
(function initMusicPlayer(){
    var audio = document.getElementById('song');
    var player = document.getElementById('music-player');
    if(!audio || !player) return;

    // Playlist state
    var playlist = [];
    var index = 0;

    // Guard global click-to-start (body onclick="playSong()") so it runs only once
    var allowClickToStart = true;
    window.playSong = function(){
        if(!allowClickToStart){ return; }
        audio.play();
    };

    // Controls
    var playPauseBtn = document.getElementById('play-pause');
    var volumeSlider = document.getElementById('volume');
    var volumeIcon = player.querySelector('.volume-icon');
    var seekBar = document.getElementById('seek');
    var currentTimeLabel = document.getElementById('current-time');
    var durationLabel = document.getElementById('duration');
    var lastVolume = 0.07; // to restore after mute
    var titleEl = player.querySelector('.music-title');
    var artistEl = player.querySelector('.music-artist');
    var closeBtn = document.getElementById('player-close');
    var toggleBtn = document.getElementById('player-toggle');
    var nextBtn = document.getElementById('next');
    var prevBtn = document.getElementById('prev');
    var userHidden = false; // when true, do not auto-show the player
    var playerContent = player.querySelector('.player-content');
    var progressContainer = player.querySelector('.progress-container');

    // Helpers
    function formatTime(sec){
        if(!isFinite(sec)) return '0:00';
        var m = Math.floor(sec / 60);
        var s = Math.floor(sec % 60);
        return m + ':' + (s < 10 ? '0' + s : s);
    }

    function showPlayer(){
        // Only show once
        if(userHidden) return; // respect user's choice to hide
        if(!player.classList.contains('show')){
            player.classList.add('show');
            player.setAttribute('aria-hidden', 'false');
            if(toggleBtn) toggleBtn.style.display = 'none';
        }
    }

    function updatePlayIcon(){
        // Use symbols ▶ and ⏸
        playPauseBtn.textContent = audio.paused ? '▶' : '⏸';
    }

    // Volume
    if(volumeSlider){
        // Initialize audio volume from slider's default
        var initialVol = parseFloat(volumeSlider.value || '0.07');
        if(isFinite(initialVol)) audio.volume = initialVol;
        lastVolume = audio.volume > 0 ? audio.volume : 0.07;
        volumeSlider.addEventListener('input', function(){
            var v = parseFloat(volumeSlider.value);
            audio.volume = v;
            // Treat 0 as muted for UX
            audio.muted = v === 0;
            if(v > 0){
                lastVolume = v;
            }
            updateVolumeIcon();
        });
    }

    function updateVolumeIcon(){
        if(!volumeIcon) return;
        var v = audio.muted ? 0 : audio.volume;
        if(v === 0){
            volumeIcon.textContent = '🔇';
        } else if(v < 0.5){
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }

    // Click on volume icon to toggle mute
    if(volumeIcon){
        volumeIcon.addEventListener('click', function(e){
            e.stopPropagation();
            if(audio.muted || audio.volume === 0){
                // Unmute to last non-zero volume
                var restore = (lastVolume && lastVolume > 0) ? lastVolume : 0.07;
                audio.muted = false;
                audio.volume = restore;
                if(volumeSlider) volumeSlider.value = String(restore);
            } else {
                // Mute and remember last volume
                if(audio.volume > 0) lastVolume = audio.volume;
                audio.muted = true;
                if(volumeSlider) volumeSlider.value = '0';
            }
            updateVolumeIcon();
        });
    }

    // Keep UI in sync when volume/muted changes by other means
    audio.addEventListener('volumechange', function(){
        if(volumeSlider){
            if(audio.muted){
                volumeSlider.value = '0';
            } else {
                volumeSlider.value = String(audio.volume);
            }
        }
        updateVolumeIcon();
    });

    // Play/Pause toggle
    if(playPauseBtn){
        playPauseBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(audio.paused){
                audio.play();
            } else {
                audio.pause();
            }
        });
    }

    // Seeking
    if(seekBar){
        // Update duration when metadata is loaded
        audio.addEventListener('loadedmetadata', function(){
            durationLabel.textContent = formatTime(audio.duration);
            seekBar.max = isFinite(audio.duration) ? String(audio.duration) : '0';
        });

        // Update seek bar as time updates
        audio.addEventListener('timeupdate', function(){
            if(!isFinite(audio.duration)) return;
            seekBar.value = String(audio.currentTime);
            currentTimeLabel.textContent = formatTime(audio.currentTime);
            // Fallback: if for some reason 'play' wasn't caught, show when time progresses
            if(audio.currentTime > 0) showPlayer();
        });

        // Allow user scrubbing
        seekBar.addEventListener('input', function(){
            var t = parseFloat(seekBar.value);
            if(isFinite(t)){
                audio.currentTime = t;
            }
        });
    }

    // Update button on play/pause
    audio.addEventListener('play', function(){
        updatePlayIcon();
        showPlayer();
    allowClickToStart = false; // after first actual play, disable click-to-start
    });
    audio.addEventListener('pause', function(){
        updatePlayIcon();
    });
    audio.addEventListener('playing', function(){
        showPlayer();
    });

    // In case autoplay works, ensure initial labels
    if(!isNaN(audio.duration)){
        durationLabel.textContent = formatTime(audio.duration);
        seekBar.max = String(audio.duration);
    }
    currentTimeLabel.textContent = formatTime(0);
    updatePlayIcon();
    updateVolumeIcon();

    // --- Playlist helpers ---
    function setSource(src){
        var sourceEl = audio.querySelector('source');
        if(sourceEl){
            sourceEl.src = src;
            audio.load();
        } else {
            audio.src = src;
        }
    }

    function readId3For(src, fallback){
        try {
            if(window.jsmediatags && src){
                var link = document.createElement('a');
                link.href = src;
                var url = link.href;
                window.jsmediatags.read(url, {
                    onSuccess: function(tag){
                        var t = tag.tags.title || (fallback && fallback.title) || 'Unknown Title';
                        var a = tag.tags.artist || (fallback && fallback.artist) || 'Unknown Artist';
                        if(titleEl) titleEl.textContent = t;
                        if(artistEl) artistEl.textContent = a;
                    },
                    onError: function(){
                        if(titleEl) titleEl.textContent = (fallback && fallback.title) || '';
                        if(artistEl) artistEl.textContent = (fallback && fallback.artist) || '';
                    }
                });
            } else {
                if(titleEl) titleEl.textContent = (fallback && fallback.title) || '';
                if(artistEl) artistEl.textContent = (fallback && fallback.artist) || '';
            }
        } catch(e) {
            // ignore
        }
    }

    function loadTrack(i){
        if(!playlist.length) return;
        index = (i + playlist.length) % playlist.length;
        var track = playlist[index];
        setSource(track.src);
        readId3For(track.src, track);
    }

    async function loadPlaylist(){
        try {
            var res = await fetch('media/playlist.json', { cache: 'no-cache' });
            if(!res.ok) throw new Error('playlist.json not found');
            var data = await res.json();
            playlist = (Array.isArray(data) ? data : []).filter(function(t){
                return t && typeof t.src === 'string' && t.src.toLowerCase().endsWith('.mp3');
            });
        } catch(e){
            // Fallback: use initial <source> if present
            var src = audio.querySelector('source') ? audio.querySelector('source').src : (audio.currentSrc || audio.src);
            if(src){
                playlist = [{ src: src, title: '', artist: '' }];
            } else {
                playlist = [];
            }
        }
        // If playlist is empty, do nothing
        if(playlist.length){
            loadTrack(0);
        }
    }

    // Navigation
    if(nextBtn){
        nextBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(!playlist.length) return;
            loadTrack(index + 1);
            audio.play();
        });
    }
    if(prevBtn){
        prevBtn.addEventListener('click', function(e){
            e.stopPropagation();
            if(!playlist.length) return;
            loadTrack(index - 1);
            audio.play();
        });
    }

    // Auto-advance to next track when ended
    audio.addEventListener('ended', function(){
        if(playlist.length > 1){
            loadTrack(index + 1);
            audio.play();
        }
    });

    // Kick off playlist loading
    loadPlaylist();

    // If audio already playing (rare), show player immediately
    if(!audio.paused && !audio.ended){
        showPlayer();
    }

    // Hide/Show Player
    function hidePlayer(){
        player.classList.remove('show');
        player.setAttribute('aria-hidden', 'true');
        userHidden = true;
        if(toggleBtn) toggleBtn.style.display = 'block';
    }

    if(closeBtn){
        closeBtn.addEventListener('click', function(e){
            e.stopPropagation();
            hidePlayer();
        });
    }
    if(toggleBtn){
        toggleBtn.addEventListener('click', function(e){
            e.stopPropagation();
            userHidden = false;
            showPlayer();
        });
    }

    // Stop events from bubbling OUTSIDE player (but allow internal handlers)
    if(player){
        player.addEventListener('click', function(e){ 
            e.stopPropagation(); // stop bubbling to body/letter
        }, false); // bubble phase, after internal handlers
        player.addEventListener('touchend', function(e){ 
            e.stopPropagation(); 
        }, false);
    }
    if(toggleBtn){
        toggleBtn.addEventListener('click', function(e){ 
            e.stopPropagation(); 
        }, false);
        toggleBtn.addEventListener('touchend', function(e){ 
            e.stopPropagation(); 
        }, false);
    }
})();