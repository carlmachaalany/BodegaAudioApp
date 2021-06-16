<script lang="ts">
    import { storage, db } from "../firebase";
    import * as _ from "lodash"

    import Fa from 'svelte-fa';
	import	{ faRecordVinyl } from '@fortawesome/free-solid-svg-icons';

    export let word: string;
    export let userEmail: string;
    export let allWords: any[];

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
        
        if (!word || word.length===0) {
            document.getElementById("error").style.display = "block";
            return;
        }

        document.getElementById("error").style.display = "none";

        const recordTxt = document.getElementById("record-txt");
        const recordIcon = document.getElementById("record-icon");

        recordTxt.style.display = "none";
        recordIcon.style.display = "block";

        data = [];
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {

            const recorder = new MediaRecorder(stream);

            recorder.start(2000);
            isRecording = true;

            recorder.ondataavailable = function (e) {
                //add data to array for blob creation
                data.push(e.data);
                const blob = new Blob(data, { type: "audio/wav" });
                console.log("The Blob: " + blob);
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
                recordTxt.style.display = "block";
                recordIcon.style.display = "none";
            }, 2100);
        });
    };

    const handlePlay = (recording) => {
        console.log(recording.src);
        const audio = new Audio(recording.src);
        audio.play();
    };

    const handleSave = async (recording) => {
        console.log("source: " + recording.src);
        word = word.toLowerCase();
        if (currentWord != word) {
            count = 0;
            currentWord = word;
        }
        saved = true;
        recording.name = word + count;
        count++;
        let storageRef = storage.ref(`${word}/${recording.name}`);
        console.log("Full path: " + storageRef.fullPath)
        console.log("Reference of word folder: " + storageRef.root.child(word))
        storageRef.put(recording.blob);
        
        // add the audio path to the user.words object in firestore
        if (allWords.includes(word)) {
            db.collection("users").doc(userEmail).get().then((doc) => {
                var countWords: number = doc.data().countOfWords;
				var wordsDic = doc.data().words;
                var newCountWords = countWords + 1;
                wordsDic[word].push(storageRef.fullPath);
                db.collection("users").doc(userEmail).update({
                    countOfWords: newCountWords,
                    words: wordsDic
                })
            })
        } else {

            const users = await db.collection('users').orderBy("countOfWords").get();

            const batches = _.chunk(users.docs, 500).map(userDocs => {
                const batch = db.batch()
                userDocs.forEach(doc => {
                    if (doc.id === userEmail) {
                        batch.set(doc.ref, { words: {[word]: [storageRef.fullPath]} }, { merge: true })
                    } else {
                        batch.set(doc.ref, { words: {[word]: []} }, { merge: true })
                    }
                })
                return batch.commit()
            })

            await Promise.all(batches);

            // add the word to the global word list
            const docGlobalWords = db.collection("users").doc("123456789");
            let getGlobalWords = await docGlobalWords.get();
            let globalWords: string[] = getGlobalWords.data().words;
            globalWords.push(word);
            docGlobalWords.update({words: globalWords});
        }
    };
</script>

<span style="display: none" id="error" class="helper-text red-text" data-error="wrong" data-success="right">Please enter a word before recording</span>
<div>
    <div class="record-button">
        <button
            id="record-btn"
            class="waves-effect waves-light teal accent-4"
            disabled={isRecording}
            on:click={handleRec}>
                <span id="record-txt">Record New</span>
                <Fa id="record-icon" style="display: none" icon={faRecordVinyl}/>
        </button>
    </div>

    <button
        class="waves-effect"
        disabled={recording.blob === null || isRecording}
        on:click={() => handlePlay(recording)}>Play</button
    >

    <button
        class="waves-effect"
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
    button:focus {
        background-color: #b2dfdb;
    }
    p {
        text-align: center;
    }
    #record-btn {
        color: whitesmoke;
    }
</style>