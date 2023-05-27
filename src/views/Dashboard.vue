<template>
    <div class="body">
        <div class="d-block container mt-3" style="position: fixed;">

            <div class="total p-5" style="margin: 50px; margin-bottom: 100px; background-color: white; border-radius: 20px; width: 500px;">   
                
                <h1 class="text-center"><i class="fa-solid fa-users"></i> {{ users.length }}<br> All Users</h1>
            </div>


            <div class="total p-5" style="margin: 50px; margin-bottom: 100px; background-color: white; border-radius: 20px; width: 500px;">
                 <h1 class="text-center" style="color:pink"><i class="fa-solid fa-person-dress"></i> {{ femaleUsers }}<br> Female Users</h1>     
            </div>


            
            <div class="total p-5" style="margin: 50px; margin-bottom: 100px; background-color: white; border-radius: 20px; width: 500px;">
                <h1 class="text-center" style="color:blue"><i class="fa-solid fa-person"></i> {{ maleUsers }}<br> Male Users</h1>
            </div>

        </div>
    <div class="body mt-5" style="margin-left: 500px;">
        <div class="container">
            <div class="d-flex flex-wrap">
                <div  class="m-3 routerBtn" v-if="!loading" v-for="user in users" :key="user.users" style="z-index: 0;">
                    <RouterLink :to="`/${user.uid}/view-author`" class="text-white p-2 btn total text-white "
                    style="width: 500px; cursor: pointer; background-size: 40%; background-repeat: no-repeat; background-position: 275px 70px;"
                  
                        :style="{ backgroundImage: user.gender === 'Female' ? 'url(public/girl.png)' : 'url(public/boy.png)'} , { backgroundColor: user.gender === 'Female' ?  'rgba(200, 75, 79, 0.517)' : 'rgba(0, 0, 255, 0.5)'}"                      
                        >
                      
                        <div class="card-body ">
                        <b class="float-left">Full Name</b> <br> <td>{{ user.fullName }}</td> <br>
                        <b class="float-left">Address</b> <br> <td>{{ user.address }}</td> <br>
                        <b class="float-left">Email Address</b> <br> <td>{{ user.emailAddress }}</td> <br>
                        <b class="float-left">Total Post</b> <br> <td>
                            <span v-if="user.postCount > 1">{{ user.postCount}} posts</span>
                            <span v-else>{{ user.postCount}} post</span>
                        </td> <br>
                      
                        </div>
                 
                    </RouterLink>
                    
                </div>


                

                <div v-else style="margin-top: 350px;" class="rounded-circle shadow">
                    <div class="loader"></div>
                </div>
            </div>
        </div>
    </div>
  
    </div>
    </template>
    
<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase/index.js'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, onSnapshot, query, where, getDocs, orderBy } from "firebase/firestore";
import { computed } from 'vue';
   
    
const authors = ref([])
const id = ref(1)



const qUser = (collection(db, "author"));
const qPost =(collection(db, 'posts'));
    

const femaleUsers = ref(0)
const maleUsers = ref(0)

const currentUser = ref(null)
const posts = ref([])
const totalPosts = ref(0)
const users = ref([])


const loading = ref(false);




// onMounted(async()=>{
//       onSnapshot(q,(snapshot)=> {
//         const authorTmp = []
//         let femaleCount = 0
//         let maleCount = 0


//         snapshot.forEach((doc) => {
    
//         const author = {
//           id: doc.id,
//           fullName: doc.data().fullName,
//           address: doc.data().address,
//           gender: doc.data().gender,
//           emailAddress: doc.data().emailAddress,
//           completed: doc.data().completed
//         }
    
//         authorTmp.push(author)

//         if(author.gender == 'Female'){
//             femaleCount++
//         }

//         if(author.gender == 'Male'){
//             maleCount++
//         }
//       });
//       authors.value = authorTmp
//       femaleUsers.value = femaleCount
//       maleUsers.value = maleCount

//       })
//     })


// Get Users Data


onSnapshot(
  query(qUser, orderBy('fullName', 'asc')),
 
  async (querySnapshot) => {
    
    loading.value = true;
    const userTmp = [];
    let femaleCount = 0
     let maleCount = 0
    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const id = doc.data().uid;
        const querySnapshot = await getDocs(
          query(qPost, where('userId', '==', id))
        );
        const count = querySnapshot.size;
        const user = {
          id: doc.id,
          uid: doc.data().uid,
          fullName: doc.data().fullName,
          address: doc.data().address,
          username: doc.data().username,
          gender: doc.data().gender,
          emailAddress: doc.data().emailAddress,
          postCount: count,
        };
        userTmp.push(user);

        if(user.gender == 'Female'){
            femaleCount++
        }

        if(user.gender == 'Male'){
           maleCount++
        }
      })
    );
    //dire masud tanang data sa user(users)
    users.value = userTmp;
    femaleUsers.value = femaleCount,
    maleUsers.value = maleCount
    // console.log('Users Data:', user.value);

    //pagkuha sa tanang data sa posts(pero ang gigamit ra ani is para makuha ang length sa posts sa tanang users)
    getAllPostsData();
//   console.log('Posts Data:', posts.value);

    setTimeout(() => {
      loading.value = false; 
    });
    
  }
);


const getUsersData = async () => {
  try {
    const querySnapshot = await getDocs(qUser);
    const usersData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      uid: doc.data().uid,
      fullName: doc.data().fullName,
      address: doc.data().address,
      gender: doc.data().gender,
      emailAddress: doc.data().emailAddress,
      completed: doc.data().completed
    }));

    users.value = usersData;
  } catch (error) {
    console.log('Error getting users data: ', error);
  }
};

const getAllPostsData = async () => {
    try {
        const querySnapshot = await getDocs(qPost);
        const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        category: doc.data().category,
        post: doc.data().post,
        userId: doc.data().userId,
        fullName: doc.data().fullName,
        gender: doc.data().gender,
        completed: doc.data().completed,
        }));

        posts.value = postsData;
    } catch (error) {
        console.log('Error getting posts data: ', error);
    }
};



</script>

<style>
.routerBtn{
  transition: 0.5s;
}


.routerBtn:hover{

  transform: translateY(-10px);
  background-color: #707070a7;

}



 .viewBtn{
      background-color: #3498db;
    }
    .viewBtn:hover{
      background-color: #3498db;
    }
    .body{
        display: grid;
        place-content: center;
    }
    .total{
        box-shadow: 0 2px 1px rgba(0,0,0,0.09), 0 4px 2px rgba(0,0,0,0.09), 0 8px 4px rgba(0,0,0,0.09), 0 16px 8px rgba(0,0,0,0.09), 0 32px 16px rgba(0,0,0,0.09);
    }
    .loader {
    border: 16px solid #f3f3f3; /* Light gray */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
    margin: 0 auto;
    }

    @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
    }
   
    </style>