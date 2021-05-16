<script lang="ts">
    import { storage } from "../firebase";
    export let word: string;

    interface Recording {
        blob: Blob;
        src: any;
        name?: string;
    }

    //Globals
    let recording: Recording = {
        blob: null,
        src: null,
    };

    let isRecording: boolean = false;
    let saved: boolean;
    let data = [];
    let count: number = 0;
    let currentWord: string;

    //Reactive values
    $: if (isRecording) {
        setTimeout(async () => await (isRecording = false), 2100);
    }

    //Button functions
    const handleRec = () => {
        data = [];
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            const recorder = new MediaRecorder(stream);

            recorder.start(2000);
            isRecording = true;

            recorder.ondataavailable = function (e) {
                //add data to array for blob creation
                data.push(e.data);
                const blob = new Blob(data, { type: "audio/wav" });
                console.log(blob);
                let src = URL.createObjectURL(blob);
                //create individual recording parrams
                recording = {
                    blob: blob,
                    src: src,
                };
                saved = false;
                return recording;
            };
            //stop recording and add recording to array of recordings
            setTimeout(() => {
                recorder.stop();
            }, 2100);
        });
    };

    const handlePlay = (recording) => {
        const audio = new Audio(recording.src);
        audio.play();
    };

    const handleSave = (recording) => {
        word = word.toLowerCase();
        if (currentWord != word) {
            count = 0;
            currentWord = word;
        }
        saved = true;
        recording.name = word + count;
        count++;
        let storageRef = storage.ref(`${word}/${recording.name}`);
        storageRef.put(recording.blob);
    };
</script>

<div>
    <button disabled={isRecording} on:click={handleRec}>Record New</button>

    <button
        disabled={recording.blob === null || isRecording}
        on:click={() => handlePlay(recording)}>Play</button
    >

    <button
        disabled={saved === true || recording.blob === null}
        on:click={() => handleSave(recording)}>Save Recording</button
    >
</div>

{#if saved === true}
    <p>Recording saved!</p>
{/if}

<style>
    div {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    button {
        padding: 1rem;
        margin: 1rem 0.5rem;
        border-radius: 5px;
    }
    button:hover {
        cursor: pointer;
    }
    p {
        text-align: center;
    }
</style>
