<template>
    <div class="question-container">
        <div class="flex">
            <div class="flex-grow"></div>
            <Button label="添加" severity="contrast" @click="handleAdd"></Button>
        </div>
        <List :values="values" :row="row" :loading="loading" :total="total" @update:paginator="handlePageChange"
            :page-options="pageOptions" :columns="columns" @row-clicked="handleRowClick" />
    </div>
    <QuestionDetailDialog :visible="visible" :form="form" @click:save="handleSave" @click:cancel="handleCancel"
        @click:del="handleDel" @add:question="handleAddQuestion" :mode="mode" />
</template>

<script setup>
import List from '@/components/List.vue';
import QuestionDetailDialog from '@/components/admin/QuestionDetailDialog.vue';
import Button from 'primevue/button';
import { useBestRowNumber } from '@/hooks/useListUtil';
import { ref, onMounted } from 'vue';
import api from '@/api';
import toast from '@/utils/toast';
import { watch } from 'vue';
import bus from 'vue3-eventbus';
import { onUnmounted } from 'vue';

const visible = ref(false);
const form = ref({});

const row = ref(useBestRowNumber());
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const page = ref(1);
let noMoreData = false;
const mode = ref('edit');
const pageOptions = ref([10, 20, 30])
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
    form.value = event;
    visible.value = true;
}

const handleAdd = () => {
    mode.value = 'add';
    form.value = {};
    visible.value = true;
}

const handleAddQuestion = async (detail) => {
    console.log('add: ', detail);
    api.questionApi.addQuestion(detail).then(res => {
        console.log('addres', res);
        toast.success('添加成功');
        getQuestions();
        // values.value.push(res.data.data);
    }).catch(err => {
        console.log('err', err);
        toast.error(err.data.message);
    }).finally(() => {
        visible.value = false;
        mode.value = 'edit'
    })
}

const handleSave = async (detail) => {
    console.log('save: ', detail);
    api.questionApi.updateQuestion(detail).then(res => {
        console.log('res', res);
        toast.success('保存成功');
        values.value.forEach((item, index) => {
            if (item.id === detail.id) {
                item['title'] = detail['title'];
            }
        })
    }).catch(err => {
        console.log('err', err);
        toast.error(err);
    }).finally(() => {
        visible.value = false;
        mode.value = 'edit'
    })
}

const handleCancel = () => {
    visible.value = false;
}

const handleDel = async (id) => {
    console.log('del: ', id);
    api.questionApi.delQuestion(id).then(res => {
        console.log('delres', res);
        if (res.data.message == 'ok') {
            toast.success('删除成功');
            values.value = values.value.filter(item => item.id !== id);
            visible.value = false;12
        } else { 
            toast.error('删除失败');
        }
    }).catch(err => {
        console.log('err', err);
        visible.value = false;
        toast.error(err);
    }).finally(() => {
        mode.value = 'edit'
    })
}

const getQuestions = async () => {
    values.value = [];
    loading.value = true;
    page.value = 1;
    api.questionApi.getQuestions({
        "pageNum": page.value,
        "pageSize": row.value
    }).then(res => {
        values.value = res.data.data;
        console.log(page.value, ": ", res);
        page.value++;
    }).catch(err => {
        toast.error(err);
    }).finally(() => {
        loading.value = false;
    })
}

const appendQuestions = async () => {
    loading.value = true;
    console.log('params', page.value, row.value);
    api.questionApi.getQuestions({
        "pageNum": page.value,
        "pageSize": row.value
    }).then(res => {
        if (res.data.data.length === 0) {
            toast.info('没有更多数据了');
            noMoreData = true;
            return;
        }
        values.value = values.value.concat(res.data.data);
        console.log(page.value, ": ", res);
        page.value++;
    }).catch(err => {
        toast.error(err);
    }).finally(() => {
        loading.value = false;
    })
}

watch(() => visible.value, (val) => {
    if (!val && mode.value === 'add') {
        mode.value = 'edit';
    }
})

onMounted(() => {
    getQuestions();
    bus.on('scroll-to-bottom', () => {
        if (noMoreData) {
            return;
        }
        appendQuestions();
    })
})

onUnmounted(() => {
    bus.off('scroll-to-bottom');
})
</script>

<style lang="scss" scoped></style>