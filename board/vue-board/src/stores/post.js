import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export const usePostStore = defineStore('post', () => {
  const posts = ref([]); // state

  // getter;
  const getPostById = () => {
    const id = parseInt(useRoute().params.id);
    return posts.value.find((post) => post.id === id);
  };

  //action
  const addPost = async (newPost) => {
    const result = await axios.post('http://localhost:3000/board', { param: newPost });
    posts.value.push({ ...newPost, id: result.data.insertId });
  };

  const deletePost = async (id) => {
    await axios.delete(`http://localhost:3000/board/${id}`);
    posts.value = posts.value.filter((post) => post.id !== id);
  };

  const fetchPosts = async () => {
    const response = await axios.get(`http://localhost:3000/boards`);
    posts.value = response.data;
  };

  const updatePost = async (data) => {
    console.log('Update result:', data);
    await axios.put(`http://localhost:3000/board`, { param: data });
  };

  return { posts, getPostById, addPost, deletePost, fetchPosts, updatePost };
});
