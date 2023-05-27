<template>
<div class="cont">
        <div class="w-50" style="margin: 100px;">
          <h2 style="transform: translateY(20px);"><b>Create Post</b></h2>
         


          
                <div class="card mb-2"
                style="background-color: rgb(136, 106, 106); transform: translateY(30px); background-repeat: no-repeat; background-size: 100%; border-radius: 15px; box-shadow: 0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09);">
                    <div class="card-body">
                        <div class="p-3">
                          <h2 class="d-flex justify-content-between">
                          <select v-model="category" name="" id="" class="p-3 select bg-secondary text-white" style="font-size: 15px; border-radius: 25px; z-index: 1;background: transparent; outline: 1px solid white;">
                            <option value="Select Category">Select Category</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Romance">Romance</option>
                            <option value="Horror">Horror</option>
                            <option value="Politics">Politics</option>
                            <option value="Religion">Religion</option>
                            <option value="Drama">Drama</option>
                          </select>
                        </h2>
                           
                        <textarea v-model="post" placeholder="Post Here" name="" id="" cols="30" rows="5" class="form-control" style="margin-top: 100px; resize: none; border-radius: 15px;" required></textarea>
                        <div style="display: flex; place-content: center;">

                          <button @click="publish()" class="mt-5" :disabled="!isValidForm" style="border: none; background-color: transparent;">
                            <div v-if="loading" class="loadingA">
                              <h6 class="loaderCreate"></h6>
                            </div>
                            <div v-else class="loadingB">Publish</div>
                          </button>
                        </div>
                      
                        </div>
                    </div>
                </div>
           
            <div class="page mb-3">
          
            </div>
        </div>
    </div>



    <!-- <div class="">
        <div class="body" style="margin: 100px;">
            <h2 class="text-center" >
               Create Post
            </h2>
            
            <div class="card mb-5" style="background-color: rgb(109, 157, 159); border-radius: 15px; box-shadow: 0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09);">
                <div class="card-body">
                    <div class="p-3">
    
                        <div class=" mb-4 text-white">
                            <select name="" id="" class="form-control" v-model="category">
                                <option value="Select Category">Select Category</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Romance">Romance</option>
                                <option value="Horror">Horror</option>
                                <option value="Religion">Religion</option>
                                <option value="Politics">Politics</option>
                                <option value="Drama">Drama</option>
                            </select> 
                            <br>
                        </div>
    
                                            
                      
                    </div>
                </div>
            </div>

        </div>

    </div> -->
</template>
    
<script setup>
import { ref, onMounted, computed } from 'vue'
import {db} from '../firebase/index.js'
import {addDoc, collection, onSnapshot,deleteDoc, doc, updateDoc, getDocs, query, orderBy, where} from "firebase/firestore";
import { auth } from '../firebase/index.js'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { RouterLink } from 'vue-router'
import router from '../router'




// async function fetchFullName(userId) {
//   try {
//     const authorSnapshot = await getDoc(doc(db, 'author', userId));
//     if (authorSnapshot.exists()) {
//       const authorData = authorSnapshot.data();
//       return authorData.fullName;
//     } else {
//       console.log("No matching document found in 'author' collection.");
//     }
//   } catch (error) {
//     console.log("Error fetching 'fullName' from 'author' collection:", error);
//   }
//   return null;
// }

const showPost = ref(false);
const loading = ref(false);

const category = ref("Select Category");
const post = ref("");

const isValidForm = computed(() => {
  return category.value !== "Select Category" && post.value !== "";
});

const publish = async () => {
  if (category.value !== '' && post.value !== '') {
    loading.value = true;
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      let fullName = '';
      let gender = '';



      const authorQuerySnapshot = await getDocs(query(collection(db, 'author'), where('uid', '==', userId)));
      if (!authorQuerySnapshot.empty) {
        const document = authorQuerySnapshot.docs[0];
        const authorData = document.data();
        fullName = authorData.fullName;
        gender = authorData.gender;

      }

      const userPostsCollectionRef = collection(db, 'posts');
      const userPostsQuerySnapshot = await getDocs(query(userPostsCollectionRef, where('userId', '==', userId)));
      const userTotalPosts = userPostsQuerySnapshot.size;

      const postDoc = {
        category: category.value,
        post: post.value,
        userId: userId,
        gender: gender,
        fullName: fullName,
        totalPosts: userTotalPosts + 1,
        dateTime: new Date(),
        completed: false,
        
      };

      try {
        await addDoc(userPostsCollectionRef, postDoc);
        showPost.value = true;
 
     
      } catch (error) {
        // console.log('Error adding post document:', error);
      }
    }
    category.value = '';
    post.value = '';

    setTimeout(() => {
      loading.value = false; // Hide the loading animation
      router.push('/home'); // Route to the home page
    }, 2000);
  }
};



    
</script>

<style>
 .loaderCreate {
    border: 16px solid #f3f3f3; /* Light gray */
    border-top: 16px solid #000000; /* Blue */
    border-radius: 50%;
    width: 25px;
    height: 25px;
    animation: spin 2s linear infinite;
    margin: 0 auto;
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }


.loadingB{
  padding: 15px;
  cursor: pointer;
  color: white;
  background-color: transparent;
  border: 1px;
  border-radius: 50px;
  transition: 0.3s;
}

.loadingB:hover{
  padding-left: 25px;
  padding-right: 25px;
  cursor: pointer;
  color: white;
  background-color: transparent;
  border: 1px;
  background-color: rgb(168, 144, 24);
  border-radius: 50px;
}

.loadingA{
  padding: 15px;
  padding-left: 25px;
  padding-right: 25px;
  color: white;
  background-color: transparent;
  border: 1px;
  background-color: rgb(168, 144, 24);
  border-radius: 50px;
  transition: 0.5s;
}

.loadingA:hover{
  padding: 15px;
  padding-left: 50px;
  padding-right: 50px;
  color: rgb(255, 255, 255);
  background-color: transparent;
  border: 1px;
  background-color: rgb(32, 27, 3);
  border-radius: 50px;

}


.fade-move {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-in {
  opacity: 1;
}
</style>