<template>
    <QuestionLayout>
        <template #left>
            <Question :question="question" />
        </template>
        <template #right>
            <Editor />
        </template>
    </QuestionLayout>
</template>

<script setup>
import QuestionLayout from '@/layout/question/index.vue';
import Question from '@/components/question/Question.vue';
import Editor from '@/components/question/Editor.vue';

import { onMounted, ref } from 'vue';
import { useRouteParams } from '@/hooks/useRouterUtil';

const params = useRouteParams();
const id = ref(params.id);
const question = ref(`
# Question 1
This is a question
> This is a quote
\`\`\`javascript
console.log("Hello World");
\`\`\`
`);


onMounted(() => {
    console.log(params.id);
    id.value = params.id;
});

</script>

<style lang="scss" scoped></style>