<template>
    <DataTable :value="values" :loading="loading" stripedRows :scrollable="true" tableStyle="min-width: 50rem"
        @row-click="handleRowClick">
        <Column v-for="col in columns" :field="col.field" :header="col.header" :key="col.field"></Column>
    </DataTable>   
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Paginator from 'primevue/paginator';

import { onMounted } from 'vue';
import { computed } from 'vue';

const emit = defineEmits(['update:paginator', 'row-clicked']);

const props = defineProps({
    values: {
        type: Array,
        required: true,
        default: () => []
    },
    loading: {
        type: Boolean,
        required: false,
        default: true
    },
    row: {
        type: Number,
        // required: true,
        default: 10
    },
    total: {
        type: Number,
        // required: true,
    },
    pageOptions: {
        type: Array,
        // required: true,
    },
    columns: {
        type: Array,
        // required: true,
    }
})

const values = computed(() => props.values)
const loading = computed(() => props.loading)
const row = computed(() => props.row)
const total = computed(() => props.total)
const rowsPerPageOptions = computed(() => props.pageOptions)
const columns = computed(() => props.columns)

const handleRowClick = (event) => {
    emit('row-clicked', event.data);
}

const handlePageChange = (event) => {
    emit('update:paginator', event);
}

onMounted(() => {

})
</script>

<style lang="scss" scoped></style>