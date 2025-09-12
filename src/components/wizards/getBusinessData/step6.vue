<script setup lang="ts">
import { computed } from 'vue'
import TooltipIcon from '@/components/shared/TooltipIcon.vue'
import FileUploadItem from '@/forms/FileUploadItem.vue'

// Interfaz para el estado de los archivos
interface FileStatus {
  name: string
  uploaded: boolean
  file?: File
}

const props = defineProps<{
  values: Record<string, any>
  errors: Record<string, string | undefined>
  skippedFiles: Record<string, boolean>
  singleFileStatuses: Record<string, FileStatus | null>
}>()

const emit = defineEmits(['update:form-value', 'update-file'])

// --- Modelo de Datos Reactivo para campos de texto ---
const brandPrimaryColor = computed({
  get: () => props.values.brandPrimaryColor || '',
  set: (val) => emit('update:form-value', 'brandPrimaryColor', val),
})

const brandSecondaryColor = computed({
  get: () => props.values.brandSecondaryColor || '',
  set: (val) => emit('update:form-value', 'brandSecondaryColor', val),
})

const brandTypographyName = computed({
  get: () => props.values.brandTypographyName || '',
  set: (val) => emit('update:form-value', 'brandTypographyName', val),
})

// --- Handlers para archivos ---
const handleFileChange = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] || null

  if (file) {
    const MAX_SIZE_MB = 10
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
    if (file.size > MAX_SIZE_BYTES) {
      alert(`El archivo es demasiado grande (máx. ${MAX_SIZE_MB}MB).`)
      target.value = ''
      return
    }
  }
  emit('update-file', fieldName, file, false)
}

const handleSkipChange = (fieldName: string, event: Event) => {
  emit('update-file', fieldName, null, (event.target as HTMLInputElement).checked)
}

// Definición de campos de archivo para identidad de marca
const brandFileFields = [
  {
    name: 'brandLogo',
    label: 'Logo de la Marca',
    description: 'Archivo del logo principal de tu restaurante.',
    note: 'Formatos: PNG, JPG, SVG (máx. 10MB).',
    accept: '.png,.jpg,.jpeg,.svg',
    skippable: true,
    tooltipText: 'Tu logo es la cara de tu marca. Si no tienes uno, podemos ayudarte a crearlo.'
  },
  {
    name: 'brandTypographyFile',
    label: 'Archivo de Tipografía',
    description: 'Archivo de la fuente tipográfica de tu marca.',
    note: 'Formatos: TTF, OTF, WOFF (máx. 10MB).',
    accept: '.ttf,.otf,.woff,.woff2',
    skippable: true,
    tooltipText: 'La tipografía ayuda a mantener consistencia visual en todos tus materiales.'
  },
  {
    name: 'brandUsageExamples',
    label: 'Ejemplos de Uso de Marca',
    description: 'Imágenes que muestren cómo usas tu marca (menús, redes sociales, etc.).',
    note: 'Formatos: PNG, JPG, PDF (máx. 10MB).',
    accept: '.png,.jpg,.jpeg,.pdf',
    skippable: true,
    tooltipText: 'Ejemplos de cómo aplicas tu identidad visual nos ayuda a entender tu estilo.'
  }
]
</script>

<template>
  <div class="form-step">
    <div class="form-group-title">Identidad de Marca</div>
    <p class="form-group-description">
      Ayúdanos a conocer la identidad visual de tu restaurante. Si no tienes algunos elementos, no te preocupes.
    </p>

    <!-- Campos de colores -->
    <div class="brand-colors-section">
      <h4 class="section-subtitle">Colores de Marca</h4>
      
      <div class="form-field">
        <div class="form-label-wrapper">
          <label for="brandPrimaryColor" class="form-label">Color Primario</label>
          <TooltipIcon text="El color principal que representa tu marca (ej: #FF5733 o rojo)." />
        </div>
        <input
          v-model="brandPrimaryColor"
          id="brandPrimaryColor"
          type="text"
          placeholder="Ej: #FF5733 o 'rojo'"
          class="form-input"
          :class="{ 'input-error': !!props.errors.brandPrimaryColor }"
        />
        <div class="input-helper">
          <input
            type="color"
            :value="brandPrimaryColor.startsWith('#') ? brandPrimaryColor : '#000000'"
            @input="(e) => brandPrimaryColor = (e.target as HTMLInputElement).value"
            class="color-picker"
          />
          <span class="helper-text">Puedes usar el selector de color o escribir el código/nombre</span>
        </div>
        <span v-if="props.errors.brandPrimaryColor" class="error-text">{{ props.errors.brandPrimaryColor }}</span>
      </div>

      <div class="form-field">
        <div class="form-label-wrapper">
          <label for="brandSecondaryColor" class="form-label">Color Secundario</label>
          <TooltipIcon text="Un color complementario que uses en tu marca (opcional)." />
        </div>
        <input
          v-model="brandSecondaryColor"
          id="brandSecondaryColor"
          type="text"
          placeholder="Ej: #33A1FF o 'azul'"
          class="form-input"
          :class="{ 'input-error': !!props.errors.brandSecondaryColor }"
        />
        <div class="input-helper">
          <input
            type="color"
            :value="brandSecondaryColor.startsWith('#') ? brandSecondaryColor : '#000000'"
            @input="(e) => brandSecondaryColor = (e.target as HTMLInputElement).value"
            class="color-picker"
          />
          <span class="helper-text">Opcional - Deja vacío si no tienes</span>
        </div>
        <span v-if="props.errors.brandSecondaryColor" class="error-text">{{ props.errors.brandSecondaryColor }}</span>
      </div>
    </div>

    <!-- Campo de tipografía -->
    <div class="typography-section">
      <h4 class="section-subtitle">Tipografía</h4>
      
      <div class="form-field">
        <div class="form-label-wrapper">
          <label for="brandTypographyName" class="form-label">Nombre de la Tipografía</label>
          <TooltipIcon text="El nombre de la fuente que usas en tu marca (ej: Arial, Montserrat, etc.)." />
        </div>
        <input
          v-model="brandTypographyName"
          id="brandTypographyName"
          type="text"
          placeholder="Ej: Montserrat, Arial, Roboto"
          class="form-input"
          :class="{ 'input-error': !!props.errors.brandTypographyName }"
        />
        <span class="helper-text">Si no sabes el nombre exacto, describe el estilo (ej: 'moderna', 'clásica')</span>
        <span v-if="props.errors.brandTypographyName" class="error-text">{{ props.errors.brandTypographyName }}</span>
      </div>
    </div>

    <!-- Archivos de marca -->
    <div class="brand-files-section">
      <h4 class="section-subtitle">Archivos de Marca</h4>
      
      <div
        v-for="fileField in brandFileFields"
        :key="fileField.name"
        class="form-field file-field"
      >
        <div class="form-label-wrapper">
          <label :for="fileField.name + 'File'" class="form-label-file">{{ fileField.label }}</label>
          <TooltipIcon :text="fileField.tooltipText" />
        </div>

        <p class="file-description">{{ fileField.description }}</p>
        <p v-if="fileField.note" class="file-note">{{ fileField.note }}</p>
        
        <div class="file-input-area">
          <input
            type="file"
            :id="fileField.name + 'File'"
            :accept="fileField.accept"
            @change="event => handleFileChange(fileField.name, event)"
            class="form-input-file"
            :disabled="props.skippedFiles[fileField.name]"
            :class="{ 'input-error': !!props.errors[fileField.name] && !props.skippedFiles[fileField.name] }"
          />
          <div
            v-if="props.singleFileStatuses[fileField.name]?.uploaded && !props.skippedFiles[fileField.name]"
            class="file-status-chip"
          >
            {{ props.singleFileStatuses[fileField.name]?.name }} <span class="checkmark">✓</span>
          </div>
        </div>
        
        <div v-if="fileField.skippable" class="skip-file-option">
          <input
            type="checkbox"
            :id="'skip_' + fileField.name"
            :checked="props.skippedFiles[fileField.name]"
            @change="event => handleSkipChange(fileField.name, event)"
            class="form-checkbox"
          />
          <label :for="'skip_' + fileField.name" class="form-label-checkbox">No tengo este archivo</label>
        </div>
        
        <span v-if="props.errors[fileField.name] && !props.skippedFiles[fileField.name]" class="error-text">
          {{ props.errors[fileField.name] }}
        </span>
      </div>
    </div>

    <div class="info-note">
      <p><strong>💡 Nota:</strong> No te preocupes si no tienes todos estos elementos. Podemos ayudarte a desarrollar una identidad de marca completa como parte de nuestro servicio.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.form-step {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group-title {
  font-family: $font-principal;
  font-size: 1.25rem;
  font-weight: 600;
  color: $BAKANO-DARK;
  margin-bottom: 0.5rem;
}

.form-group-description {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.7);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-family: $font-secondary;
  font-size: 1rem;
  font-weight: 600;
  color: $BAKANO-PURPLE;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba($BAKANO-PURPLE, 0.2);
  padding-bottom: 0.5rem;
}

.brand-colors-section,
.typography-section,
.brand-files-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label,
.form-label-file {
  font-family: $font-secondary;
  font-weight: 500;
  color: $BAKANO-DARK;
  font-size: 0.9rem;
}

.form-input {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &::placeholder {
    color: $text-placeholder;
  }

  &:focus {
    outline: none;
    border-color: $BAKANO-PURPLE;
    box-shadow: 0 0 0 2px rgba($BAKANO-PURPLE, 0.2);
  }

  &.input-error {
    border-color: $BAKANO-PINK;

    &:focus {
      box-shadow: 0 0 0 2px rgba($BAKANO-PINK, 0.2);
    }
  }
}

.input-helper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.color-picker {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  background: none;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
}

.helper-text {
  font-family: $font-secondary;
  font-size: 0.8rem;
  color: rgba($BAKANO-DARK, 0.6);
  font-style: italic;
}

.file-field {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background-color: rgba($BAKANO-LIGHT, 0.3);
}

.file-description {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.8);
  font-size: 0.9rem;
  margin: 0;
}

.file-note {
  font-family: $font-secondary;
  color: rgba($BAKANO-DARK, 0.6);
  font-size: 0.8rem;
  font-style: italic;
  margin: 0;
}

.file-input-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input-file {
  font-family: $font-secondary;
  padding: 0.75rem;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  background-color: $white;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;

  &:hover {
    border-color: $BAKANO-PURPLE;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.input-error {
    border-color: $BAKANO-PINK;
  }
}

.file-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba($BAKANO-GREEN, 0.1);
  color: $BAKANO-GREEN;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  
  .checkmark {
    font-weight: bold;
  }
}

.skip-file-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.form-checkbox {
  width: 16px;
  height: 16px;
  accent-color: $BAKANO-PURPLE;
}

.form-label-checkbox {
  font-family: $font-secondary;
  font-size: 0.9rem;
  color: rgba($BAKANO-DARK, 0.7);
  cursor: pointer;
}

.error-text {
  font-size: 0.8rem;
  color: $BAKANO-PINK;
  margin-top: 0.1rem;
}

.info-note {
  padding: 1.5rem;
  background-color: rgba($BAKANO-PURPLE, 0.05);
  border: 1px solid rgba($BAKANO-PURPLE, 0.2);
  border-radius: 12px;
  
  p {
    margin: 0;
    font-family: $font-secondary;
    color: rgba($BAKANO-DARK, 0.8);
    font-size: 0.9rem;
    line-height: 1.5;
  }
}
</style>