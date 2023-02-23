<template>
    <div>
      <div v-if="story">
        <h1>{{story ? story.title: ''}}</h1>
        <br />
        <img v-if="image" :src="`${this.story.thumbnail.path}/standard_amazing.${this.story.thumbnail.extension}`" :alt="story.title" />
        <img v-else :src="noImg" :alt="story.title" />
        <h1>Where it came from </h1>
        <p>{{story ? story.originalIssue.name: ''}}</p>
        <br />
        <br />
        <h2>Related comics List if any:</h2>
        <ul>
          <li v-for="(val, index) in this.story.comics.items" :key="index">
            <router-link :to="{name: 'individualComic', params: {id: val.resourceURI.split('/').slice(-1)[0]}}">{{val.name}}</router-link>
          </li>
        </ul>

        <h1>Series List: </h1>
        
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
    name: "IndividualStory",
    components:{
      FourComp
    },
        data() {
          return {
            id: this.$route.params.id,
            story: null,
            error: false,
            image: false,
            noImg: noImg,
          };
        },
        methods: {
          getStory(id) {
            axios
              .get(`http://localhost:3001/api/stories/${id}`)
              .then(({ data }) => {(this.story = data); this.error=false 
                if (this.story.thumbnail) {
                    this.image = true
                }
                else {
                  this.image = false;
                }
            }).catch(()=>this.error=true)
          },
        },
        async created() {
          if (! /^\d+$/.test(this.$route.params.id)) {
          this.error=true
        }else {
          await this.getStory(this.$route.params.id);
        }
        },
        watch: {
          $route() {
            if (! /^\d+$/.test(this.$route.params.id)) {
          this.error=true
        }else {
            this.getStory(this.$route.params.id);
        }
          }
        }
      };
      </script>
      
