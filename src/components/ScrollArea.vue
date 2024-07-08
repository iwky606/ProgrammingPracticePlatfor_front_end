<template>
    <div class="scroll-container" @scroll="handleScroll">
        <slot></slot>
    </div>
</template>

<script setup>
import { debounce } from '@/utils/common';
import bus from 'vue3-eventbus'

const handleScroll = debounce((e) => {
    const target = e.target;
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
        bus.emit('scroll-to-bottom');
    }
}, 100);
</script>

<style lang="scss" scoped>
.scroll-container {
    height: 89vh;
    width: 100%;
    overflow: auto;
    padding: 20px;
}
</style>