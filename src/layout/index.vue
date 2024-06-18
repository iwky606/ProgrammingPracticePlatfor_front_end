<template>
    <div class="main-container">
        <div class="navbar">
            <Navbar />
        </div>
        <div class="main-router-view">
            <slot></slot>
        </div>
    </div>
    <Teleport to="body">
        <Toast />
    </Teleport>
</template>

<script setup>
import Toast from 'primevue/toast';
import Navbar from './Navbar.vue';

</script>

<style lang="scss" scoped>

</style>