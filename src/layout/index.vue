<template>
    <div class="main-container">
        <div class="navbar">
            <Navbar />
        </div>
        <div class="main-router-view">
            <ScrollArea>
                <slot></slot>
            </ScrollArea>
        </div>
    </div>
    <Teleport to="body">
        <Toast />
    </Teleport>
</template>

<script setup>
import Toast from 'primevue/toast';
import Navbar from './Navbar.vue';
import ScrollArea from '@/components/ScrollArea.vue';

const emit = defineEmits(['scroll-to-bottom']);
</script>

<style lang="scss" scoped>

</style>