<script>
    import { onMount } from "svelte";

    let audioContext;
    let audio;
    let fileInput;
    let playing = false;
    let fileName = "";
    let canvas;
    let ctx;

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
        const file = event.target.files[0];
        fileName = file.name;
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
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "rgba(255, 87, 34, 0.2)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0.8)");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;

            dataArray.forEach((value, i) => {
                const barHeight = (value / 255) * canvas.height;

                const barGradient = ctx.createLinearGradient(
                    0,
                    canvas.height,
                    0,
                    canvas.height - barHeight,
                );
                barGradient.addColorStop(0, "rgba(255, 87, 34, 0.8)");
                barGradient.addColorStop(1, "rgba(255, 171, 64, 0.6)");

                ctx.fillStyle = barGradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            });
        }

        draw();
    }
</script>

<main>
    <div class="content">
        <h1>Synthio: A Svelete Music Visualizer</h1>
        <div class="controls">
            <label for="file-upload" class="custom-file-upload">
                Choose File
            </label>
            <input
                id="file-upload"
                type="file"
                accept="audio/*"
                bind:this={fileInput}
                on:change={handleFileUpload}
            />
            <button on:click={playPauseAudio} disabled={!audio}>
                {playing ? "Pause" : "Play"}
            </button>
        </div>
        {#if fileName}
            <p class="file-name">{fileName}</p>
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

    @media (max-width: 600px) {
        h1 {
            font-size: 1.8rem;
        }

        .controls {
            flex-direction: column;
        }
    }
</style>
