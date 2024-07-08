<template>
    <Dialog v-model:visible="visible" @update:visible="emit('click:cancel')" modal :style="{ width: '80%', }">
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="title">编辑题目</span>
            </div>
        </template>
        <form class="form">
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="title">题目标题: </label>
                    <InputText id="title" v-model="detail.title" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="hint">提示内容: </label>
                    <InputText id="hint" v-model="detail.description.hint" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="visible">可见性: </label>
                    <Select v-model="detail.visible" :options="optionVisible" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="memoryLimit">输入样例: </label>
                    <InputText id="memoryLimit" v-model="detail.description.exampleInput" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="timeLimit">输出样例: </label>
                    <InputText id="timeLimit" v-model="detail.description.exampleOutput" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="memoryLimit">内存限制: </label>
                    <InputText id="memoryLimit" v-model="detail.judgeConfig.memoryLimit" />
                </div>
                <div class="flex align-center gap-1">
                    <label for="timeLimit">时间限制: </label>
                    <InputText id="timeLimit" v-model="detail.judgeConfig.timeLimit" />
                </div>
            </div>
            <div class="flex align-center gap-3">
                <div class="flex align-center gap-1">
                    <label>标签: </label>
                    <div class="flex row gap-1 tags">
                        <Tag v-for="item in detail.tags" icon="pi pi-times" severity="secondary" :key="item"
                            :value="item" class="each-tag" @click="handleTagRemove">
                        </Tag>
                    </div>
                    <Button icon="pi pi-plus-circle" severity="secondary" aria-label="添加标签"
                        style="border-radius: 50%; height: 25px; width: 25px;" @click="addVisible = true" />
                </div>
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="memoryLimit">输入/输出文件: </label>
                    <div class="flex row gap-1 tags">
                        <Tag v-for="item in inputAndOutputFiles" icon="pi pi-times" severity="secondary" :key="item"
                            :value="`${item.input}/${item.output}`" class="each-tag" @click="handleIORemove">
                        </Tag>
                    </div>
                    <Button icon="pi pi-plus-circle" severity="secondary" aria-label="添加文件"
                        style="border-radius: 50%; height: 25px; width: 25px;" @click="ioVisible = true" />
                </div>
            </div>
            <div class="editor flex col">
                <Tabs value="0" class="height-100">
                    <TabList>
                        <Tab value="0">编辑题目信息</Tab>
                        <Tab value="1">编辑题解信息</Tab>
                    </TabList>
                    <TabPanels class="height-100">
                        <TabPanel value="0" class="height-100">
                            <div class="container width-100 flex row">
                                <v-md-editor v-model="detail.description.content" class="v-editor"></v-md-editor>
                            </div>
                        </TabPanel>
                        <TabPanel value="1" class="height-100">
                            <div class="container width-100 flex row">
                                <v-md-editor v-model="detail.solution.content" class="v-editor"></v-md-editor>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </form>
        <template #footer>
            <Button label="删除" severity="danger" @click="handleDel" v-if="props.mode == 'edit'"></Button>
            <div class="flex-grow" v-if="props.mode == 'edit'"></div>
            <Button label="取消" severity="secondary" @click="handleCancel"></Button>
            <Button label="保存" severity="contrast" @click="handleSave"></Button>
        </template>
    </Dialog>

    <Dialog v-model:visible="addVisible" modal header="添加标签" :style="{ width: '25rem' }">
        <div class="flex align-center gap-4 mb-10">
            <label for="username" class="font-semibold w-24">标签名称</label>
            <InputText id="username" class="flex-auto" autocomplete="off" v-model="newLabel" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="取消" severity="secondary" @click="addVisible = false"></Button>
            <Button type="button" label="添加" severity="contrast" @click="handleTagAdd"></Button>
        </div>
    </Dialog>

    <Dialog v-model:visible="ioVisible" modal header="添加输入/输出文件" :style="{ width: '40rem' }">
        <div class="flex align-center gap-4 mb-10">
            <label for="username" class="font-semibold w-24">选择输入文件</label>
            <FileUpload name="file" mode="basic" url="/api/file/problem/judge_file" @upload="onInAdvancedUpload($event)"
                :multiple="true" accept=".in" :auto="true" :maxFileSize="1000000">
            </FileUpload>
            <span v-if="inSuccess">
                <i class="pi pi-check-circle"></i>
            </span>
        </div>
        <div class="flex align-center gap-4 mb-10">
            <label for="username" class="font-semibold w-24">选择输出文件</label>
            <FileUpload name="file" mode="basic" url="/api/file/problem/judge_file"
                @upload="onOutAdvancedUpload($event)" :multiple="true" accept=".out" :auto="true"
                :maxFileSize="1000000">
            </FileUpload>
            <span v-if="outSuccess">
                <i class="pi pi-check-circle"></i>
            </span>
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="取消" severity="secondary" @click="addVisible = false"></Button>
            <Button type="button" label="上传" severity="contrast" @click="onAdded"></Button>
        </div>
    </Dialog>

    <ConfirmDialog></ConfirmDialog>
</template>

<script setup>
import { ref, computed } from 'vue';

import QuestionEdit from '@/components/admin/QuestionEdit.vue';
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

import { useGoto } from '@/hooks/useRouterUtil';
import { reactive, onMounted } from 'vue';
import api from '@/api';
import { watch } from 'vue';
import toast from '@/utils/toast';
import bus from 'vue3-eventbus'
import { toRaw } from 'vue';

const goto = useGoto()
const confirm = useConfirm();

const emit = defineEmits(['click:save', 'click:cancel', 'click:del', 'add:question'])

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

// const visible = computed(() => props.visible)
const visible = computed(() => props.visible)
const addVisible = ref(false)
const ioVisible = ref(false)
const newLabel = ref('')
const form = computed(() => props.form)
const detail = reactive({
    id: 0,
    title: '',
    description: {
        content: '',
        exampleInput: '',
        exampleOutput: '',
        hint: ''
    },
    judgeConfig: {
        memoryLimit: 0,
        timeLimit: 0
    },
    judgeInputs: [],
    judgeOutputs: [],
    solution: { content: '' },
    tags: [],
    title: "",
    visible: ""
})
const optionVisible = ["CONTEST", "PRIVATE", "PUBLIC"]
const inputAndOutputFiles = ref([])
const currentInputFile = ref('')
const currentOutputFile = ref('')
const inSuccess = ref(false)
const outSuccess = ref(false)

const handleSave = () => {
    // console.log(toRaw(detail));
    if (props.mode === 'edit') {
        emit('click:save', toRaw(detail))
    } else if (props.mode === 'add') {
        emit('add:question', toRaw(detail))
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

const handleDel = () => {
    confirm.require({
        message: '确定删除?',
        rejectProps: {
            label: '取消',
            icon: 'pi pi-times',
            // outlined: true,
            size: 'small'
        },
        acceptProps: {
            label: '确认',
            icon: 'pi pi-check',
            size: 'small',
            severity: 'danger'
        },
        accept: handleConfirmDel
    });
}

const handleConfirmDel = async () => {
    emit('click:del', detail.id)
}

const getQuestion = async () => {
    // clearObj(detail);
    if (props.mode == 'edit') {
        detail.id = form.value.id;
    } 
    console.log('detail.id', detail.id);
    api.questionApi.getQuestion(form.value.id).then(res => {
        console.log('res', res.data.data);
        const _detail = res.data.data;
        detail.title = _detail.title;
        detail.description.content = _detail.description.content;
        detail.description.exampleInput = _detail.description.exampleInput;
        detail.description.exampleOutput = _detail.description.exampleOutput;
        detail.description.hint = _detail.description.hint;
        detail.judgeConfig.memoryLimit = _detail.judgeConfig.memoryLimit;
        detail.judgeConfig.timeLimit = _detail.judgeConfig.timeLimit;
        detail.judgeInputs = _detail.judgeInputs;
        detail.judgeOutputs = _detail.judgeOutputs;
        detail.solution.content = _detail.solution.content;
        detail.tags = _detail.tags;
        detail.title = _detail.title;

        detail.visible = _detail.visible == null ? "PUBLIC" : _detail.visible;
        inputAndOutputFiles.value = [];
        for (let i = 0; i < detail.judgeInputs.length; i++) {
            inputAndOutputFiles.value.push({
                input: detail.judgeInputs[i],
                output: detail.judgeOutputs[i]
            })
        }
    }).catch(err => {
        toast.error(err);
        console.log(err);
    })
}

watch(() => props.visible, (value) => {
    if (value) {
        clearObj(detail);
        if (props.mode === 'edit') {
            getQuestion()
        }
    }
})

const handleTagAdd = () => {
    const tag = newLabel.value;
    if (tag) {
        detail.tags.push(tag);
        newLabel.value = '';
        addVisible.value = false;
    } else {
        toast.error('标签名称不能为空');
    }
}

const handleTagRemove = (e) => {
    const tag = e.target.parentElement.innerText;
    detail.tags = detail.tags.filter(item => item !== tag);
}

const handleIORemove = (e) => {
    const tag = e.target.parentElement.innerText;
    inputAndOutputFiles.value = inputAndOutputFiles.value.filter(item => `${item.input}/${item.output}` !== tag);
    detail.judgeInputs = inputAndOutputFiles.value.filter(item => item.input);
    detail.judgeOutputs = inputAndOutputFiles.value.filter(item => item.output);
}

const onInAdvancedUpload = async (e) => {
    let res = JSON.parse(e.xhr.response);
    if (res.message == 'ok') {
        const id = res.data
        currentInputFile.value = id
        inSuccess.value = true
    } else {
        toast.error(res.message)
    }
}

const onOutAdvancedUpload = async (e) => {
    let res = JSON.parse(e.xhr.response);
    if (res.message == 'ok') {
        const id = res.data
        currentOutputFile.value = id
        outSuccess.value = true
    } else {
        toast.error(res.message)
    }
}

const onAdded = () => {
    if (currentInputFile.value && currentOutputFile.value) {
        inputAndOutputFiles.value.push({
            input: currentInputFile.value,
            output: currentOutputFile.value
        })
        detail.judgeInputs.push(currentInputFile.value)
        detail.judgeOutputs.push(currentOutputFile.value)
        currentInputFile.value = ''
        currentOutputFile.value = ''
        inSuccess.value = false
        outSuccess.value = false
        ioVisible.value = false
        toast.success('上传成功')
    } else {
        toast.error('请先上传文件')
    }
}

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
</style>