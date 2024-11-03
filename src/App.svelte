<script>
    import { onMount } from "svelte";

    let audioContext;
    let audio;
    let fileInput;
    let playing = false;
    let fileName = "";
    let canvas;
    let ctx;
    let volume = 1;
    let currentTime = "0:00";
    let duration = "0:00";
    let progress = 0;
    let playlist = [];
    let currentTrackIndex = 0;
    let visualizationMode = "bars"; // bars, wave, circle
    let equalizer = {
        bass: 0,
        mid: 0,
        treble: 0
    };
    let analyser;
    let dataArray;
    let bufferLength;

    onMount(() => {
        canvas = document.getElementById("visualizer");
        ctx = canvas.getContext("2d");
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.6;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function updateProgress() {
        if (!audio) return;
        currentTime = formatTime(audio.currentTime);
        duration = formatTime(audio.duration);
        progress = (audio.currentTime / audio.duration) * 100;
    }

    function seek(event) {
        if (!audio) return;
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = x / rect.width;
        audio.currentTime = percentage * audio.duration;
    }

    function handleVolumeChange(event) {
        volume = event.target.value;
        if (audio) audio.volume = volume;
    }

    function playPauseAudio() {
        if (!audio) return;
        if (!playing) {
            audioContext.resume();
            audio.play();
        } else {
            audio.pause();
        }
        playing = !playing;
    }

    function handleFileUpload(event) {
        const files = event.target.files;
        playlist = [...playlist, ...Array.from(files)];
        if (!audio) loadTrack(0);
    }

    function loadTrack(index) {
        if (index < 0 || index >= playlist.length) return;
        
        const file = playlist[index];
        fileName = file.name;
        const objectURL = URL.createObjectURL(file);
        
        if (audio) {
            audio.pause();
            audio.src = objectURL;
        } else {
            audio = new Audio(objectURL);
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaElementSource(audio);
            analyser = audioContext.createAnalyser();
            
            // Create equalizer nodes
            const bassFilter = audioContext.createBiquadFilter();
            const midFilter = audioContext.createBiquadFilter();
            const trebleFilter = audioContext.createBiquadFilter();
            
            bassFilter.type = "lowshelf";
            midFilter.type = "peaking";
            trebleFilter.type = "highshelf";
            
            source.connect(bassFilter);
            bassFilter.connect(midFilter);
            midFilter.connect(trebleFilter);
            trebleFilter.connect(analyser);
            analyser.connect(audioContext.destination);
            
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
            
            visualize();
            
            audio.addEventListener("timeupdate", updateProgress);
            audio.addEventListener("ended", () => loadTrack(currentTrackIndex + 1));
        }
        
        currentTrackIndex = index;
        audio.volume = volume;
        if (playing) audio.play();
    }

    function visualize() {
        function draw() {
            requestAnimationFrame(draw);

            if (visualizationMode === "wave") {
                analyser.getByteTimeDomainData(dataArray);
            } else {
                analyser.getByteFrequencyData(dataArray);
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "rgba(255, 87, 34, 0.2)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            switch (visualizationMode) {
                case "bars":
                    drawBars();
                    break;
                case "wave":
                    drawWave();
                    break;
                case "circle":
                    drawCircle();
                    break;
            }
        }

        draw();
    }

    function drawBars() {
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            const barGradient = ctx.createLinearGradient(
                0,
                canvas.height,
                0,
                canvas.height - barHeight
            );
            barGradient.addColorStop(0, "rgba(255, 87, 34, 0.8)");
            barGradient.addColorStop(1, "rgba(255, 171, 64, 0.6)");
            ctx.fillStyle = barGradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    function drawWave() {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 87, 34, 0.8)";
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * canvas.height / 2;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
    }

    function drawCircle() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 87, 34, 0.8)";
        ctx.lineWidth = 2;

        for (let i = 0; i < bufferLength; i++) {
            const rads = Math.PI * 2 / bufferLength;
            const magnitude = dataArray[i] / 255;
            const x = centerX + Math.cos(rads * i) * (radius * magnitude);
            const y = centerY + Math.sin(rads * i) * (radius * magnitude);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.closePath();
        ctx.stroke();
    }
</script>

<main>
    <div class="content">
        <h1>Synthio: A Svelete Music Visualizer</h1>
        <div class="controls">
            <label for="file-upload" class="custom-file-upload">
                Choose Files
            </label>
            <input
                id="file-upload"
                type="file"
                accept="audio/*"
                multiple
                bind:this={fileInput}
                on:change={handleFileUpload}
            />
            <button on:click={playPauseAudio} disabled={!audio}>
                {playing ? "Pause" : "Play"}
            </button>
            <button on:click={() => loadTrack(currentTrackIndex - 1)} disabled={!playlist.length}>
                Previous
            </button>
            <button on:click={() => loadTrack(currentTrackIndex + 1)} disabled={!playlist.length}>
                Next
            </button>
            <select bind:value={visualizationMode}>
                <option value="bars">Bars</option>
                <option value="wave">Wave</option>
                <option value="circle">Circle</option>
            </select>
        </div>
        
        <div class="audio-controls">
            <div class="volume-control">
                <span>Volume</span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    on:input={handleVolumeChange}
                />
            </div>
            
            <div class="equalizer">
                <div class="eq-control">
                    <span>Bass</span>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        bind:value={equalizer.bass}
                    />
                </div>
                <div class="eq-control">
                    <span>Mid</span>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        bind:value={equalizer.mid}
                    />
                </div>
                <div class="eq-control">
                    <span>Treble</span>
                    <input
                        type="range"
                        min="-12"
                        max="12"
                        bind:value={equalizer.treble}
                    />
                </div>
            </div>
        </div>

        <div class="progress-container">
            <span class="time">{currentTime}</span>
            <div class="progress-bar" on:click={seek}>
                <div class="progress" style="width: {progress}%"></div>
            </div>
            <span class="time">{duration}</span>
        </div>

        {#if fileName}
            <p class="file-name">Now Playing: {fileName}</p>
        {/if}

        {#if playlist.length > 0}
            <div class="playlist">
                <h3>Playlist</h3>
                {#each playlist as track, i}
                    <div
                        class="playlist-item"
                        class:active={i === currentTrackIndex}
                        on:click={() => loadTrack(i)}
                    >
                        {track.name}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
    <canvas id="visualizer"></canvas>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background-color: #000000;
        color: #ffffff;
        overflow: hidden;
    }

    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 2rem;
        text-shadow: 0 0 10px rgba(255, 87, 34, 0.5);
    }

    .controls {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .custom-file-upload,
    button {
        background-color: rgba(255, 87, 34, 0.8);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
        transition:
            background-color 0.3s,
            transform 0.1s;
    }

    .custom-file-upload:hover,
    button:hover {
        background-color: rgba(255, 87, 34, 1);
    }

    .custom-file-upload:active,
    button:active {
        transform: scale(0.98);
    }

    button:disabled {
        background-color: rgba(255, 87, 34, 0.3);
        cursor: not-allowed;
    }

    input[type="file"] {
        display: none;
    }

    .file-name {
        font-style: italic;
        opacity: 0.7;
    }

    canvas {
        width: 100%;
        height: 60vh;
    }

    .audio-controls {
        display: flex;
        gap: 2rem;
        margin: 1rem 0;
    }

    .volume-control,
    .eq-control {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .equalizer {
        display: flex;
        gap: 1rem;
    }

    .progress-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: 100%;
        max-width: 600px;
        margin: 1rem 0;
    }

    .progress-bar {
        flex: 1;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        cursor: pointer;
        position: relative;
    }

    .progress {
        position: absolute;
        height: 100%;
        background: rgba(255, 87, 34, 0.8);
        border-radius: 2px;
        transition: width 0.1s linear;
    }

    .time {
        font-family: monospace;
        min-width: 4ch;
    }

    .playlist {
        max-height: 200px;
        overflow-y: auto;
        width: 100%;
        max-width: 600px;
        margin-top: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        padding: 1rem;
    }

    .playlist-item {
        padding: 0.5rem;
        cursor: pointer;
        transition:  background-color 0.2s;
        border-radius: 3px;
    }

    .playlist-item:hover {
        background: rgba(255, 87, 34, 0.2);
    }

    .playlist-item.active {
        background: rgba(255, 87, 34, 0.4);
    }

    select {
        background: rgba(255, 87, 34, 0.8);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }

    select:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.5);
    }

    input[type="range"] {
        -webkit-appearance: none;
        width: 100px;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: #ff5722;
        border-radius: 50%;
        cursor: pointer;
    }

    @media (max-width: 768px) {
        .audio-controls {
            flex-direction: column;
            gap: 1rem;
        }

        .equalizer {
            justify-content: center;
        }
    }
</style>