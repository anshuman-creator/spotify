function SecToMinAndSec(seconds) {
  if (typeof seconds !== "number" || seconds < 0) {
    throw new Error("Input must be a non-negative number.");
  }

  let roundedSeconds = Math.round(seconds); // Round the seconds to the nearest integer
  let minutes = Math.floor(roundedSeconds / 60);
  let remainingSeconds = roundedSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

let currentsong = new Audio();
async function getSongs() {
  let response = await fetch("http://127.0.0.1:3000/songs/");
  let text = await response.text();
  let div = document.createElement("div");
  div.innerHTML = text;
  let as = div.getElementsByTagName("a");
  console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith("mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentsong.src = "http://127.0.0.1:3000/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "./assets/pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  let songs = await getSongs();
  playMusic(songs[0], true);
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `
      
    
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
    </li>
    
    
     </li> `;
  }
  ////
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  /////

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentsong.pause();
      play.src = "./assets/play.svg";
    }
  });
  ////

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${SecToMinAndSec(
      currentsong.currentTime
    )} / ${SecToMinAndSec(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  ///
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle ").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  ///
  document.querySelector(".ham-bg").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".x").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").splice(-1)[0]);
    if (index + 1 > length) {
      playMusic(songs[index + 1]);
    }
  });
}
main();
