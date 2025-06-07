<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

/* Helpers */
const closeSelf = () => emit('update:modelValue', false)
const confirmAndClose = () => {
  emit('confirm')
  closeSelf()
}
const cancelAndClose = () => {
  emit('cancel')
  closeSelf()
}
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="overlay"
        @click.self="cancelAndClose"
      >
        <transition name="pop">
          <div class="modal">
            <h3 class="title">¿Seguro que quieres cerrar?</h3>
            <p class="subtitle">Se perderán los datos no guardados.</p>

            <div class="actions">
              <button class="btn-outline" @click="cancelAndClose">
                Seguir editando
              </button>
              <button class="btn-danger" @click="confirmAndClose">
                Cerrar sin guardar
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss">
@use '@/styles/index.scss' as *;

/* overlay y animaciones */
.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($BAKANO-DARK, 0.6);
  z-index: 1100;
}

.modal {
  background: $white;
  width: 90%;
  max-width: 420px;
  padding: 2rem 1.75rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 8px 24px rgba($BAKANO-DARK, .15);
  font-family: $font-secondary;

  .title {
    margin: 0 0 .5rem;
    font-weight: 700;
    font-size: 1.25rem;
    color: $BAKANO-DARK;
  }

  .subtitle {
    margin: 0 0 1.5rem;
    font-size: .95rem;
    color: $text-placeholder;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: .75rem;

    .btn-outline,
    .btn-danger {
      padding: .55rem 1.25rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color .2s;
    }

    .btn-outline {
      background: $white;
      border: 1px solid $text-placeholder;
      color: $BAKANO-DARK;

      &:hover {
        background: $overlay-purple;
      }
    }

    .btn-danger {
      background: $BAKANO-PINK;
      border: none;
      color: $white;

      &:hover {
        background: darken($BAKANO-PINK, 8%);
      }
    }
  }
}

/* simple fades/pops */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: transform .2s, opacity .2s;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(.95);
}
</style>
