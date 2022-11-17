<template>
    <section>
        <navigation-bar></navigation-bar>
        <div class="w-50 m-auto">
            <div class="text-center">
                <h2>Posts</h2>
            </div>
            <div class="text-right p-3">
                <button @click="postCreate">
                    ADD +
                </button>
            </div>
            <div class="card w-50 m-auto" v-if="isCreatePost">
                <form class="p-3" @submit.prevent="createPost">
                    <div class="form-group">
                        <h6>Title</h6>
                        <input type="text" class="form-control" v-model="title">
                    </div>
                    <div class="form-group">
                        <h6>Content</h6>
                        <input type="text" class="form-control" v-model="content">
                    </div>
                    <div class="text-right">
                        <button class="btn btn-danger mr-1" @click="onCancel">Cancel</button>
                        <button class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
            <div class="card w-50 m-auto" v-if="isEdit">
                <form class="p-3" @submit.prevent="edit(postId)">
                    <div class="form-group">
                        <h6>Title</h6>
                        <input type="text" class="form-control" v-model="editedTitle">
                    </div>
                    <div class="form-group">
                        <h6>Content</h6>
                        <input type="text" class="form-control" v-model="editedContent">
                    </div>
                    <div class="text-right">
                        <button class="btn btn-danger mr-1" @click="onCancel">Cancel</button>
                        <button class="btn btn-primary">Edit</button>
                    </div>
                </form>
            </div>
            
            <div class="mt-3">
                <div class="card mb-4" v-for="post in posts" :key="post">
                    <h5 class="card-header">{{ post.Payload.title }}</h5>
                    <div class="card-body">
                        <p class="card-text">{{ post.Payload.content }}</p>
                        <div class="text-right">
                            <i class="fas fa-edit btn btn-danger pe-auto" @click="showEdit(post.id, post.Payload.title, post.Payload.content)"></i>
                            <i class="fas fa-trash-alt btn btn-primary m-2 pe-auto" @click="deleteItem(post.id)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<script>
import axios from 'axios'

export default {
    data() {
        return {
            posts: [],
            isCreatePost: false,
            postId: null,
            isEdit:false,
            editedTitle:"",
            editedContent:""
        }
    },
    methods: {
        async getAllPost() {
            const response = await axios.get("http://localhost:4000/post")
            this.posts = response.data.Data
            return this.posts
        },
        postCreate() {
            this.isCreatePost = true
        },
        async createPost() {
            await axios.post("http://localhost:4000/post", { title: this.title, content: this.content }).then(() => {
                this.isCreatePost = false
                this.title = ""
                this.content = ""
            })
            this.getAllPost();
        },
        async deleteItem(id) {
            console.log(id)
            await axios.delete("http://localhost:4000/post/" + id)
            this.getAllPost();
        },
        async edit(postId) {
            console.log(postId)
            await axios.put("http://localhost:4000/post/"+postId, {title:this.editedTitle, content:this.editedContent}).then(res=>{
                console.log(res.data)
                this.isEdit = false
            })
            this.getAllPost()
        },
        showEdit(id,title, content){
            this.isEdit = true
            this.editedTitle = title
            this.editedContent = content
            this.postId=id
        },
        onCancel() {
            this.isCreatePost = false
            this.isEdit = false
        }
    },
    mounted() {
        this.getAllPost();
    }
}
</script>