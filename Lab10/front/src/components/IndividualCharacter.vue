<template>
<div>
  <div v-if="character">
    <h1>{{character && character.name ? character.name : ''}}</h1>
    <br />
    <img v-if="image" :src="`${this.character.thumbnail.path}/standard_amazing.${this.character.thumbnail.extension}`" :alt="character.name" />
        <img v-else :src="noImg" :alt="character.name" />
    <br />
    <br />
    <h2>This is a list of comics:</h2>
    <ul>
    <li v-for="(val, index) in this.character.comics.items" :key="index">
      <router-link :to="{name: 'individualComic', params: {id: val.resourceURI.split('/').slice(-1)[0]}}">{{val && val.name ? val.name : 'N/A'}}</router-link>
    </li>
    </ul>
    <h2>Related Stories:</h2>
    <ul>
    <li v-for="(val, index) in this.character.stories.items" :key="`cs ${index}`">
      <router-link :to="{name: 'individualStory', params: {id: val.resourceURI.split('/').slice(-1)[0]}}">{{val.name}}</router-link>
    </li>
    </ul>
  </div>

  <div v-else-if="error">
    <FourComp />
  </div>
  <div v-else>
    <h1>Loading...</h1>
  </div>
  

</div>
  </template>
  
  <script>
  import FourComp from "./FourComp.vue"
  import axios from "axios";
  import noImg from "../assets/noImg.jpg"
  export default {
    name: "IndividualCharacter",
    components:{
      FourComp
    },
    data() {
      return {
        id: this.$route.params.id,
        character: null,
        error: false,
        image: false,
        noImg: noImg,
      };
    },
    methods: {
      getCharacter(id) {
        try {
        axios
          .get(`http://localhost:3001/api/characters/${id}`)
          .then(({ data }) => {(this.character = data); this.error=false
            if (this.character.thumbnail) {
                    this.image = true;
                }
                else {
                  this.image = false;
                }
              }).catch(()=>this.error=true)
            }
            catch (e)  {
              this.error=true;
            }
      },
    },
    async created() {
      if (! /^\d+$/.test(this.$route.params.id)) {
          this.error=true
        }
        else {
      await this.getCharacter(this.$route.params.id);
        }
    },
    watch: {
      $route() {
        if (! /^\d+$/.test(this.$route.params.id)) {
          this.error=true
        } else {
        this.getCharacter(this.$route.params.id);
        }
      }
    }
  };
  </script>
  
