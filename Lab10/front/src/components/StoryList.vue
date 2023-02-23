<template>
    <div>
      
      <div v-if="StoryList">
      <ul>
        <li v-for="(story,index) in StoryList" :key="index">
          <router-link :to="{name: 'individualStory', params: {id: story.id}}">{{story.title}}</router-link>
        </li>
      </ul>
      
      <br />
      <br />
      
      <router-link v-if="pageNum >1" :to="{name: 'storyList', params: {pageNum: parseInt(pageNum) - 1}}">Previous Page</router-link>
      <router-link v-if="hasNext" :to="{name: 'storyList', params: {pageNum: parseInt(pageNum) + 1}}">Next Page</router-link>
    </div>
    <div v-else-if="error">
        <FourComp></FourComp>
      </div>
    <div v-else>
      <h1>Loading...</h1>
    </div>
    </div>
  </template>
  
<script>

import FourComp from "./FourComp.vue"
  import axios from "axios";
  export default {
    name: "StoryList",
    components:{
      FourComp
    },
    data() {
    if (this.$route.params.pageNum) {
      return { StoryList: null, pageNum: this.$route.params.pageNum, error: false, hasNext: false };
    }
    return { StoryList: null, pageNum: 1, error: false, hasNext: false};
  },
  watch: {
    $route() {
      this.StoryList= null;
      if (! /^\d+$/.test(this.$route.params.pageNum)) {
          this.error=true
        }
      else if (this.$route.params.pageNum) {
        this.pageNum = this.$route.params.pageNum;
        try {
      if (this.pageNum) {
        axios.get(
            `http://localhost:3001/api/stories/page/${parseInt(this.pageNum) - 1}`
          )
        .then(({ data }) => {(this.StoryList = data.storyPage);
        this.hasNext = data.hasNext
        this.error=false}).catch(()=>this.error=true) ;
    }
  } catch (e) {
    console.log ("IN CATCH")
    console.log (this.error)
    this.error = true;
  }
      } else {
        this.pageNum = 1;
      }
    }
  },
    created() {
      this.storyList = null;
      if (! /^\d+$/.test(this.$route.params.pageNum)) {
          this.error=true
        }
        else {
      try {
      if (this.pageNum) {
        axios.get(
            `http://localhost:3001/api/stories/page/${parseInt(this.pageNum) - 1}`
          )
          .then(( {data} ) => {(this.StoryList = data.storyPage);
          this.hasNext = data.hasNext;
          this.error=false}).catch(()=>this.error=true) ;
    }
  } catch (e) {
    this.error = true;
  }
}
  }, 
  methods: {
    nextPage() {
    }
  }
}
  </script>
  

