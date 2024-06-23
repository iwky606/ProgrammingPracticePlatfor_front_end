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
const pageOptions = ref([10, 20, 30])
const columns = ref([
    { field: 'user', header: '用户名' },
    { field: 'accept', header: '解题数' },
    { field: 'submit', header: '提交次数' },
    { field: 'accuracy', header: '准确率' }
])

const handlePageChange = (event) => {
    const page = event.page;
    const rows = event.rows;
    getRankList(page, rows);
}

const getRankList = (page = 1, rows = 10) => {
    row.value = rows;
    values.value = [];
    api.test.getRankList({ rows, page }).then(res => {
        values.value = res.data.values;
        total.value = res.data.total;
    }).finally(() => {
        loading.value = false;
    })
}

onMounted(() => {
    getRankList();
})
</script>

<style lang="scss" scoped>
.rank-container {
    // padding: 0 100px;
    margin-top: 20px;
}
</style>