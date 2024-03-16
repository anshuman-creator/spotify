// This function converts seconds to a string representation of minutes and seconds
function SecToMinAndSec(seconds) {
  if (typeof seconds !== "number" || seconds < 0) {
    throw new Error("Input must be a non-negative number.");
  }

  // Round the seconds to the nearest integer
  let roundedSeconds = Math.round(seconds);
  let minutes = Math.floor(roundedSeconds / 60);
  let remainingSeconds = roundedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

let currentsong = new Audio(); // Initialize a new Audio object for the current song
let currfolder;
let songs = []; // Initialize the songs array

async function getSongs(folder) {
  currfolder = folder; // Update the global variable instead of declaring a new one
  let response = await fetch(`/${folder}/`);
  let text = await response.text();
  let div = document.createElement("div");
  div.innerHTML = text;
  let as = div.getElementsByTagName("a");
  songs = []; // Clear the existing songs array
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = ""; // Clear the existing song list
  for (const song of songs) {
    songUL.innerHTML += `
      <li> 
        <img class="invert" src="./assets/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")} </div>
          <div>Anshu</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="./assets/play.svg" alt="">
        </div>
      </li>`;
  }
  // Add click event listeners to each song in the list
  Array.from(songUL.getElementsByTagName("li")).forEach((songLi, index) => {
    songLi.addEventListener("click", () => {
      playMusic(songs[index]);
    });
  });

  // Return the songs array
  return songs;
}

// Function to play music track with optional pause parameter
const playMusic = (track, pause = false) => {
  currentsong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentsong.play(); // Start playing the music
    play.src = "./assets/pause.svg"; // Change the play button icon to pause
  }

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let response = await fetch(`/songs/`);
  let text = await response.text();
  let div = document.createElement("div");
  div.innerHTML = text;
  let cardContainer = document.querySelector(".cardContainer");
  let anchors = div.getElementsByTagName("a");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let response = await fetch(
        `/songs/${folder}/info.json`
      );
      let text = await response.json();
      cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
          <div class="play">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50%" height="50%" fill="black">
              <circle cx="12" cy="12" r="10" fill="#00ba00" /><path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <img src="/songs/${folder}/cover.jpg" alt="" />
          <h2>${text.title}</h2>
          <p>${text.description}</p>
        </div>`;
      console.log(text.description);
      console.log(text.title);
    }
  }
  // Add click event listeners to each card in the playlist
  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    card.addEventListener("click", async () => {
      songs = await getSongs(`songs/${card.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  await getSongs("songs/sad"); // Retrieve the list of songs
  playMusic(songs[0], true); // Play the first song in the list initially and pause it

  displayAlbums();

  // Toggle play/pause functionality when the play button is clicked
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentsong.pause();
      play.src = "./assets/play.svg";
    }
  });

  // Update song time and seek bar position as the song progresses
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${SecToMinAndSec(
      currentsong.currentTime
    )} / ${SecToMinAndSec(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 99 + "%";
  });

  // Change song playback position when the seek bar is clicked
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle ").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // Show/hide the left panel when the hamburger menu icon is clicked
  document.querySelector(".ham-bg").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Hide the left panel when the close icon is clicked
  document.querySelector(".x").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Play the previous song in the list when the previous button is clicked
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Play the next song in the list when the next button is clicked
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Update volume when the range input changes
  document.querySelector(".range input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  //
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentsong.volume = "0";
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentsong.volume = "0.1";
      document.querySelector(".range input").value = 10;
    }
  });
}

main(); // Execute the main function to start the application.
