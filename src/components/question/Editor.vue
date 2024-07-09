<template>
    <div class="editor-container">
        <div class="tool-box">
            <span>语言：</span>
            <Select v-model="lang" :options="langOption"/>
        </div>
        <codemirror v-model="code" placeholder="在此写下代码..." :autofocus="true" class="height-100 width-100 code-mirror"
            :indent-with-tab="true" :tab-size="4" @ready="handleReady" />
        <div class="submit-box gap-1">
            <!-- <Button label="测试" severity="secondary"></Button>
            <span> | </span> -->
            <Button label="提交" severity="contrast" @click="handleSubmission"></Button>
        </div>
    </div>
</template >

<script setup>
import { ref, shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import Button from 'primevue/button';
import Select from 'primevue/select';

const emit = defineEmits(['submit'])

const code = ref(``)
const view = shallowRef()

const handleReady = (payload) => {
    view.value = payload.view
}

const lang = ref('JAVA8')

const langOption = [
    'CPP20',
    'JAVA8',
    'JAVA17',
    'PYTHON3',
]

const getCodemirrorStates = () => {
    const state = view.value.state
    const ranges = state.selection.ranges
    const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
    const cursor = ranges[0].anchor
    const length = state.doc.length
    const lines = state.doc.lines
    return {
        state,
        ranges,
        selected,
        cursor,
        length,
        lines
    }
}

const handleSubmission = () => {
    const states = getCodemirrorStates()
    const processedCode = states.state.doc.text.map((line) => line.trim()).join('');
    emit('submit', processedCode, lang.value)
}

</script>

<style lang="scss" scoped>
.editor-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: #5556562f solid 1px;
    border-radius: 5px;
    width: 100%;

    .code-mirror {
        flex-grow: 1;
    }
}

.tool-box {
    height: 60px;
    width: 100%;
    border-bottom: 1px solid #5556562f;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.submit-box {
    height: 60px;
    width: 100%;
    border-top: 1px solid #5556562f;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    padding-right: 20px;
}
</style>