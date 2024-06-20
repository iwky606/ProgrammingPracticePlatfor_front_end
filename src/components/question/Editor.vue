<template>
    <div class="editor-container">
        <codemirror v-model="code" placeholder="Code goes here..." :autofocus="true" class="height-100 width-100"
            :indent-with-tab="true" :tab-size="2" @ready="handleReady" @change="log('change', $event)"
            @focus="log('focus', $event)" @blur="log('blur', $event)" />
    </div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
const code = ref(`console.log('Hello, world!')`)

// Codemirror EditorView instance ref
const view = shallowRef()
const handleReady = (payload) => {
    view.value = payload.view
}

        // Status is available at all times via Codemirror EditorView
const getCodemirrorStates = () => {
    const state = view.value.state
    const ranges = state.selection.ranges
    const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
    const cursor = ranges[0].anchor
    const length = state.doc.length
    const lines = state.doc.lines
    // more state info ...
    // return ...
}

</script>

<style lang="scss" scoped>
.editor-container {
    display: flex;
    height: 100%;
    border: #5556562f solid 1px;
    border-radius: 5px;
    width: calc(100%);
}
</style>