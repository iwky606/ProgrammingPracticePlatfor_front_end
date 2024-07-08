<template>
    <QuestionLayout>
        <template #left>
            <Question :question="question" />
        </template>
        <template #right>
            <Editor @submit="handleSubmission" />
        </template>
    </QuestionLayout>
</template>

<script setup>
import QuestionLayout from '@/layout/question/index.vue';
import Question from '@/components/question/Question.vue';
import Editor from '@/components/question/Editor.vue';

import { onMounted, ref } from 'vue';
import { useRouteParams } from '@/hooks/useRouterUtil';
import api from '@/api';
import toast from '@/utils/toast';

const params = useRouteParams();
const id = ref(-1);
const question = ref(``);

const handleSubmission = (code, states) => {
    console.log(code.value);
    console.log(states);
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

onMounted(() => {
    id.value = params.id;
    getQuestion(id.value);
});

</script>

<style lang="scss" scoped></style>