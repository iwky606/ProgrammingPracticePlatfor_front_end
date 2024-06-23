<template>
    <div class="rank-container">
        <List :values="values" :row="row" :loading="loading" :total="total" @update:paginator="handlePageChange"
            :page-options="pageOptions" :columns="columns" @row-clicked="handleRowClick" />
    </div>
</template>

<script setup>
import List from '@/components/List.vue';
import { onMounted } from 'vue';

import { useGoto } from '@/hooks/useRouterUtil';

import { ref } from 'vue';

const goto = useGoto();

const row = ref(0);
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const pageOptions = ref([10, 20, 30])
const columns = ref([
    { field: 'id', header: '编号' },
    { field: 'title', header: '题目' },
    { field: 'level', header: '难度' },
    { field: 'accuracy', header: '准确率' },
    { field: 'process', header: '是否已完成' }
])

const handlePageChange = (event) => {
    const page = event.page;
    const rows = event.rows;
    getQuestions(page, rows);
}

const handleRowClick = (event) => {
    console.log(event);
    goto(`/question/${event.id}`);
}

const getQuestions = (page = 1, rows = 10) => {
    row.value = rows;
    values.value = [];
    for (let i = 1; i <= rows; i++) {
        values.value.push({
            id: i,
            title: '题目' + i,
            level: Math.floor(Math.random() * 3),
            accuracy: Math.floor(Math.random() * 100) + '%',
            process: Math.random() > 0.5 ? '是' : '否'
        });
    }
}

onMounted(() => {
    getQuestions();
    total.value = 100 * 6;
    loading.value = false;
})
</script>

<style lang="scss" scoped>
.rank-container {
    // padding: 0 100px;
    margin-top: 20px;
}
</style>