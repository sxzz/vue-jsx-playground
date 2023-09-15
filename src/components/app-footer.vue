<template>
  <footer text-center>
    <nav mt-6 inline-flex gap-2 text-xl>
      <button class="icon-btn !outline-none" @click="toggleDark()">
        <div i-carbon-sun dark:i-carbon-moon />
      </button>

      <a
        class="icon-btn"
        i-carbon-logo-github
        rel="noreferrer"
        href="https://github.com/sxzz/vue-jsx-playground"
        target="_blank"
        title="GitHub"
      />
    </nav>
  </footer>
</template>
