<script lang="ts">
    import { functions, db, dbNotCalled } from "../firebase";
    import Fa from 'svelte-fa';
	import	{ faTrash } from '@fortawesome/free-solid-svg-icons';
    import * as _ from "lodash"
    import "../firebase";

    export let modalOpen: boolean;
    let showWords: boolean = true;
    let showUsers: boolean = false;
    let globalWords: string[] = []
    let allUsers: string[] = [];

    function toggleAdminModal(e) {
        if (e.target === this) {
            modalOpen = !modalOpen;
        }
    }

    const displayWords = () => {
        showWords = true;
        showUsers = false;
    }

    const displayUsers = () => {
        showWords = false;
        showUsers = true;
    }
    const displayAdmin = () => {
        showWords = false;
        showUsers = false;
    }

    async function getAllUsers() {
        const users = await db.collection('users').orderBy("countOfWords").get();
        users.docs.forEach(user => {
            allUsers.push(user.id)
        })
    }
    getAllUsers();

    async function getAllWords() {
        const docGlobalWords = db.collection("users").doc("123456789");
        let getGlobalWords = await docGlobalWords.get();
        globalWords = getGlobalWords.data().words;
    }
    getAllWords();

    // remove a word 
    function removeWord(e) {
        e.currentTarget.parentElement.parentElement.style.display = "none";
        const wordRemoved = e.currentTarget.parentElement.textContent;
        globalWords.splice(globalWords.indexOf(wordRemoved), 1);
        db.collection("users").doc("123456789").update({
            words: globalWords
        }).then(async () => {
            // go over users and delete ever user's specific word

            const users = await db.collection('users').orderBy("countOfWords").get();

            const batches = _.chunk(users.docs, 500).map(userDocs => {
                const batch = db.batch()
                userDocs.forEach(doc => {
                    batch.set(doc.ref, { words: {[wordRemoved]: dbNotCalled.FieldValue.delete()} }, { merge: true })
                })
                return batch.commit()
            })
            await Promise.all(batches);

        })
    }

    async function addWord(e) {
        const addedWord = document.getElementById("added-word");
        if (globalWords.includes(addedWord.value)) {
            console.log("word already in list");
            return null;
        }
        globalWords.push(addedWord.value);
        await db.collection("users").doc("123456789").update({ words: globalWords });

        const users = await db.collection('users').orderBy("countOfWords").get();
        const batches = _.chunk(users.docs, 500).map(async userDocs => {
            const batch = db.batch()
            console.log("before")
            await userDocs.forEach(async doc => {
                batch.set(doc.ref, { words: {[addedWord.value]: []} }, { merge: true })
            })
            console.log("after");
            return batch.commit();
        })
        await Promise.all(batches);
        addedWord.value = "";
    }

    function searchUsers() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('search-user');
        filter = input.value.toUpperCase();
        ul = document.getElementById("usersUL");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("div")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            } else {
            li[i].style.display = "none";
            }
        }
    }

    function searchWords() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('search-word');
        filter = input.value.toUpperCase();
        ul = document.getElementById("wordsUL");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("div")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            } else {
            li[i].style.display = "none";
            }
        }
    }

    // Net Ninja: add admin cloud function
	let adminEmail: string;
    let adminResult: string;
	const addAdmin = (e) => {
		e.preventDefault();
		const addAdminRole = functions.httpsCallable('addAdminRole');
        document.getElementById("admin-email").value = "";
		addAdminRole({email: adminEmail}).then(result => {
			adminResult = `Success! ${adminEmail} has been added as an admin`;
		})
	}
</script>

<div on:click={toggleAdminModal} class="modal-background">
    
    <div class="container modal-content">
        <nav class="nav-extended">
            <div class="nav-wrapper">
              <span class="brand-logo">Admin UI</span>
            </div>
            <div class="nav-content">
              <ul class="tabs tabs-transparent">
                <!-- svelte-ignore a11y-missing-attribute -->
                <li id="word-tab" class="tab" on:click={displayWords}><a class="active">Words</a></li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <li class="tab" on:click={displayUsers}><a class="active">Users</a></li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <li class="tab" on:click={displayAdmin}><a class="active">Add Admin</a></li>
              </ul>
            </div>
        </nav>

        {#if showWords}
            <div class="container">
                <div class="add-word input-field">
                    <button on:click={addWord} style="background-color: #EF6E73;" class="btn">Add Word</button>
                    <input id="added-word" type="text" class="active">
                </div>
                <div style="transform: translateY(10px);" class="input-field">
                    <label for="search-word">Search Users</label>
                    <input on:keyup={searchWords} id="search-word" type="text" class="active">
                </div>
                <ul id="wordsUL" class="collection collection-words">
                    {#each globalWords as word}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <li class="collection-item"><div>{word}<a on:click={removeWord} class="secondary-content"><Fa style="color: #EF6E73;" icon={faTrash}/></a></div></li>
                    {/each}
                </ul>
            </div>
        {:else if showUsers}
            <div class="container">
                <div style="transform: translateY(9px);" class="input-field">
                    <label for="search-user">Search Users</label>
                    <input on:keyup={searchUsers} id="search-user" type="text" class="active">
                </div>
                <ul id="usersUL" class="collection collection-words">
                    {#each allUsers as user}
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <li class="collection-item"><div>{user}</div></li>
                    {/each}
                </ul>
            </div>
        {:else}
            <div class="add-admin">
                <div class="input-field">
                    <input placeholder="User email" id="admin-email" bind:value={adminEmail} type="email" class="active">
                    <span class="helper-text">{adminResult || ""}</span>
                    <button on:click={addAdmin} style="background-color: #EF6E73;" class="btn">Make Admin</button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .modal-background {
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.3);
    }
    .modal-content {
        background-color: whitesmoke;
        border-radius: 5px;
        position: relative;
        top: 10%;
        height: 75%;
    }
    p {
        margin: 2rem;
        font-weight: bold;
    }
    /* .error {
        margin: 0;
        font-size: smaller;
        color: red;
        text-align: center;
    } */
    .container {
        overflow: auto;
    }
    .add-word {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .add-word input{
        width: 50%;
        margin-left: 10px;
    }
    .collection-words {
        position: relative;
        overflow: scroll !important;
    }
    .input-field input[type=text]:focus {
     border-bottom: 1px solid #EF6E73;
     box-shadow: 0 1px 0 0 rgb(219, 203, 203);
   }
   .input-field input[type=email]:focus {
     border-bottom: 1px solid #EF6E73;
     box-shadow: 0 1px 0 0 rgb(219, 203, 203);
   }
   .add-admin {
       padding: 10px;
       display: flex;
       justify-content: center;
       align-content: center;
   }
</style>
