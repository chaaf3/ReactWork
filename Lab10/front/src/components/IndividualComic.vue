<template>
    <div>
      <div v-if="comic">
        <h1>{{comic ? comic.title: ''}}</h1>
        <br />
        <img v-if="image" :src="`${this.comic.thumbnail.path}/standard_amazing.${this.comic.thumbnail.extension}`" :alt="comic.title" />
        <img v-else :src="noImg" :alt="comic.title" />
        <h1>{{comic ? comic.resourceURI: ''}}</h1>
        <br />
        <br />
        <h2>Related Variant List if any:</h2>
        <ul>
        <li v-for="(val, index) in this.comic.variants" :key="index">
          <router-link :to="{name: 'individualComic', params: {id: val.resourceURI.split('/').slice(-1)[0]}}">{{val.name}}</router-link>
        </li>
        </ul>
        <br/>
        <h1>Related Stories if any:</h1>
        <ul>
        <li v-for="(val, index) in this.comic.stories.items" :key="index">
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
      name: "IndividualComic",
      components:{
        FourComp
      },
        data() {
          return {
            id: this.$route.params.id,
            comic: null,
            error: false,
            image: false,
            noImg: noImg,
          };
        },
        methods: {
          getComic(id) {
            axios
              .get(`http://localhost:3001/api/comics/${id}`)
              .then(({ data }) => {(this.comic = data); 
                this.error=false;
                if (this.comic.thumbnail) {
                    this.image = true
                }
                else {
                  this.image = false;
                }
              }).catch(()=>{this.error=true})
          },
        },
        async created() {
          if (! /^\d+$/.test(this.$route.params.id)) {
          this.error=true
        } else {
          await this.getComic(this.$route.params.id);
        }
        },
        watch: {
          $route() {
            if (! /^\d+$/.test(this.$route.params.id)) {
          this.error=true
        }
        else {
            this.getComic(this.$route.params.id);
        }
          }
        }
      };
      </script>
      