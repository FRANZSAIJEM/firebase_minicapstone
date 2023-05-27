<template>
  <div class="body">
    <div class="container">
      <div class="mt-5">
        <div class="d-flex">
          <div class="card total" style="width: 3500px;">
            <div class="d-block p-5">
              <div class="float-right" style="margin-top: -50px; margin-right: -50px;">
                <div  v-show="error" class="alert alert-danger p-5">
                        {{ errorMsg }}
                    </div>
                      <div v-show="success" class="alert alert-success">
                          {{ successMsg }} <br> <br>
                          {{ verified }}
                      </div>
                </div>
              <div style="width: 500px;">
                <h1>Register</h1>
                <label for="fullName" class="text-center" style="font-size: 20px;">Full Name:</label> <br>
                      <input v-model="fullName" type="text" name="" id="" class="form-control total"> 
                      <br>

                      <label for="address" class="text-center" style="font-size: 20px;">Address:</label> <br>
                      <input v-model="address" type="text" name="" id="" class="form-control total"> 
                      <br>

                      
                      <label for="gender" class="text-center" style="font-size: 20px;">Gender:</label><br>
                 
                      <select name="" id="" v-model="gender" class="form-control total">
                    
                          <option value="">Choose Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>

                      </select> 
                      <br>

                      <label for="emailAdress" class="text-center" style="font-size: 20px;">Email Address:</label> <br>
                      <input v-model="emailAddress" type="email" name="" id="" class="form-control total">
                      <br>

                      <label for="password" class="text-center" style="font-size: 20px;">Password:</label> <br>
                      <input v-model="password" type="password" name="" id="" class="form-control total">
                      <br>
                    

                      <label for="confirmPassword" class="text-center" style="font-size: 20px;">Confirm Password:</label> <br>
                      <input v-model="confirmPassword" type="password" name="" id="" class="form-control total">
                      <br>

                      
                      <RouterLink to="/login" class="nav-link active" style="width: 250px;">Already have an account?</RouterLink>
         
                      <button @click="register()" class="btn btn-primary float-right" style="transform: translateY(-30px);"><h5>Register</h5></button>
              </div>
            

            </div>
          </div>
        
        </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {db} from '../firebase/index.js'
import {addDoc, collection, onSnapshot,deleteDoc, doc, updateDoc, getDoc, query, orderBy} from "firebase/firestore";
import { auth } from '../firebase/index.js'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { RouterLink } from 'vue-router'
import router from '../router'


const fullName = ref('')
const address = ref('')
const gender = ref('')
const emailAddress = ref('')

const password = ref('')
const confirmPassword = ref('');


const error = ref('')
const errorMsg = ref('')


const success = ref('')
const successMsg = ref('')
const verified = ref('')


const register = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (fullName.value !== '' && address.value !== '' && gender.value !== '' && emailAddress.value !== '' && password !== '') {
      if (password.value !== confirmPassword.value) {
      error.value = true;
      errorMsg.value = 'Passwords do not match.';
      return;
    }

    if (!emailRegex.test(emailAddress.value)) {
      error.value = true;
      errorMsg.value = 'FirebaseError: Firebase: Error (auth/invalid-email).';
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, emailAddress.value, password.value);
      
      await addDoc(collection(db, "author"), {
        fullName: fullName.value,
        address: address.value,
        gender: gender.value,
        emailAddress: emailAddress.value,
        uid: user.uid,
        completed: false
      });

      // sendEmailVerification(user);

      error.value = false;
      success.value = true;
      successMsg.value = 'Registered Successfully.';
      // verified.value = 'A verification link has been sent to your email.';



      fullName.value = '';
      address.value = '';
      gender.value = '';
      emailAddress.value = '';

      password.value = null;

    } catch (error) {
      error.value = true;
      errorMsg.value = error;
    }
  } else {
    error.value = true;
    errorMsg.value = 'FirebaseError: Firebase: Error (auth/fields-is-empty)';
  }
}


</script>

<style>
.body{
    display: grid;
    place-content: center;
}


.form-control:focus{
  transform: translateY(-10px);
  transition: 0.5s;
}
</style>






//npm install -g firebase-tools








    
    