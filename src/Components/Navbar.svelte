<script lang="ts">
    import { auth } from "../firebase";

    import Modal from "./Modal.svelte";

    let isOpen: boolean = false;
    export let isLoggedIn: boolean;

    const toggleModal = () => {
        isOpen = !isOpen;
    };

    function logOut() {
        auth.signOut();
    }
</script>

<nav class="teal accent-4">
    <div class="container nav-wrapper teal accent-4">
        <div class="left brand-logo">Bodega Audio</div>
        <ul id="nav-mobile" class="right">
            <li>
                {#if isLoggedIn}
                    <div class="button btn-flat waves-effect" on:click={logOut}>
                        Logout
                    </div>
                {:else}
                    <div
                        class="button btn-flat waves-effect"
                        on:click={toggleModal}
                    >
                        Login
                    </div>
                {/if}
            </li>
        </ul>
    </div>
</nav>
{#if isOpen}
    <Modal bind:isOpen />
{/if}

<style>
    .button {
        color: whitesmoke;
    }
    nav {
        top: 0;
        position: fixed;
        z-index: 1;
    }
</style>
