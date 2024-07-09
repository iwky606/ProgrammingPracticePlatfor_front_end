<template>
    <QuestionLayout>
        <template #left>
            <Question :question="question" />
        </template>
        <template #right>
            <Editor @submit="handleSubmission" />
        </template>
    </QuestionLayout>

    <Dialog :visible="onsubmit" header="测评中..." modal>
        <div class="dia-content align-center justify-center">
            <div class="dia-item">
                <ProgressSpinner />
                <span>正在评测中...</span>
            </div>
        </div>
        <template #footer>
            <Button label="关闭" severity="contrast" @click="closeDia" />
        </template>
    </Dialog>

    <Dialog v-model:visible="onFinished" modal header="提交详情">

        <div class="dia-content">
            <div class="flex gap-1 mb-10 col dia-title" style="margin-bottom: 20px;">
                <i class="pi pi-verified" style="font-size: 3rem"></i>
                <span>评测完成！</span>
            </div>
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
            </div>
            <div class="flex align-center gap-3 mb-10">
                <div class="flex align-center gap-1">
                    <label for="em">消耗内存: {{ submission.execMemory }} MB</label>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="关闭" severity="contrast" @click="onFinished = false" />
        </template>
    </Dialog>
</template>

<script setup>
import QuestionLayout from '@/layout/question/index.vue';
import Question from '@/components/question/Question.vue';
import Editor from '@/components/question/Editor.vue';

import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

import { onMounted, ref, reactive } from 'vue';
import { useRouteParams } from '@/hooks/useRouterUtil';
import api from '@/api';
import toast from '@/utils/toast';

import { timestampToTime } from '@/utils/time';

const params = useRouteParams();
const id = ref(-1);
const question = ref(``);
const onsubmit = ref(false);
const onFinished = ref(false);
const submissionId = ref('');
let timer;
const submission = reactive({
    id: '',
    code: '',
    submissionTime: "",
    status: "",
    execTime: '',
    execMemory: '',
})

const handleSubmission = (code, lang) => {
    console.log(code);
    console.log(lang);
    submit(code, lang);
}

const renderTitle = (title) => {
    return `## 题目：${title}`;
}

const renderInput = (input) => {
    return `* 输入：${input}`;
}

const renderOutput = (output) => {
    return `* 输出：${output}`;
}

const renderSplit = () => {
    return `---`;
}

const renderExample = (input, output) => {
    return `
\`\`\`
${renderInput(input)}
${renderOutput(output)}
\`\`\`
    `;
}

const renderContent = (title, content, input, output) => {
    return `
${renderTitle(title)}

${content}

${renderSplit()}

${renderExample(input, output)}
`;
}

const getQuestion = async (id) => {
    api.questionApi.getQuestion(id).then(res => {
        const title = res.data.data.title;
        const { content, exampleInput: input, exampleOutput: output } = res.data.data.description;
        question.value = renderContent(title, content, input, output);
    }).catch(err => {
        toast.error(err);
        console.log(err);
        question.value = `暂无数据!`;
    })
}

const submit = async (code, lang) => {
    const params = {
        problemId: id.value,
        lang: lang,
        code: code
    }
    api.submissionApi.submitCode(params).then(res => {
        submissionId.value = res.data.data;
        onsubmit.value = true;
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        console.log(submissionId.value);
        onsubmit.value = true;
        startQuery(submissionId.value);
    })
}

const closeDia = () => { 
    onsubmit.value = false;
    clearInterval(timer);
}

const querySubmission = async (id) => {
    const { data } = await api.submissionApi.getSubmissionDetail(id);
    const status = data.data.status;
    return status;
}

const startQuery = async (id) => {
    try {
        timer = setInterval(async () => {
            const status = await querySubmission(id);
            if (status !== null) {
                clearInterval(timer);
                onsubmit.value = false;
                onFinished.value = true;
                getSubmissionDetail(id);
            }
        }, 1000);
    } catch (err) {
        console.log(err); 
        clearInterval(timer);
    }
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
    id.value = params.id;
    getQuestion(id.value);
});

</script>

<style lang="scss" scoped>
.dia-content {
    display: flex;
    flex-direction: column;
    padding: 20px;
    min-width: 400px;
    min-height: 250px;

    .dia-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
}

.dia-title {
    justify-content: center;
    align-items: center;
}
</style>