<template>
    <Dialog v-model:visible="visible" @update:visible="emit('click:cancel')" modal :style="{ width: '80%', }">
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="title">编辑题目集</span>
            </div>
        </template>
        <form class="form">
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="title">题目标题: </label>
                    <InputText id="title" v-model="detail.info.title" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="hint">提示内容: </label>
                    <InputText id="hint" v-model="detail.info.tips" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="title">开始时间: </label>
                    <DatePicker id="datepicker-24h" v-model="detail.openTime" showTime hourFormat="24" fluid />
                </div>
                <div class="flex align-center gap-1">
                    <label for="hint">结束时间: </label>
                    <DatePicker id="datepicker-24h" v-model="detail.endTime" showTime hourFormat="24" fluid />
                </div>
            </div>
            <div class="flex align-center gap-3">
                <div class="flex align-center gap-1">
                    <label>题目: </label>
                    <div class="flex row gap-1 tags" style="height: 400px">
                        <DataTable v-model:selection="selected" selectionMode="multiple" dataKey="id" :value="problems"
                            scrollable scrollHeight="flex" tableStyle="min-width: 50rem" @row-click="handleSelect">
                            <Column field="id" header="id"></Column>
                            <Column field="title" header="题目"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <div class="flex align-center gap-3">
                <div class="flex row gap-1 tags" style="padding-left: 40px; margin-top: 20px;">
                    <Button label="上一页" severity="secondary" @click="previousPage" outlined></Button>
                    <Button label="下一页" severity="secondary" @click="nextPage" outlined></Button>
                </div>
            </div>
        </form>
        <template #footer>
            <Button label="取消" severity="secondary" @click="handleCancel"></Button>
            <Button label="保存" severity="contrast" @click="handleSave"></Button>
        </template>
    </Dialog>
    <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useConfirm } from "primevue/useconfirm";

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import FileUpload from 'primevue/fileupload';
import ConfirmDialog from 'primevue/confirmdialog';
import DatePicker from 'primevue/datepicker';
import PickList from 'primevue/picklist';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

import { useGoto } from '@/hooks/useRouterUtil';
import { timeToTimestamp } from '@/utils/time';
import { reactive } from 'vue';
import api from '@/api';
import { watch } from 'vue';
import toast from '@/utils/toast';
import { toRaw } from 'vue';

const goto = useGoto()
const confirm = useConfirm();

const emit = defineEmits(['click:save', 'click:cancel', 'click:del', 'add:set'])

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    form: {
        type: Object,
        default: () => ({}),
        required: true
    },
    mode: {
        type: String,
        default: 'edit'
    }
})

const visible = computed(() => props.visible)
const addVisible = ref(false)
const newLabel = ref('')
const form = computed(() => props.form)
const problems = ref([])
const page = ref(1)
const noMoreData = ref(false)
const selected = ref([])
const detail = reactive({
    createTime: 0,
    createUser: 0,
    endTime: 0,
    id: 0,
    info: {
        tips: '',
        title: ''
    },
    openTime: 0,
    problemList: {
        problems: [],
        total: 0,
    },
    updateTime: 0
});
const createdQuestions = []

const handleSave = () => {
    let setForm = toRaw(detail)
    console.log('setForm:', setForm);
    // for (let row of selected.value) {
    //     // setForm.problems.push(row.id)
    // }
    if (detail.openTime !== '') {
        setForm.openTime = timeToTimestamp(detail.openTime)
    }
    if (detail.endTime !== '') {
        setForm.endTime = timeToTimestamp(detail.endTime)
    }
    if (check()) {
        if (props.mode === 'edit') {
            emit('click:save', setForm)
        } else if (props.mode === 'add') {
            emit('add:set', setForm)
        }
    }
}

const handleCancel = () => {
    emit('click:cancel')
}

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

const deepCopy = (tar, src) => {
    for (let key in src) {
        if (Array.isArray(src[key])) {
            tar[key] = src[key].slice()
        } else if (typeof src[key] === 'object') {
            tar[key] = {}
            deepCopy(tar[key], src[key])
        } else {
            tar[key] = src[key]
        }
    }
}

const getSet = async () => {
    const params = {
        id: props.form.id,
        pageNum: 1,
        pageSize: 50
    }
    api.questionSetApi.getSet(params).then(res => {
        deepCopy(detail, res.data.data)
        for (let i = 0; i < detail.problemList.problems.length; i++) {
            const question = {};
            const item = detail.problemList.problems[i];
            question[item.id] = item.id;
            createdQuestions.push(question)
        }
    }).catch(err => {
        console.log('err', err);
        toast.error(err);
    })

}

const previousPage = () => {
    if (page.value > 1) {
        page.value--;
        getQuestions();
        noMoreData.value = false;
    }
}

const nextPage = () => {
    if (noMoreData.value) {
        return;
    }
    page.value++;
    getQuestions();
}

const hasCreated = (id) => {
    for (let i = 0; i < createdQuestions.length; i++) {
        if (createdQuestions[i].hasOwnProperty(id)) {
            return createdQuestions[i][id];
        }
    }
    return -1;
}

const handleSelect = (row) => {
    const id = row.data.id;
    if (detail.problemList.problems.some(item => item.id == id)) {
        delQuestion(id);
        return;
    }
    console.log('select:', id);
    const sid = hasCreated(id)
    if (sid !== -1) {   
        console.log('has created:', sid);
        detail.problemList.problems.push(sid);
        addQuestion(sid);
    } else {
        getQuestion(id);
        // console.log('create id:', id);
    }
    console.log('problems:', selected.value);
}

const getQuestions = async () => {
    problems.value = [];
    api.questionApi.getQuestions({
        "pageNum": page.value,
        "pageSize": 10
    }).then(res => {
        if (res.data.data.length < 10) {
            if (page.value !== 1) {
                toast.info('没有更多数据了');
            }
            noMoreData.value = true;
        } else {
            noMoreData.value = false;
        }
        problems.value = res.data.data;
        // console.log(detail.problemList.problems);
    }).catch(err => {
        toast.error(err);
    })
}

const getQuestion = async (id) => {
    api.questionApi.getQuestion(id).then(res => {
        createQuestion(id, res.data.data)
    }).catch(err => {
        toast.error(err);
    })
} 

const createQuestion = async (id, params) => {
    api.questionApi.addQuestion(params).then(res => {
        const question = {}
        const self = {}
        const newId = res.data.data
        question[id] = newId
        self[newId] = newId
        addQuestion(newId);
        console.log('res', newId);
        createdQuestions.push(question)
        createdQuestions.push(self)
        selected.value.push({
            ...params,
            'id': newId,
            'visible': 'CONTEST'
        })
        selected.value = selected.value.filter(item => item.id != id)
        console.log('problems-after:', JSON.parse(JSON.stringify(selected.value)));
        console.log('created:', JSON.parse(JSON.stringify(createdQuestions)));
        if (noMoreData.value) {
            getQuestions();
        }
    }).catch(err => {
        toast.error(err);
    })
}

const getSelected = async () => {
    const promiseList = []
    for (let i = 0; i < detail.problemList.problems.length; i++) {
        const id = detail.problemList.problems[i];
        promiseList.push(api.questionApi.getQuestion(id))
    } 
    Promise.all(promiseList).then(res => {
        for (let i = 0; i < res.length; i++) {
            selected.value.push(res[i].data.data)
        }
    }).catch(err => {
        toast.error(err);
    })
}

const getSetId = async () => {
    api.questionSetApi.getNewSetId().then(res => {
        detail.id = res.data.data
    }).catch(err => {
        console.log(err);
    })
}

const addQuestion = async (id) => {
    const params = {
        problemId: id,
        problemSetsId: detail.id
    }
    api.questionSetApi.addQuestion(params).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

const delQuestion = async (id) => {
    const params = {
        problemId: id,
        problemSetsId: detail.id
    }
    api.questionSetApi.delQuestion(params).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    })
}

const check = () => {
    if (detail.info.title === '') {
        toast.error('请输入标题');
        return false;
    }
    return true;
}

watch(() => props.visible, (value) => {
    if (value) {
        selected.value = [];
        clearObj(detail);
        getQuestions();
        if (props.mode === 'edit') {
            getSet()
            getSelected()
        } else if (props.mode === 'add') {
            getSetId()
        }
    }
})



</script>

<style lang="scss" scoped>
.tip {
    color: #666;
    margin-bottom: 8px;
    font-size: 14px;
}

.title {
    font-size: 20px;
    font-weight: 600;

}

.editor {
    margin-top: 20px;
    height: 400px;

    span {
        margin-bottom: 20px;
    }
}

.tags {
    height: 39px;
}

.container {
    height: 100%;
}

.v-editor {
    height: 400px;
}

.each-tag {
    cursor: pointer;
}

// form {
//     height: 550px;
// }</style>