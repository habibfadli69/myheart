<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <div class="clearfix">
            <img class="img-avatar" src="img/brand/logo.png" alt="admin@bootstrapmaster.com">
            <h1 class="pt-3">Oops! Something wrong :(</h1>
            <h4 class="text-muted">You cant access this page</h4>
          </div>
          <div>
            <b-button variant="warning" class="active mt-3" @click="toLogin">Login</b-button>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page404",
  methods:{
    toLogin(){
      window.localStorage.removeItem("token")
      window.localStorage.removeItem("peternak_id")
      window.localStorage.removeItem("role")
      this.$router.push({ name: 'Login' })      
    },
  }
};
</script>
