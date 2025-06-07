<script setup lang="ts">
</script>

<template>
  <section class="not-found">
    <div class="content">
      <i class="fa-solid fa-circle-exclamation icon" aria-hidden="true"></i>

      <h1 class="title">404</h1>
      <p class="subtitle">Ups… esta página no existe.</p>

      <a
        class="btn-home"
        href="https://bakano.ec"
        rel="noopener noreferrer"
      >
        Volver a bakano.ec
        68389fffcfae680c8afebaa0
        6838a000cfae680c8afebaa6
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  </section>
</template>


<style lang="scss">
@use '@/styles/index.scss' as *;

.not-found {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $BAKANO-LIGHT;
  color: $BAKANO-DARK;
  text-align: center;

  .content {
    max-width: 480px;
    padding: 2rem;
  }

  .icon {
    font-size: 4rem;
    color: $BAKANO-PURPLE;
    margin-bottom: 1rem;
  }

  .title {
    font-family: $font-poppins;
    font-size: 6rem;
    margin: 0;
    line-height: 1;
  }

  .subtitle {
    font-family: $font-secondary;
    font-size: 1.25rem;
    margin: 1rem 0 2rem;
  }

  .btn-home {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-family: $font-secondary;
    font-weight: 600;
    background-color: $BAKANO-PINK;
    color: $white;
    border: none;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: darken($BAKANO-PINK, 8%);
    }
  }
}
</style>
