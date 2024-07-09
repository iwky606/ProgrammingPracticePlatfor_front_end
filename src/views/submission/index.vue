<template>
    <Fieldset legend="筛选">
        <form>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="problemId">问题编号: </label>
                    <InputText id="title" v-model="form.problemId" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="problemSetId">题目集编号: </label>
                    <InputText id="hint" v-model="form.problemSetId" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="userId">用户id: </label>
                    <InputText id="userId" v-model="form.userId" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="lang">语言: </label>
                    <Select v-model="form.lang" :options="langOption" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="status">提交状态: </label>
                    <Select v-model="form.status" :options="statusOption" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <Button label="查询" @click="getSubmissionList"></Button>
            </div>
        </form>
    </Fieldset>

    <div class="rank-container">
        <DataTable :value="values" @row-click="handleRowClick">
            <Column field="id" header="提交编号"></Column>
            <Column field="userId" header="用户名"></Column>
            <Column field="problemId" header="题目编号"></Column>
            <Column field="status" header="提交结果">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getSeverity(data.status)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="visible" modal header="提交详情">
        <form>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="et">提交编号: {{ submission.id }}</label>
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="et">提交时间: {{ submission.submissionTime }}</label>
                </div>
            </div>
            <div class="flex gap-3 mb-10">
                <div class="flex align-center gap-1 col">
                    <label for="code">代码: </label>
                </div>
                <Textarea id="code" v-model="submission.code" rows="5" cols="30" variant="filled" readonly autoResize />
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="status">状态: </label>
                    <Tag style="margin-left: 20px;" id='status' :value="submission.status"
                        :severity="getSeverity(submission.status)" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="et">执行时间: {{ submission.execTime }} ms</label>
                </div>
                <div class="flex align-center gap-1">
                    <label for="em">消耗内存: {{ submission.execMemory }} MB</label>
                </div>
            </div>
        </form>
        <template #footer>
            <Button label="关闭" severity="contrast" @click="visible = false" />
        </template>
    </Dialog>
</template>

<script setup>
import api from '@/api';
import List from '@/components/List.vue';
import { onMounted, reactive } from 'vue';

import Fieldset from 'primevue/fieldset';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

import { ref } from 'vue';
import { useBestRowNumber } from '@/hooks/useListUtil';
import { get } from '@/api/http';
import { timestampToTime } from '@/utils/time';

const page = ref(1);
const row = ref(useBestRowNumber());
const loading = ref(true);
const values = ref([]);
const total = ref(0);
const visible = ref(false);
const form = reactive({
    problemId: '',
    problemSetId: '',
    userId: '',
    lang: 'JAVA8',
    status: 'ACCEPT',
})
const submission = reactive({
    id: '',
    code: '',
    submissionTime: "",
    status: "",
    execTime: '',
    execMemory: '',
})

const langOption = [
    'CPP20',
    'JAVA8',
    'JAVA17',
    'PYTHON3',
]

const statusOption = [
    'ACCEPT', 'COMPILE_ERROR', 'MEMORY_LIMIT_EXCEED', 'NORMAL', 'OTHER_ERROR', 'RUNTIME_ERROR', 'TIME_LIMIT_EXCEED', 'WRONG_ANSWER'
]

const clearObj = async (obj) => {
    for (let key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key] = []
        } else if (typeof obj[key] === 'object') {
            clearObj(obj[key])
        } else {
            obj[key] = ''
        }
    }
}

const getSubmissionList = async () => {
    loading.value = true;
    api.submissionApi.getSubmission({
        ...form
    }).then(res => {
        console.log('res', res);
        values.value = res.data.data;
    }).finally(() => {
        loading.value = false;
    })
}

const handleRowClick = (row) => {
    console.log('row', row);
    clearObj(submission);
    getSubmissionDetail(row.data.id);
    visible.value = true;
}

const getSubmissionDetail = async (id) => {
    api.submissionApi.getSubmissionDetail(id).then(res => {
        console.log('res', res);
        submission.id = res.data.data.id;
        submission.code = res.data.data.code;
        submission.submissionTime = timestampToTime(res.data.data.submissionTime);
        submission.status = res.data.data.status;
        submission.execTime = res.data.data.execTime;
        submission.execMemory = res.data.data.execMemory;
    })
}

const getSeverity = (status) => {
    switch (status) {
        case 'ACCEPT':
            return 'success';
        case 'COMPILE_ERROR':
            return 'warn';
        case 'MEMORY_LIMIT_EXCEED':
            return 'warn';
        case 'NORMAL':
            return 'info';
        case 'OTHER_ERROR':
            return 'warn';
        case 'RUNTIME_ERROR':
            return 'warn';
        case 'TIME_LIMIT_EXCEED':
            return 'warn';
        case 'WRONG_ANSWER':
            return 'danger';
        default:
            return 'info';
    }
}

onMounted(() => {
    getSubmissionList();
})
</script>

<style lang="scss" scoped>
.rank-container {
    // padding: 0 100px;
    margin-top: 20px;
}
</style>