<template>
    <div class="flex row align-center line-container">
        <hr />
        <div class="slot-wrapper">
            <slot></slot>
        </div>
        <hr />
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.line-container {
    margin: 20px 0;
    width: 100%;
    // 动态计算宽度
    .slot-wrapper {
        margin: 0 20px;
    }
    hr {
        flex-grow: 1; 
        border: none;
        height: 1px;
        background-color: #e3e3e3;
    }
}
</style>