import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "about",
      component: () => import("../components/About.vue"),
    },
    {
      path: "/characters/page/:pageNum?",
      name: "characterList",
      component: () => import("../components/CharacterList.vue"),
    },
    {
      path: "/characters/:id?",
      name: "individualCharacter",
      component: () => import("../components/IndividualCharacter.vue"),
    },
    {
      path: "/comics/page/:pageNum?",
      name: "comicList",
      component: () => import("../components/ComicList.vue"),
    },
    {
      path: "/comics/:id?",
      name: "individualComic",
      component: () => import("../components/IndividualComic.vue"),
    },
    {
      path: "/stories/page/:pageNum?",
      name: "storyList",
      component: () => import("../components/StoryList.vue"),
    },
    {
      path: "/stories/:id?",
      name: "individualStory",
      component: () => import("../components/IndividualStory.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "fourComp",
      component: () => import("../components/FourComp.vue"),
    },
  ],
});

export default router;
