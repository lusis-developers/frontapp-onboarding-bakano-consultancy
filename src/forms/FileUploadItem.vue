<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  status?: { file: File; name: string; size: string; status: 'selected' | 'error' | 'success' };
  error?: string;
}>();

const emit = defineEmits(['update:file']);

const fileInputId = computed(() => `file-input-${props.label.replace(/\s+/g, '-')}`);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    emit('update:file', target.files[0]);
  }
};

const removeFile = () => {
  emit('update:file', null);
};
</script>

<template>
  <div class="file-upload-item" :class="{ 'has-file': props.status, 'has-error': props.error }">
    <div class="item-header">
      <span class="item-label">{{ props.label }}</span>
      <span v-if="props.status" class="item-status" :class="props.status.status">
        {{ props.status.status === 'selected' ? 'Archivo listo' : 'Error' }}
      </span>
    </div>
    <div v-if="!props.status" class="drop-zone">
      <label :for="fileInputId" class="drop-zone-label">
        <span class="icon">📁</span>
        <span class="text">Haz clic para seleccionar o arrastra un archivo aquí</span>
        <span class="meta">(PDF, DOCX, XLSX, PNG, JPG)</span>
      </label>
      <input :id="fileInputId" type="file" @change="handleFileChange" class="file-input-native" />
    </div>
    <div v-else class="file-details">
      <div class="file-info">
        <span class="file-name">{{ props.status.name }}</span>
        <span class="file-size">{{ props.status.size }}</span>
      </div>
      <button @click="removeFile" type="button" class="remove-button">×</button>
    </div>
    <p v-if="props.error" class="error-message">{{ props.error }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.file-upload-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;

  &.has-error {
    border-color: $BAKANO-PINK;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.item-label {
  font-weight: 600;
  color: $BAKANO-DARK;
}

.item-status {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;

  &.selected {
    background-color: rgba($BAKANO-GREEN, 0.1);
    color: darken($BAKANO-GREEN, 10%);
  }

  &.error {
    background-color: rgba($BAKANO-PINK, 0.1);
    color: $BAKANO-PINK;
  }
}

.drop-zone-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;

  &:hover {
    border-color: $BAKANO-PURPLE;
  }

  .icon {
    font-size: 2rem;
  }

  .text {
    font-weight: 500;
    margin-top: 0.5rem;
  }

  .meta {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
}

.file-input-native {
  display: none;
}

.file-details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 6px;
}

.file-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.file-name {
  font-weight: 500;
}

.file-size {
  font-size: 0.8rem;
  color: #6b7280;
}

.remove-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    color: $BAKANO-DARK;
  }
}

.error-message {
  color: $BAKANO-PINK;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  text-align: left;
}
</style>