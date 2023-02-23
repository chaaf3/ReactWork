<template>
    <div>
      
      <div v-if="CharacterList">
      <ul>
        <li v-for="(character,index) in CharacterList" :key="index">
          <router-link :to="{name: 'individualCharacter', params: {id: character.id}}">{{character.name}}</router-link>
        </li>
      </ul>
      
      <br />
      <br />
      
      <router-link v-if="pageNum >1" :to="{name: 'characterList', params: {pageNum: parseInt(pageNum) - 1}}">Previous Page</router-link>
      <router-link v-if="hasNext" :to="{name: 'characterList', params: {pageNum: parseInt(pageNum) + 1}}">Next Page</router-link>
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
  export default {
    name: "CharacterList",
    components:{
      FourComp
    },
    data() {
    if (this.$route.params.pageNum) {
      return { CharacterList: null, pageNum: this.$route.params.pageNum, error: false, hasNext: false };
    }
    return { CharacterList: null, pageNum: 1, error: false, hasNext: false};
  },
  watch: {
    $route() {
      this.CharacterList= null;
        if (! /^\d+$/.test(this.$route.params.pageNum)) {
          this.error=true
        }
      else if (this.$route.params.pageNum) {
        this.pageNum = this.$route.params.pageNum;
        try {
      if (this.pageNum) {
        axios.get(
            `http://localhost:3001/api/characters/page/${parseInt(this.pageNum) - 1}`
          )
        .then(({ data }) => {(this.CharacterList = data.characterPage);
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
      this.CharacterList = null;
      if (! /^\d+$/.test(this.$route.params.pageNum)) {
          this.error=true
        }
        else {
      try {
      if (this.pageNum) {
        axios.get(
            `http://localhost:3001/api/characters/page/${parseInt(this.pageNum) - 1}`
          )
          .then(( {data} ) => {(this.CharacterList = data.characterPage);
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
  

