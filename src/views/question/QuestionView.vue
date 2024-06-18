<template>
    <div>
question {{ id }}
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const route = useRoute();
const id = ref(route.params.id);


onMounted(() => {
    console.log(route.params.id);
    id.value = route.params.id;
});

</script>

<style lang="scss" scoped></style>