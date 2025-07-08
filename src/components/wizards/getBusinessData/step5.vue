<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useManagers, type IManager } from '@/composables/useManagers';
import TooltipIcon from '@/components/shared/TooltipIcon.vue';

// --- PROPS Y EMITS ---
const props = defineProps<{
  businessId: string;
  values: Record<string, any>; // Para leer el estado de acceptsPolicies
  errors: Record<string, string | undefined>; // Para mostrar el error de acceptsPolicies
}>();

const emit = defineEmits(['update:form-value']);

// --- LÓGICA DE MANAGERS (usando el Composable) ---
const { managers, isLoading, error, fetchManagers, addManager, removeManager } = useManagers(ref(props.businessId) as Ref<string>);

// Estado local para el formulario de "Añadir nuevo manager"
const newManager = ref<Omit<IManager, '_id'>>({
  name: '',
  email: '',
  role: 'Administrador',
});

// Cargar los managers existentes cuando el componente se muestra
onMounted(() => {
  fetchManagers();
});

const handleAddNewManager = async () => {
  if (!newManager.value.name.trim() || !newManager.value.email.trim()) {
    alert('El nombre y el email son requeridos.');
    return;
  }
  await addManager(newManager.value);
  if (!error.value) {
    newManager.value = { name: '', email: '', role: 'Administrador' };
  }
};

// --- LÓGICA DE POLÍTICAS (reincorporada) ---
const handlePolicyChange = (event: Event) => {
  emit('update:form-value', 'acceptsPolicies', (event.target as HTMLInputElement).checked);
};
</script>

<template>
  <div class="form-step">
    <div class="manager-section">
      <div class="form-group-title-wrapper">
        <h2 class="form-group-title">Administradores del Negocio</h2>
        <TooltipIcon text="Agrega o elimina a las personas que gestionarán la información. Se les enviará una invitación por correo." />
      </div>
      <p class="form-description">
        Las personas que añadas aquí tendrán acceso al panel de gestión de este negocio.
      </p>
      <form @submit.prevent="handleAddNewManager" class="add-manager-form">
        <div class="input-group">
          <input type="text" v-model="newManager.name" placeholder="Nombre completo" class="form-input" required />
          <input type="email" v-model="newManager.email" placeholder="correo@ejemplo.com" class="form-input" required />
          <select v-model="newManager.role" class="form-select">
            <option>Administrador</option>
            <option>Marketer</option>
            <option>Vendedor</option>
          </select>
        </div>
        <button type="submit" class="add-btn" :disabled="isLoading">
          <span v-if="isLoading && !error">...</span>
          <span v-else>+ Agregar</span>
        </button>
      </form>
      <div v-if="error" class="error-text global-error">{{ error }}</div>
      <div class="managers-list-container">
        <div v-if="isLoading && managers.length === 0" class="state-text">Cargando...</div>
        <div v-else-if="!isLoading && managers.length === 0" class="state-text">No hay administradores asignados.</div>
        <ul v-else class="managers-list">
          <li v-for="manager in managers" :key="manager._id" class="manager-item">
            <div class="manager-info">
              <span class="manager-name">{{ manager.name }}</span>
              <span class="manager-email">{{ manager.email }}</span>
            </div>
            <div class="manager-details">
              <span class="manager-role">{{ manager.role }}</span>
              <button @click="removeManager(manager._id!)" class="remove-btn" :disabled="isLoading" aria-label="Eliminar">&times;</button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="form-field policy-acceptance-field">
      <div class="policy-input-group">
        <input
          type="checkbox"
          id="acceptsPolicies"
          class="form-checkbox"
          :checked="props.values.acceptsPolicies"
          @change="handlePolicyChange"
          :class="{ 'input-error': !!props.errors.acceptsPolicies }"
        />
        <label for="acceptsPolicies" class="form-label-checkbox policy-label">
          He leído y acepto las
          <a
            href="https://mkt.bakano.ec/politicas"
            target="_blank"
            rel="noopener noreferrer"
            class="policy-link"
            @click.stop>
            políticas de seguridad
          </a>. *
        </label>
        <TooltipIcon text="Este es el último paso. Al aceptar, confirmas que entiendes cómo protegeremos tu información confidencial." />
      </div>
      <span v-if="props.errors.acceptsPolicies" class="error-text">
        {{ props.errors.acceptsPolicies }}
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.form-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group-title {
  font-family: $font-principal;
  font-weight: 600;
  color: $BAKANO-DARK;
  font-size: 1.1rem;
}

.form-description {
  font-family: $font-secondary;
  font-size: 1rem;
  color: $text-placeholder;
  margin-bottom: 0.5rem;
}

.add-manager-form {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
}

.form-input,
.form-select {
  font-family: $font-secondary;
  padding: 0.75rem 1rem;
  border: 1px solid $BAKANO-LIGHT;
  border-radius: 8px;
  font-size: 1rem;
  color: $BAKANO-DARK;
  background-color: $white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: $BAKANO-PURPLE;
    box-shadow: 0 0 0 3px $overlay-purple;
  }
}

.add-btn {
  font-family: $font-principal;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  background-color: $BAKANO-PURPLE;
  color: $white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease;
  height: 48px;

  &:hover:not(:disabled) {
    background-color: darken($BAKANO-PURPLE, 10%);
  }

  &:disabled {
    background-color: $text-placeholder;
    cursor: not-allowed;
  }
}

.managers-list-container {
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.state-text {
  color: $text-placeholder;
  text-align: center;
  padding: 2rem;
}

.managers-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.manager-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: $white;
  border: 1px solid $BAKANO-LIGHT;
  border-radius: 8px;
}

.manager-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

.manager-name {
  font-weight: 500;
}

.manager-email {
  font-size: 0.85rem;
  color: $text-placeholder;
}

.manager-details {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.manager-role {
  font-size: 0.8rem;
  font-weight: 500;
  color: $BAKANO-PURPLE;
  background-color: $overlay-purple;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.remove-btn {
  background: $BAKANO-LIGHT;
  color: $text-placeholder;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: $BAKANO-PINK;
    color: $white;
    transform: scale(1.1);
  }
}

.error-text {
  color: $BAKANO-PINK;
  font-size: 0.8rem;
}

.global-error {
  background-color: lighten($BAKANO-PINK, 35%);
  border: 1px solid lighten($BAKANO-PINK, 25%);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

// Estilos para la sección de Políticas
.policy-acceptance-field {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid $BAKANO-LIGHT;
}

.policy-input-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.form-checkbox {
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 8px;
  border: 2px solid $BAKANO-LIGHT;
  cursor: pointer;
  appearance: none;
  position: relative;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:checked {
    background-color: $BAKANO-PINK;
    border-color: $BAKANO-PINK;

    &::after {
      content: '';
      position: absolute;
      left: 0.325rem;
      top: 0.075rem;
      width: 0.25rem;
      height: 0.55rem;
      border: solid $white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}

.policy-label {
  font-size: 0.9rem;
  color: $BAKANO-DARK;
  font-weight: 500;
}

.policy-link {
  color: $BAKANO-PURPLE;
  text-decoration: underline;
  font-weight: 600;
}
</style>