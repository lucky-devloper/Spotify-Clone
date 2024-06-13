const songlist = [
    {
        id: 1,
        songname: "O Sajni Re",
        songimage: "https://www.pagalworld.com.sb/siteuploads/thumb/sft143/71229_4.jpg",
        songduration: "02:50",
        songaudio: "O Sajni Re_192(PagalWorld.com.sb).mp3"
    },
    {
        id: 2,
        songname: "Musafir (From 'Dedh Bigha Zameen')",
        songimage: "https://img.wynk.in/unsafe/248x248/filters:no_upscale():strip_exif():format(webp)/http://s3.ap-south-1.amazonaws.com/wynk-music-cms/srch_hungama/8903431002600_20240603114807/8903431002600/1717396507253/resources/8903431002600.jpg",
        songduration: "03:18",
        songaudio: "_Musafir_192(PagalWorld.com.sb).mp3"
    },
    {
        id: 3,
        songname: "Zidd Na Karo (From 'Dedh Bigha Zameen')",
        songimage: "https://img.wynk.in/unsafe/248x248/filters:no_upscale():strip_exif():format(webp)/http://s3.ap-south-1.amazonaws.com/wynk-music-cms/srch_hungama/8903431001832_20240527170008/8903431001832/1716810611929/resources/8903431001832.jpg",
        songduration: "04:31",
        songaudio: "Zidd Na Karo Dedh Bigha Zameen 128 Kbps.mp3"
    },
    {
        id: 4,
        songname: "Dekhha Tenu (From 'Mr. And Mrs. Mahi')",
        songimage: "https://img.wynk.in/unsafe/248x248/filters:no_upscale():strip_exif():format(webp)/http://s3.ap-south-1.amazonaws.com/wynk-music-cms/srch_sonymusic/A10301A0005289589V_20240514174233800/1715702423500/resources/A10301A0005289589V.jpg",
        songduration: "04:41",
        songaudio: "Dekhha Tenu Mr And Mrs Mahi 128 Kbps.mp3"
    },
    {
        id: 5,
        songname: "Jeena Sikha De (From 'Srikanth')",
        songimage: "https://img.wynk.in/unsafe/248x248/filters:no_upscale():strip_exif():format(webp)/http://s3.ap-south-1.amazonaws.com/wynk-music-cms/srch_hungama/8903431993977_20240507160515/8903431993977/1715079305125/resources/8903431993977.jpg",
        songduration: "04:30",
        songaudio: "Jeena Sikha De_192(PagalWorld.com.sb).mp3"
    }
];

const songContainer = document.querySelector(".song-list");
const songBanner = document.querySelector(".banner");
const audio = new Audio()

let currentlyPlayingSongId = null;

const APIcontroller = (function() {
    const clientId = "c57246af7e3a495c802c83bd8f221d46"
    const clientSecret = "d13f94c5e3bf429f901705c7eddaffe3"

    // private method
    const _getToken = async()=>{
        const result = await fetch(`https://accounts.spotify.com/api/token`, {
            method:'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization': 'Basic' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        
        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {

        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();

function displaysongs() {
    let clutter = "";
    songlist.forEach((song) => {
        clutter += `<div class="song" data-id="${song.id}">
                <div class="song-image">
                    <img src="${song.songimage}" alt="">
                </div>
                <div class="song-name">
                    <h3>${song.songname}</h3>
                </div>
                <div class="duration-and-icon">
                    <div class="song-duration">
                        <p>${song.songduration}</p>
                    </div>
                    <div class="play-pause-icon play">
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>
            </div>`;
    });

    songContainer.innerHTML = clutter;
}
displaysongs();

function playSongs() {
    const songs = songContainer.querySelectorAll(".song");
    songs.forEach((song) => {
        song.addEventListener('click', (e) => {
            let songElement = e.currentTarget;
            let songid = Number(songElement.dataset.id);
            let selectedsongId = songlist.find(item => item.id === songid);
            songBanner.src = `${selectedsongId.songimage}`; // here add the add selected songimage right side song banner 

            const songplayIcon = songElement.querySelector(".play-pause-icon");

            // here basically when i was change any song to tap on another song the previous play icon are change and the previous song are pause
            if (currentlyPlayingSongId !== null && currentlyPlayingSongId !== songid) {
                const previousSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
                const previousSongIcon = previousSongElement.querySelector('.play-pause-icon')
                previousSongIcon.classList.remove('pause')
                previousSongIcon.classList.add('play')
                previousSongIcon.innerHTML = `<i class="fa-solid fa-play"></i>`
                audio.src = selectedsongId.songaudio
                audio.pause()
                audio.currentTime = 0
            }

            if (songplayIcon.classList.contains('play')) {
                songplayIcon.classList.remove('play')
                songplayIcon.classList.add('pause')
                songplayIcon.innerHTML = `<i class="fa-solid fa-pause"></i>`
                currentlyPlayingSongId = songid
                audio.src = selectedsongId.songaudio
                audio.play()
                updateBottomPlayPauseIcon(true)
            } else {
                songplayIcon.classList.remove('pause')
                songplayIcon.classList.add('play')
                songplayIcon.innerHTML = `<i class="fa-solid fa-play"></i>`
                currentlyPlayingSongId = null
                audio.src = selectedsongId.songaudio
                audio.pause()
                updateBottomPlayPauseIcon(false)
            }
        });
    });
}
playSongs()

// when the user click on song section the play icon will be change
function updateBottomPlayPauseIcon(isplaying) {
    const playIcon = document.querySelector(".play-icons")
    if (isplaying) {
        playIcon.classList.remove('play')
        playIcon.classList.remove('pause')
        playIcon.innerHTML = ` <i class="fa-solid fa-backward-step"></i>
            <i class="fa-regular fa-circle-pause"></i>
            <i class="fa-solid fa-forward-step"></i>`
    } else {
        playIcon.classList.remove('pause')
        playIcon.classList.add('play')
        playIcon.innerHTML = `<i class="fa-solid fa-backward-step"></i>
            <i class="fa-regular fa-circle-play"></i>
            <i class="fa-solid fa-forward-step"></i>`
    }
}

const bottomContainer = document.querySelector(".bottom");
bottomContainer.addEventListener('click', (e) => {
    const targetClassList = e.target.classList;
    if (targetClassList.contains('fa-circle-play') || targetClassList.contains('fa-circle-pause')) {
        playPauseButton()
    } else if (targetClassList.contains('fa-forward-step')) {
        nextSongButton()
    } else if (targetClassList.contains('fa-backward-step')) {
        previousSongButton()
    }
});

// this function is play the song when user click to the play icon
function playPauseButton() {
    const bottomIcons = bottomContainer.querySelector(".play-icons");
    const playPauseIcon = bottomIcons.querySelector(".fa-circle-pause, .fa-circle-play");

    if (playPauseIcon.classList.contains('fa-circle-play')) {
        if (currentlyPlayingSongId === null && songlist.length > 0) {
            currentlyPlayingSongId = songlist[0].id
            const selectedSong = songlist[0];
            audio.src = selectedSong.songaudio
            songBanner.src = selectedSong.songimage
            const firstSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
            const firstSongIcon = firstSongElement.querySelector(".play-pause-icon")
            firstSongIcon.classList.remove('play')
            firstSongIcon.classList.add('pause')
            firstSongIcon.innerHTML = `<i class="fa-solid fa-pause"></i>`
        }
        playPauseIcon.classList.remove('fa-circle-play')
        playPauseIcon.classList.add('fa-circle-pause')
        audio.play()
        if (currentlyPlayingSongId !== null) {
            const currentSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
            const currentSongIcon = currentSongElement.querySelector(".play-pause-icon")
            currentSongIcon.classList.remove('play')
            currentSongIcon.classList.add('pause')
            currentSongIcon.innerHTML = `<i class="fa-solid fa-pause"></i>`
        }
    } else {
        playPauseIcon.classList.remove('fa-circle-pause')
        playPauseIcon.classList.add('fa-circle-play')
        audio.pause()
        if (currentlyPlayingSongId !== null) {
            const currentSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
            const currentSongIcon = currentSongElement.querySelector(".play-pause-icon")
            currentSongIcon.classList.remove('pause')
            currentSongIcon.classList.add('play')
            currentSongIcon.innerHTML = `<i class="fa-solid fa-play"></i>`
        }
    }
}

// when the user click next button the song will be change
function nextSongButton() {
    if (currentlyPlayingSongId !== null) {
        const currentIndex = songlist.findIndex(song => song.id === currentlyPlayingSongId)
        const nextIndex = (currentIndex + 1) % songlist.length;
        const nextSong = songlist[nextIndex];

        const currentSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
        const currentSongIcon = currentSongElement.querySelector(".play-pause-icon")
        currentSongIcon.classList.remove('pause')
        currentSongIcon.classList.add('play')
        currentSongIcon.innerHTML = `<i class="fa-solid fa-play"></i>`

        currentlyPlayingSongId = nextSong.id
        audio.src = nextSong.songaudio
        songBanner.src = nextSong.songimage
        audio.play()

        const nextSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
        const nextSongIcon = nextSongElement.querySelector(".play-pause-icon")
        nextSongIcon.classList.remove('play')
        nextSongIcon.classList.add('pause')
        nextSongIcon.innerHTML = `<i class="fa-solid fa-pause"></i>`
    }
}

// when the user click previous button then previous song will be play
function previousSongButton() {
    if (currentlyPlayingSongId !== null) {
        const currentIndex = songlist.findIndex(song => song.id === currentlyPlayingSongId)
        const previousIndex = (currentIndex - 1 + songlist.length) % songlist.length;
        const previousSong = songlist[previousIndex];

        const currentSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
        const currentSongIcon = currentSongElement.querySelector(".play-pause-icon")
        currentSongIcon.classList.remove('pause')
        currentSongIcon.classList.add('play')
        currentSongIcon.innerHTML = `<i class="fa-solid fa-play"></i>`

        currentlyPlayingSongId = previousSong.id
        audio.src = previousSong.songaudio
        songBanner.src = previousSong.songimage
        audio.play()

        const nextSongElement = songContainer.querySelector(`.song[data-id="${currentlyPlayingSongId}"]`)
        const nextSongIcon = nextSongElement.querySelector(".play-pause-icon")
        nextSongIcon.classList.remove('play')
        nextSongIcon.classList.add('pause')
        nextSongIcon.innerHTML = `<i class="fa-solid fa-pause"></i>`
    }
}
