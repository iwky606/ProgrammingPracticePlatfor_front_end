<template>
    <div class="container width-100 flex row">
        <v-md-editor v-model="text"></v-md-editor>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('# Hello World')
</script>

<style lang="scss" scoped>
.container {
    height: 90% ;
}
</style>