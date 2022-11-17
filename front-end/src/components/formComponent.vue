<template>
  <div class="container">
    <div class="d-flex justify-content-center">
      <div class="card">
        <div class="card-header">
          <h3 v-if="isLogin">Sign In</h3>
          <h3 v-if="!isLogin">Sign Up</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="logIn">
            <div class="input-group form-group" v-if="!isLogin">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-user"></i></span>
              </div>
              <input type="text" class="form-control" placeholder="username" v-model="username">
            </div>
            <div class="input-group form-group" v-if="!isLogin">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fad fa-transgender-alt"></i></span>
              </div>
              <input type="text" class="form-control" placeholder="gender" v-model="gender">
            </div>
            <div class="input-group form-group">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
              </div>
              <input type="text" class="form-control" placeholder="email" v-model="email">
            </div>
            <span class="text-danger" v-if="email==null">The email is required</span>
            <div class="input-group form-group" v-if="isLogin">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-key"></i></span>
              </div>
              <input type="password" class="form-control" placeholder="password" v-model="password">
            </div>
            <span class="text-danger" v-if="password==null">The password is required</span>
            <div class="input-group form-group" v-if="!isLogin">
              <div class="input-group-prepend">
                <span class="input-group-text"><i class="fas fa-birthday-cake"></i></span>
              </div>
              <input type="number" class="form-control" placeholder="Age" v-model="age">
            </div>
            <div class="form-group" v-if="isLogin">
              <input type="submit" value="Login" class="btn float-right login_btn" @click="logIn">
            </div>
            <div class="form-group" v-if="!isLogin">
              <!-- <input type="button" value="Sign Up" class="btn float-right login_btn" @click="signUp"> -->
              <input type="button" value="Sign Up" class="btn float-right login_btn" @click="signUp" v-if="allRequired">
            </div>
          </form>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-center links" v-if="isLogin">
            Don't have an account?<a @click="changeStatus">Sign Up</a>
          </div>
          <div class="d-flex justify-content-center links" v-if="!isLogin">
            Already have an account?<a @click="changeStatus">Login</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
export default {
  data() {
    return {
      email: "",
      password: "",
      gender:"",
      username:"",
      age:null,
      isLogin: true,
      signUpInfo:{},
    }
  },
  methods: {
    changeStatus() {
      this.isLogin = !this.isLogin
    },
    logIn(){
      axios.post("http://localhost:4000/user/logIn", {email:this.email, password:this.password}).then(res=>{
        if(res.data.message == "login"){
          localStorage.setItem("token",res.data.data.token)
          localStorage.setItem("id",res.data.id)
          this.$router.push("/dashboard");
        }else{
          alert("Unsuccessful Login")
        }
      })
    },
    signUp(){
      if(this.allRequired){
        this.signUpInfo = {
          username: this.username,
          email: this.email,
          gender: this.gender,
          age: this.age
        }
        axios.post("http://localhost:4000/user/signUp", this.signUpInfo).then(res=>{
          console.log(res.data)
          this.isLogin = true
        })
      }else{
        alert("All fields are required!!")
      }
    }
  },
  computed:{
    allRequired(){
      if(this.username != "" && this.gender != "" && this.email != "" && this.age != null){
        return true
      }else{
        return false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  /* height: 100%; */
  margin-top: 7.5%;
}

.card {
  width:40%;
  margin-top: auto;
  margin-bottom: auto;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.social_icon span {
  font-size: 60px;
  margin-left: 10px;
  color: #FFC312;
}

.social_icon span:hover {
  color: white;
  cursor: pointer;
}

.card-header h3 {
  color: white;
}

.social_icon {
  position: absolute;
  right: 20px;
  top: -45px;
}

.input-group-prepend span {
  width: 50px;
  background-color: #FFC312;
  color: black;
  border: 0 !important;
}

input:focus {
  outline: 0 0 0 0 !important;
  box-shadow: 0 0 0 0 !important;

}

.remember {
  color: white;
}

.remember input {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  margin-right: 5px;
}

.login_btn {
  color: black;
  background-color: #FFC312;
  width: 100px;
}

.login_btn:hover {
  color: black;
  background-color: white;
}

.links {
  color: rgb(255, 255, 255);
}

.links a {
  margin-left: 4px;
}

.links a:hover {
  cursor: pointer;
  color: turquoise
}

.forget a {
  color: white
}
</style>