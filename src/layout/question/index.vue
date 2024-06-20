<template>
    <div class="flex row align-center height-100 width-100 flex-1" @mousemove="handleMouseMove"
        @mouseup="handleMouseUp">
        <div class="left" :style="`width: ${leftWidth}`">
            <slot name="left"></slot>
        </div>
        <div class="splitter" @mousedown="handleMouseDown">

        </div>
        <div class="right" :style="`width: ${rightWidth}`">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const leftWidth = ref('50%');
const rightWidth = ref('50%');

const mousedown = ref(false);

const handleMouseDown = (e) => {
    mousedown.value = true;
    console.log("mousedown");
}

const handleMouseUp = (e) => {
    if (mousedown.value == true) {
        mousedown.value = false;
        console.log("mouseup");
    }
}

const handleMouseMove = (e) => {
    if (mousedown.value == true) {
        console.log(e);
    }
}


</script>

<style lang="scss" scoped>
.left {
    height: 100%;
    padding-right: 2px;
    // border: #020617 3px solid;
    // border-radius: 10px 0 0 10px;
}
.right {
    height: 100%;
    padding-left: 2px;
    // border: #020617 3px solid;
    // border-radius: 0 10px 10px 0;
}
.splitter {
    // width: 7px;
    // height: 100%;
    // background-color: #020617;
    // margin: 0 20px;
    // border: #020617 1px solid;
    // border-radius: 10px;
    // cursor: ew-resize;
}
</style>