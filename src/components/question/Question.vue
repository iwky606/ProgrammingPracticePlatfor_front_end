<template>
    <div class="question-container">
        <v-md-preview :text="text" height="400px"></v-md-preview>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    question: {
        type: String,
        required: true
    }
});

const text = computed(() => props.question);
</script>

<style lang="scss" scoped>
.question-container {
    display: flex;
    flex-direction: row;
    height: 100%;
    border: #5556562f solid 1px;
    border-radius: 5px;
}
</style>