<template>
    <Button icon="pi pi-angle-left" aria-label="返回" severity="contrast" class="back" @click="back"/>
</template>

<script setup>
import Button from 'primevue/button';
import QuestionEdit from '@/components/admin/QuestionEdit.vue';

import { useBack } from '@/hooks/useRouterUtil';

const back = useBack();
</script>

<style lang="scss" scoped>
.back {
    margin-bottom: 20px;
}
</style>