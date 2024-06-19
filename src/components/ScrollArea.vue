<template>
    <div class="scroll-container">
        <slot></slot>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.scroll-container {
    height: 89vh;
    width: 100%;
    overflow: auto;
    padding: 20px;
}
</style>