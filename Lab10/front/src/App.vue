<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>

    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/marvel-studios.webp"
      width="200"
      height="125"
    />

    <div class="wrapper">

      <nav>
        <RouterLink to="/">AboutSite</RouterLink>
        <br />
        <RouterLink to="/characters/page/1">characters </RouterLink>
        <br />
        <RouterLink to="/comics/page/1">comics </RouterLink>
        <br />
        <RouterLink to="/stories/page/1">stories </RouterLink>
        <br />
      </nav>
    </div>

  <RouterView />
</template>

