<script>
  let audioContext;
  let audio;
  let fileInput;
  let playing = false;

  function playPauseAudio() {
    if (!playing) {
      audioContext.resume();
      audio.play();
    } else {
      audio.pause();
    }
    playing = !playing;
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    audio = new Audio(objectURL);
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    visualize(analyser);
  }

  function visualize(analyser) {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Simple bar visualizer
      dataArray.forEach((value, i) => {
        const barHeight = value / 2;
        ctx.fillStyle = 'hsl(' + (i / bufferLength) * 360 + ', 100%, 50%)';
        ctx.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
      });
    }

    draw();
  }
</script>

<main>
  <h1>Music Visualizer</h1>
  <input type="file" accept="audio/*" bind:this={fileInput} on:change={handleFileUpload} />
  <button on:click={playPauseAudio}>
    {playing ? "Pause" : "Play"}
  </button>
  <canvas width="800" height="400"></canvas>
</main>

<style>
  main {
    text-align: center;
    font-family: Arial, sans-serif;
  }

  canvas {
    display: block;
    margin: 20px auto;
    border: 1px solid #ccc;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
  }
</style>
