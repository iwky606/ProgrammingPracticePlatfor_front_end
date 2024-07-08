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
import { useBestRowNumber } from '@/hooks/useListUtil';

import { ref } from 'vue';
import bus from 'vue3-eventbus'
import { onUnmounted } from 'vue';

import api from '@/api';
import toast from '@/utils/toast';

const goto = useGoto();

const row = ref(useBestRowNumber());
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const pageOptions = ref([10, 20, 30])
const page = ref(1);
const columns = ref([
    { field: 'id', header: '编号' },
    { field: 'title', header: '题目' },
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

const getQuestions = () => {
    api.questionApi.getQuestions({
        "pageNum": page.value,
        "pageSize": row.value
    }).then(res => {
        values.value = values.value.concat(res.data.data);
        page.value++;
        console.log(res);
    }).catch(err => {
        toast.error(err);
    })
}



onMounted(() => {
    getQuestions();
    total.value = 100 * 6;
    loading.value = false;
    bus.on('scroll-to-bottom', () => {
        // console.log('scroll-to-bottom');
        getQuestions();
    })
})

onUnmounted(() => {
    bus.off('scroll-to-bottom');
})
</script>

<style lang="scss" scoped>
.rank-container {
    // padding: 0 100px;
    margin-top: 20px;
}
</style>