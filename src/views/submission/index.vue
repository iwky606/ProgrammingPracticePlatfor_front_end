<template>
    <div class="rank-container">
        <List :values="values" :row="row" :loading="loading" :total="total" @update:paginator="handlePageChange"
            :page-options="pageOptions" :columns="columns" />
    </div>
</template>

<script setup>
import api from '@/api';
import List from '@/components/List.vue';
import { onMounted } from 'vue';

import { ref } from 'vue';

const row = ref(0);
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const columns = ref([
    { field: 'id', header: '提交编号' },
    { field: 'user', header: '用户名' },
    { field: 'submit', header: '提交结果' },
])

onMounted(() => {
    
})
</script>

<style lang="scss" scoped>
.rank-container {
    // padding: 0 100px;
    margin-top: 20px;
}
</style>