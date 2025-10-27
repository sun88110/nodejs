<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';

import PostForm from '@/components/PostForm.vue';
import PostList from '@/components/PostList.vue';

const postStore = usePostStore();
// State, Getter 사용.
const { posts } = storeToRefs(postStore);
const { fetchPosts } = postStore;

onMounted(async () => {
  // 게시글 목록을 가져오는 액션 호출
  await fetchPosts();
});
</script>

<template>
  <div>
    <h3>게시판</h3>
    <PostForm />
    <PostList v-bind:posts="posts" />
  </div>
</template>
