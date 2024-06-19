<template>
    <DataTable :value="ranklist" :loading="loading" stripedRows :scrollable="true"
        tableStyle="min-width: 50rem">
        <Column field="user" header="用户名"></Column>
        <Column field="accept" header="解题数"></Column>
        <Column field="submit" header="提交次数"></Column>
        <Column field="accuracy" header="正确率"></Column>
    </DataTable>

    <Paginator :rows="10" :totalRecords="120" :rowsPerPageOptions="[10, 20, 30]"></Paginator>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';

import { ref } from 'vue';
import { onMounted } from 'vue';

const props = defineProps({
    ranklist: {
        type: Array,
        required: true,
        default: () => []
    },
    rows: {
        type: Number,
        required: false,
        default: 30
    },
    loading: {
        type: Boolean,
        required: false,
        default: true
    }
})

const ranklist = ref([])
const loading = ref(true)

onMounted(() => {
})
</script>

<style lang="scss" scoped></style>