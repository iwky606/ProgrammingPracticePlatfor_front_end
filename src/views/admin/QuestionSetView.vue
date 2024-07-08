<template>
    <div class="question-container">
        <div class="flex">
            <div class="flex-grow"></div>
            <Button label="添加" severity="contrast" @click="handleAdd"></Button>
        </div>
        <List :values="values" :row="row" :loading="loading" :total="total" @update:paginator="handlePageChange"
            :page-options="pageOptions" :columns="columns" @row-clicked="handleRowClick" />
    </div>
    <QuestionSetDetailDialog :visible="visible" :form="form" @click:save="handleAddSet" @click:cancel="handleCancel"
        :mode="mode" @add:set="handleAddSet" />
</template>

<script setup>
import List from '@/components/List.vue';
import QuestionSetDetailDialog from '@/components/admin/QuestionSetDetailDialog.vue';

import Button from 'primevue/button';

import { ref, onMounted } from 'vue';
import api from '@/api';
import { useBestRowNumber } from '@/hooks/useListUtil';
import { watch, onUnmounted } from 'vue';
import bus from 'vue3-eventbus';
import { http } from '@/api/http';

const visible = ref(false);
const form = ref({});

const row = ref(0);
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const page = ref(1);
const mode = ref('edit');
const noMoreData = ref(false);
const pageOptions = ref([10, 20, 30])
const columns = ref([
    { field: 'id', header: '编号' },
    { field: 'title', header: '题目集' },
])

const handlePageChange = (event) => {
    const page = event.page;
    const rows = event.rows;
    getSets(page, rows);
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

const handleAdd = () => {
    console.log('add');
    form.value = {};
    visible.value = true;
    mode.value = 'add';
}

watch(() => visible.value, (val) => {
    if (!val && mode.value === 'add') {
        mode.value = 'edit';
    }
})

const getSets = async () => {
    values.value = [];
    loading.value = true;
    page.value = 1;
    api.questionSetApi.getSets({
        pageSize: useBestRowNumber(),
        pageNum: page.value
    }).then(res => {
        console.log(res);
        let processedValue = res.data.data.map(item => {
            if (item === null) {
                return {
                    title: '',
                    id: item.id
                }
            }
            if (item.info === null) {
                return {
                    title: '',
                    id: item.id
                }
            } return {
                title: item.info.title,
                id: item.id
            }
        })
        values.value = processedValue;
        page.value++;
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        loading.value = false;
    })
}

const handleAddSet = (detail) => {
    console.log(detail);
    http.post(`/problem_sets/edit/info?id=${detail.id}&endTime=${detail.endTime}&info.tips=${detail.info.tips}&info.title=${detail.info.title}&openTime=${detail.openTime}`).then(res => {
        console.log(res);
        getSets();
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        visible.value = false;
    })
}

const appendSets = () => {
    loading.value = true;
    api.questionSetApi.getSets({
        pageSize: page.value,
        pageNum: useBestRowNumber()
    }).then(res => {
        if (res.data.data.length === 0) {
            console.log('没有更多数据了');
            noMoreData.value = true;
            return;
        }
        console.log(res);
        let processedValue = res.data.data.map(item => {
            if (item === null) {
                return {
                    title: '',
                    id: item.id
                }
            }
            if (item.info === null) {
                return {
                    title: '',
                    id: item.id
                }
            }
            return {
                title: item.info.title,
                id: item.id
            }
        })
        values.value = values.value.concat(processedValue);
        page.value++;
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        loading.value = false;
    })
}

onMounted(() => {
    getSets();
    bus.on('scroll-to-bottom', () => {
        if (noMoreData.value) {
            return;
        }
        appendSets();
    })
})

onUnmounted(() => {
    bus.off('scroll-to-bottom');
})
</script>

<style lang="scss" scoped></style>