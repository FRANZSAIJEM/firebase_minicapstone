<template>
  <div class="body">
    <div class="container">
      <div class="mt-5">
        <div class="d-flex">
          <div class="card total" style="width: 2000px;">
            <div class="d-block p-5">
              <div class="float-right" style="margin-top: -50px; margin-right: -50px;">
                <div  v-show="error" class="alert alert-danger p-5">
                        {{ errorMsg }}
                    </div>
                      <div v-show="success" class="alert alert-success">
                          {{ successMsg }}
                      </div>
                </div>
                <div style="width: 500px;">
                      <h1>Login</h1>
                      <label for="emailAddress" class="text-center" style="font-size: 20px;">Email Address:</label> <br>
                      <input v-model="emailAddress" type="text" name="" id="" class="form-control total"> 
                      <br>

                      <label for="password" class="" style="font-size: 20px;">Password:</label> <br>
                      <input v-model="password" type="password" name="" id="" class="form-control total"> <br>

                      <RouterLink to="/" class="nav-link active" style="width: 225px;">Don't have an account?</RouterLink>

                      <button @click="login()" class="btn btn-primary float-right" style="transform: translateY(-30px);"><h5>Login</h5></button>
                      <br>
                      <h3 style="display: grid; place-content: center;" class="col-md-12 mb-5"><b>Or</b></h3>

                      
                      <button class="btn alert-success w-100 total" @click="signInWithGoogle()"> 
                      <h4><i class="fa-brands fa-google"></i> Sign in with google </h4>  
                      </button>
                       <br>
                       <br>
                      <button class="btn alert-primary w-100 total" @click="signInWithFacebook()"> 
                      <h4><i class="fa-brands fa-facebook"></i> Sign in with Facebook </h4>  
                      </button>
                      <br>
                       <br>
                      <button class="btn alert-info w-100 total" @click="signInWithTwitter()"> 
                      <h4><i class="fa-brands fa-twitter"></i> Sign in with Twitter </h4>  
                      </button>
                      

              </div>
            

            </div>
          </div>
        
        </div>
    </div>
    </div>
  </div>
</template>

<script setup>

import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth'
import { onMounted, ref } from 'vue'
import { auth } from '../firebase/index.js'


import router from '../router'

const emailAddress = ref('')
const password = ref('')

const error = ref('')
const errorMsg = ref('')

const login = () => {
 
 if(emailAddress.value != '' && password.value != ''){

   signInWithEmailAndPassword(auth, emailAddress.value, password.value)
   .then((cred)=>{
   router.push('/home')

 })
 .catch((err)=>{
   error.value = true
   errorMsg.value = err.message
 })
 }
 else{
   error.value = true;
   errorMsg.value = 'Please fill all the fields';
 }

}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
  .then((cred)=>{
    router.push('/home')
  })
  .catch((err) => {
    error.value = true
    errorMsg.value = err.message
  })
}

const signInWithFacebook = () => {
  const provider = new FacebookAuthProvider()
  signInWithPopup(auth, provider)
  .then((cred)=>{
    router.push('/dashboard')
  })
  .catch((err) => {
    error.value = true
    errorMsg.value = err.message
  })
}

const signInWithTwitter = () => {
  const provider = new TwitterAuthProvider()
  signInWithPopup(auth, provider)
  .then((cred)=>{
    router.push('/dashboard')
  })
  .catch((err) => {
    error.value = true
    errorMsg.value = err.message
  })
}




</script>