<template>
    <Dialog v-model:visible="visible" modal header="Edit Profile" :style="{ width: '25rem' }">
        <template #header>
            <div class="inline-flex items-center justify-center gap-2">
                <span class="font-bold whitespace-nowrap">{{ form.title }}</span>
            </div>
        </template>
        <span class="tip">请编辑信息</span>
        <!-- TODO -->

        <span @click="goto(`/admin/question/${form.id}`)" class="cursor"> 点击编辑题目 </span>
        <template #footer>
            <Button label="取消" severity="secondary" @click="handleCancel"></Button>
            <Button label="保存" severity="contrast" @click="handleSave"></Button>
        </template>
    </Dialog>

</template>

<script setup>
import { ref, computed } from 'vue';

import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

import { useGoto } from '@/hooks/useRouterUtil';

const goto = useGoto()

const emit = defineEmits(['click:save', 'click:cancel'])

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    form: {
        type: Object,
        default: () => ({}),
        required: true
    }
})

const visible = computed(() => props.visible)
const form = computed(() => props.form)

const handleSave = () => {
    emit('click:save')
}

const handleCancel = () => {
    emit('click:cancel')
}
</script>

<style lang="scss" scoped>
.tip {
    color: #666;
    margin-bottom: 8px;
    font-size: 14px;

}
</style>