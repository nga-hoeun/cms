<template>
  <nav class="bg-light mb-5 d-flex justify-content-around align-items-center">
    <div class="d-flex justify-content-start align-items-center">
      <img src="../assets/cms.png" alt="" class="w-25">
    </div>
    <ul style="list-style: none;" class="d-flex justify-content-satrt align-items-center">
      <li class="p-4">
        <router-link to="/dashboard">DASHBOARD</router-link>
      </li>
      <li class="p-4">
        <router-link to="/profile">PROFILE</router-link>
      </li>
    </ul>
    <button class="btn border border-danger" @click="signOut">Sign Out</button>
  </nav>
</template>

<script>
export default {
  data(){
    return{
      items:[
        'dashboard',
        'profile',
      ]
    }
  },
  methods:{
    signOut(){
      localStorage.removeItem('token'),
      localStorage.removeItem('id'),
      this.$router.push("/")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
