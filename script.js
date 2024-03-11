async function getSongs() {
  let response = await fetch("http://127.0.0.1:3000/songs/");
  let text = await response.text(); // Await the response text
  console.log(text);
  let div = document.createElement("div");
  div.innerHTML = text; // Parse the response text into an HTML document
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

async function main() {
  let songs = await getSongs();
  console.log(songs);
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
 for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `
    
    
    
    
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
    
    
    
    
     </li> `
 }
  var audio = new Audio(songs[0]);
  audio.play();

  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(audio.duration, audio.currentSrc, audio.currentTime);
  });
}
main();
