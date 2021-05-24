<script lang="ts">
    import { auth } from "../firebase";

    export let isOpen: boolean;
    let email;
    let password;
    let phone;
    let loginError: string;

    function toggleModal(e) {
        if (e.target === this) {
            isOpen = !isOpen;
        }
    }

    function handleLogin(email, password) {
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log(userCredential);
                isOpen = !isOpen;
            })
            .catch((error) => {
                console.log(error);
                loginError = error.message;
            });
    }
    function handleSignUp(email, password) {
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log(userCredential);
                isOpen = !isOpen;
            })
            .catch((error) => {
                console.log(error);
                loginError = error.message;
            });
    }
</script>

<div on:click={toggleModal} class="modal-background">
    <div class="container modal-content">
        {#if loginError != undefined}
            <p class="error">{loginError}</p>
        {/if}
        <div class="container input-field">
            <label for="email">email</label>
            <input id="email" type="email" bind:value={email} />
        </div>
        <div class="container input-field">
            <label for="password">password</label>
            <input id="password" type="password" bind:value={password} />
        </div>

        <p class="center-align">Or</p>

        <div class="container input-field">
            <label for="phone">phone number</label>
            <input id="phone" type="tel" bind:value={phone} />
        </div>

        <div class="btn-container center-align">
            <div class="btn" on:click={() => handleLogin(email, password)}>
                Login
            </div>
            <div class="btn" on:click={() => handleSignUp(email, password)}>
                Sign Up
            </div>
        </div>
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
        padding-top: 5rem;
        background-color: whitesmoke;
        border-radius: 5px;
        position: relative;
        top: 10%;
        height: 70%;
    }
    .btn-container {
        padding: 2rem;
    }
    .btn-container div {
        margin-left: 1.5rem;
    }
    p {
        margin: 2rem;
        font-weight: bold;
    }
    .error {
        margin: 0;
        font-size: smaller;
        color: red;
        text-align: center;
    }
</style>
