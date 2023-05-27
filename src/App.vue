<template>
<nav class="total navbar navbar-expand-lg navbar-light bg-light" style="position: fixed; width: 1920px; z-index: 1;">
  <div class="container-fluid">
    <a class="navbar-brand bg-success shadow p-3 text-white" href="#" style="border-radius: 25px;"> <i class="fa-solid fa-note-sticky"></i> Cheap Talks</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="text-center" id="navbarNavDropdown">


      <nav class="p-2" v-show="!ifSingedIn">
        <ul class="navbar-nav" style="margin-right: 10px;">

          <li class="nav-item">
            <RouterLink to="/home" class="nav-link bg-info text-white active p-3" style="border-radius: 25px; margin-right: 10px; width: 150px;"><i class="fa-solid fa-house-chimney-user"></i> Home</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/dashboard" class="nav-link active bg-primary text-white p-3" style="border-radius: 25px; margin-right: 10px; width: 150px;"> <i class="fa-solid fa-users"></i> Authors</RouterLink>
          </li>


          <li class="nav-item dropdown">
                <button  class="btn nav-link text-white bg-secondary" type="button" id="logoutDropdown" data-toggle="dropdown"
                style="width: 275px; border-radius: 25px;">
                <p class="d-flex justify-content-center" style="transform: translateY(7px); margin-bottom: 10px;">Settings &nbsp; <h6 style="transform: translateY(-1px);"> <i class="fa-solid fa-sort-down"></i></h6> </p> 
                </button>
                <div class="dropdown-menu total mt-2" style="margin-left: 0px; border-radius: 15px; width: 275px;">
         
                <RouterLink to="/" class="dp-link nav-link active text-left"><i class="fa-solid fa-note-sticky"></i> Register</RouterLink>
    
                <RouterLink to="/login" class="dp-link nav-link active text-left"> <i class="fa-solid fa-right-to-bracket"></i> Login</RouterLink>
        
                </div>
            </li>
        
        </ul>
      </nav>


      <div v-for="author in authors" :key="author.authors">
      <nav class="navbar navbar-expand-lg navbar-light bg-light" v-show="ifSingedIn">
        <ul class="navbar-nav" >
       

         
          <li class="nav-item">
            <RouterLink to="/home" class="nav-link bg-info text-white  active p-3" style="border-radius: 25px; margin-right: 10px; width: 150px;"><i class="fa-solid fa-house-chimney-user"></i> Home</RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink to="/dashboard" class="nav-link active bg-primary text-white p-3" style="border-radius: 25px; margin-right: 10px; width: 150px;"> <i class="fa-solid fa-users"></i> Authors</RouterLink>
          </li>


          <li class="nav-item dropdown">
                <button  class="btn nav-link text-white" type="button" id="logoutDropdown" data-toggle="dropdown"
                :style="{backgroundColor:author.gender === 'Female' ? 'rgba(200, 75, 79, 0.517)' : 'rgba(0, 0, 255, 0.5)'}"
                style="width: 275px; border-radius: 25px;"
                >
           
                <p class="d-flex justify-content-center" style="transform: translateY(7px); margin-bottom: 10px;">{{ author.fullName }} &nbsp; <h6 style="transform: translateY(-1px);"> <i class="fa-solid fa-sort-down"></i></h6> </p> 
                </button>
                <div class="dropdown-menu total mt-2" style="margin-left: 0px; border-radius: 15px; width: 275px;">
                  <RouterLink to="/createposts" class="dp-link nav-link active text-left"><i class="fa-solid fa-signs-post"></i> Create Post</RouterLink>

                  <RouterLink to="/myposts" class="dp-link nav-link active text-left"><i class="fa-solid fa-clone"></i> My Posts</RouterLink>

                  <RouterLink to="/login" class="dp-link nav-link  text-left" @click="logout()"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</RouterLink>
                </div>
            </li>
          </ul>
      </nav>
    </div>
    </div>
  </div>
</nav>


  <div class="">
    <div class="">
      <header class="p-4">

     
     
</header>
    </div>
  </div>

  <div class="" style="margin-left: 100px;">
  <RouterView />


  </div>
</template>

<style>
.dp-link{
  background-color: rgb(255, 255, 255);
  border-radius: 15px;
  margin: 10px;
  transition: 0.2s;
}
.dp-link:hover{
  background-color: rgb(212, 212, 212);

}

</style>

<script setup>
import {db} from './firebase/index.js'
import {addDoc, collection, onSnapshot,deleteDoc, doc, updateDoc, getDoc, query, orderBy} from "firebase/firestore";
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, onMounted, computed  } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase/index.js'
import router from './router'


const ifSingedIn = ref (false)
const authors = ref([])
const posts = ref([])

const id = ref(1)
const qAuthor = (collection(db, "author"));
const qPosts = (collection(db, "posts"));


onMounted(() => {
  onAuthStateChanged(auth, function(user) {
    if (user) {
      ifSingedIn.value = true
      router.push('/home')
    } else {
      router.push('/login')
    }
  })
})





const logout = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      ifSingedIn.value = false;
      router.push("/login");
    })
    .catch((error) => {
      // An error happened.
      console.log(error);
    });
};




onMounted(async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const qAuthor = query(collection(db, "author"), orderBy("fullName"));
        const qPosts = query(collection(db, "posts"));

        onSnapshot(qAuthor, (snapshot) => {
          const authorTmp = [];
          snapshot.forEach((doc) => {
            const author = {
              id: doc.id,
              fullName: doc.data().fullName,
              address: doc.data().address,
              gender: doc.data().gender,
              emailAddress: doc.data().emailAddress,
              completed: doc.data().completed,
            };
            if (author.emailAddress === user.email) {
              authorTmp.push(author);
            }
          });
          authors.value = authorTmp;
        });

  

        onSnapshot(qPosts, (snapshot) => {
          const postTmp = [];
          snapshot.forEach((doc) => {
            const post = {
              id: doc.id,
              category: doc.data().category,
              post: doc.data().post,
              userId: doc.data().userId,
              fullName: doc.data().fullName, 
              gender: doc.data().gender, 
              totalPosts: doc.data().totalPosts, 
              dateTime: doc.data().dateTime, 
              completed: doc.data().completed,
            };
            postTmp.push(post);
          });
          posts.value = postTmp;

        });
      }
    });
  });




</script>
