<template>
    
</template>

<script setup>
import { watch } from 'vue';
import { watchEffect } from 'vue';
import { nextTick } from 'vue';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue'

const props = defineProps({
    detail: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:text'])

const text = ref(props.detail.props.description.content)


</script>

<style lang="scss" scoped>

</style>