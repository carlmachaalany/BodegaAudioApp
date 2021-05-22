<script lang="ts">
    import Modal from "./Modal.svelte";

    let isOpen: boolean = false;

    const toggleModal = () => {
        isOpen = !isOpen;
    };
</script>

<nav class="teal accent-4">
    <div class="container nav-wrapper teal accent-4">
        <div class="left brand-logo">Bodega Audio</div>
        <ul id="nav-mobile" class="right">
            <li>
                <div
                    class="button btn-flat waves-effect"
                    on:click={toggleModal}
                >
                    Login
                </div>
            </li>
        </ul>
    </div>
</nav>
{#if isOpen}
    <Modal />
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
