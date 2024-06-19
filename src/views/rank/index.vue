<template>
    <div class="rank-container">
        <ScrollArea>
            <RankList :ranklist="[]" :row="rows" :loading="loading" />
        </ScrollArea>
    </div>
</template>

<script setup>
import RankList from '@/components/rank/RankList.vue';
import ScrollArea from '@/components/ScrollArea.vue';

import { ref } from 'vue';

const rows = ref(30);
const loading = ref(true);
const ranklist = ref([]);
</script>

<style lang="scss" scoped>
.rank-container {
    padding: 0 100px;
    margin-top: 20px;
}
</style>