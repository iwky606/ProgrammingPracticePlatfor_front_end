<template>
    <div class="flex col gap-2">
        <Skeleton class="mb-2"></Skeleton>
        <Skeleton width="10rem" class="mb-2"></Skeleton>
        <Skeleton width="5rem" class="mb-2"></Skeleton>
        <Skeleton height="2rem" class="mb-2"></Skeleton>
        <Skeleton width="10rem" height="4rem"></Skeleton>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Skeleton from 'primevue/skeleton';
import { useGoto } from '@/hooks/useRouterUtil';
import { onMounted } from 'vue';

const goto = useGoto();

onMounted(() => {
    goto('/questions');
});
</script>

<style lang="scss" scoped>

</style>