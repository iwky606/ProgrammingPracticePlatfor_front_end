<template>
    <div class="question-container">
        <List :values="values" :row="row" :loading="loading" :total="total" @update:paginator="handlePageChange"
            :page-options="pageOptions" :columns="columns" @row-clicked="handleRowClick" />
    </div>
    <QuestionDetailDialog :visible="visible" :form="form" @click:save="handleSave" @click:cancel="handleCancel"/>
</template>

<script setup>
import List from '@/components/List.vue';
import QuestionDetailDialog from '@/components/admin/QuestionDetailDialog.vue';

import { ref, onMounted } from 'vue';
import api from '@/api';

const visible = ref(false);
const form = ref({});

const row = ref(0);
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const pageOptions = ref([10, 20, 30])
const columns = ref([
    { field: 'id', header: '编号' },
    { field: 'title', header: '题目' },
    { field: 'level', header: '难度' },
])

const handlePageChange = (event) => {
    const page = event.page;
    const rows = event.rows;
    getQuestions(page, rows);
}

const handleRowClick = (event) => {
    console.log(event);
    form.value = event;
    visible.value = true;
}

const handleSave = () => {
    console.log('save');
    visible.value = false;
}

const handleCancel = () => {
    console.log('cancel');
    visible.value = false;
}

const getQuestions = async (page = 1, rows = 10) => {
    row.value = rows;
    values.value = [];
    loading.value = true;
    api.test.getAdminQuestions({ rows, page }).then(res => {
        values.value = res.data.values;
        total.value = res.data.total;
    }).finally(() => {
        loading.value = false;
    })
}

onMounted(() => {
    getQuestions();
})
</script>

<style lang="scss" scoped></style>