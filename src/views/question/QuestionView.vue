<template>
    <QuestionLayout>
        <template #left>
            <Question :question="question" />
        </template>
        <template #right>
            <Editor @submit="handleSubmission"/>
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
const id = ref(-1);
const question = ref(``);

const handleSubmission = (code, states) => {
    console.log(code.value);
    console.log(states);
}

const getQuestion = async (id) => {
    // Fetch question from server
    let q = `# This is a question ${id}

## question description

Given an array of integers, return the sum of all the integers.

You should write a function that takes an array of integers as input and returns the sum of all the integers.

## input

- n: the number of integers in the array
- a: an array of integers

## output

- the sum of all the integers

## examples

### example 1

\`\`\`
input: n = 3, a = [1, 2, 3]
output: 6
\`\`\`

### example 2

\`\`\`
input: n = 5, a = [1, 2, 3, 4, 5]
output: 15
\`\`\`

## constraints
- 1 <= n <= 10^5
- 1 <= a[i] <= 10^5
## notes
- this is a note
- this is another note
`;
    question.value = q;
}

onMounted(() => {
    id.value = params.id;
    getQuestion(id.value);
});

</script>

<style lang="scss" scoped></style>