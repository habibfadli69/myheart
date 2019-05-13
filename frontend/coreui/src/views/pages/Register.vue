<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-alert show variant="danger" v-if="errors.length > 0">
              <h4 class="alert-heading">Error !</h4>
              <ul>
                <li v-for="item in errors" :key="item">{{ item }}</li>
              </ul>
              <hr>
              <p class="mb-0">
               Please check again your form field.
              </p>
            </b-alert>
            <b-alert show variant="success" v-if="successAlert.length > 0">
              <h4 class="alert-heading">Selamat !</h4>
              <ul>
                <li v-for="item in successAlert" :key="item">{{ item }}</li>
              </ul>
              <hr>
              <p class="mb-0">
               <b-button variant="warning" block @click="toLogin">Login</b-button>
              </p>
            </b-alert>

          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form>
                <h1>Register</h1>
                <p class="text-muted">Create your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="text" class="form-control" placeholder="Username" autocomplete="username" v-model="username" />
                </b-input-group>

                <!-- <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text>@</b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="text" class="form-control" placeholder="Email" autocomplete="email" />
                </b-input-group> -->

                <b-input-group class="mb-3">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="password" class="form-control" placeholder="Password" autocomplete="new-password" v-model="password" />
                </b-input-group>
                

                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="fa fa-address-card"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="text" class="form-control" placeholder="Name" autocomplete="Name" v-model="nama" />
                </b-input-group>

                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="fa fa-map-pin"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="text" class="form-control" placeholder="Address" autocomplete="Address" v-model="alamat" />
                </b-input-group>
                
                <b-input-group class="mb-4">
                  <b-input-group-prepend>
                    <b-input-group-text><i class="fa fa-phone"></i></b-input-group-text>
                  </b-input-group-prepend>
                  <b-form-input type="number" class="form-control" placeholder="Phone" autocomplete="Phone" v-model="telp" />
                </b-input-group>

                <b-button variant="warning" block @click="checkForm">Create</b-button>
              </b-form>
            </b-card-body>
            
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'Register',
  data: function(){
    return{
      username:"",
      password:"",
      nama:"",
      alamat:"",
      telp:"",
       errors: [],
       successAlert: []
    }
   
  },
  methods:{
    checkForm:function(e){
      if(this.username && this.password && this.nama && this.alamat && this.telp){
        this.postData();
      }
      this.errors = []
      if(!this.username){
        this.errors.push('Username cant blank !');
      }
      if(!this.password){
        this.errors.push('Password cant blank !');
      }
      if(!this.nama){
        this.errors.push('Name cant blank !');
      }
      if(!this.alamat){
        this.errors.push('Address cant blank !');
      }
      if(!this.telp){
        this.errors.push('Phone cant blank !');
      }
      e.preventDefault();
    },
    toLogin(){
      this.$router.push({ name: 'Login' })      
    },
    async postData() {
      const response = await PostsService.addPost({
                          username: this.username,
                          password: this.password,
                          role: 2,
                          nama:this.nama,
                          alamat:this.alamat,
                          telp: this.telp
                        });
      if(response.data.status){
        this.successAlert.push('Congratulation,You have successfully created a new account, please click the button to login');
          
      }
      
    }
    
    
  }
}
</script>
