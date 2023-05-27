<template>
    <div class="cont">
        <div class="w-50" style="margin: 100px;">
          <h2 class="d-flex justify-content-between">
           <b style="transform: translateY(20px);">{{ fullName }}'s posts</b>
           <select v-model="selectedCategory" name="" id="" class="p-3 select bg-secondary text-white" style="font-size: 15px; border-radius: 25px; z-index: 1; transform: translateY(-82px) translateX(575px); background: transparent; outline: 1px solid white;">
            <option value="">All Categories</option>
            <option value="Adventure">Adventure</option>
            <option value="Romance">Romance</option>
            <option value="Horror">Horror</option>
            <option value="Politics">Politics</option>
            <option value="Religion">Religion</option>
            <option value="Drama">Drama</option>
          </select>
          </h2>


            <div v-for="post in paginatedPosts" :key="post.id">
                <div class="card mb-2"
                :style="{backgroundColor:post.gender === 'Male' ? 'rgba(31, 57, 79, 0.517)' : 'rgba(75, 31, 79, 0.517)'}"
                style="transform: translateY(30px); background-repeat: no-repeat; background-size: 100%; z-index: -1; border-radius: 15px; box-shadow: 0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09);">
                    <div class="card-body">
                        <div class="p-3">
        
                            <div class="d-flex mb-2 text-white">
                              <h5 class="text-white mb-5" style=" border-radius: 5px; padding-right: 100px; z-index: 1;">
                                <h6 class="p-5" style="margin-bottom: -100px; transform: translateY(-13px); background-position: 0px 0px; background-size: 100%; background-repeat: no-repeat;" :style="{ backgroundImage: post.gender === 'Female' ? 'url(public/girl.png)' : 'url(public/boy.png)'}"></h6> 
                              </h5>


                              <div class="d-block w-50" style="background-color: rgb(47, 88, 116); border-radius: 50px; padding-right: 50px; padding-left: 75px; padding-top: 10px; padding-bottom: 10px; transform: translateX(-150px); z-index: 0;">
                                <h6><b>{{ post.fullName }}</b></h6>
                              <h6 style="font-size: 15px;">{{ post.category }}</h6>
                              </div>
                      
                               
                            </div>
        
                                                
                            <textarea v-model="post.post" name="" id="" cols="30" rows="5" class="form-control" style="transform: translateY(15px); resize: none; border-radius: 15px; box-shadow: 0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09);"></textarea>
                            <h5 class="mt-4 float-right text-white">Posted {{ formatDate(post.dateTime.toMillis()) }}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page mb-3">
            <div class="pagination">
                <button @click="previousPage" :disabled="currentPage === 1" class="bg-info m-1 text-white rounded shadow" style="padding-top: 10px; padding-bottom: 10px; width: 50px; cursor:pointer; margin-top: 100px;"> <i class="fa-solid fa-caret-left"></i></button>
                <template v-for="pageNumber in totalPages">
                <button @click="goToPage(pageNumber)" :class="{ active: pageNumber === currentPage }" class="btn p-2 m-1 text-white rounded shadow" style="width: 50px; cursor: pointer;">{{ pageNumber }}</button>
                </template>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="bg-info m-1 text-white rounded shadow" style="padding-top: 10px; padding-bottom: 10px; width: 50px; cursor:pointer; margin-top: 100px;"> <i class="fa-solid fa-caret-right"></i></button>
            </div>
            </div>
        </div>
    </div>
    </template>


    

<script setup>
import { ref, onMounted, watch } from 'vue'
import { db, auth } from '../firebase/index.js'
import { onAuthStateChanged } from 'firebase/auth'
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { computed } from '@vue/reactivity'
import { useRoute } from 'vue-router';


const currentUser = ref(null)
const selectedCategory = ref('');


const currentPage = ref(1);
const postsPerPage = 2;
const totalPages = ref(0);


const posts = ref([])

const postsRef = collection(db, 'posts')
const userRef = collection(db, 'author')

const fullName = ref('')
const gender = ref('')




onMounted(() => {
    const route = useRoute()
    const cheapTalk_id = route.params.uid  
    
    const qPost = query(postsRef, where('userId', '==', cheapTalk_id))
    const qUser = query(userRef, where('uid', '==', cheapTalk_id))
    onSnapshot(qUser, (querySnapshot) => {
        querySnapshot.docs.map((docs) => {
            fullName.value = docs.data().fullName 
            gender.value = docs.data().gender
         
        })
    });

    
    onSnapshot(qPost, (querySnapshot) => {
        const postsTmp = []
        querySnapshot.forEach((doc) => {
            const post = {
                userId: doc.data().userId,
                category: doc.data().category,
                post: doc.data().post,    
                fullName: doc.data().fullName,
                gender: doc.data().gender,
                dateTime: doc.data().dateTime, 
            }
            postsTmp.push(post)
        })
        console.log(postsTmp)
        posts.value = postsTmp
    });
})





const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return filteredPosts.value.slice(startIndex, endIndex);
});

const filteredPosts = computed(() => {
  if (selectedCategory.value === '') {
    return posts.value; // Return all posts if no category is selected
  } else {
    return posts.value.filter(post => post.category === selectedCategory.value);
  }
});

watch(filteredPosts, () => {
  totalPages.value = Math.ceil(filteredPosts.value.length / postsPerPage);
});

function formatDate(timestamp) {
  const dateObj = new Date(timestamp);
  const formattedDate = `${dateObj.getMonth() + 1}-${dateObj.getDate()}-${dateObj.getFullYear().toString().slice(-2)}`;
  const formattedTime = `${dateObj.getHours()}:${dateObj.getMinutes()}`;
  return `${formattedTime} ${formattedDate}`;
}


function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(pageNumber) {
  currentPage.value = pageNumber;
}


    
</script>