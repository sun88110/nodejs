<template>
  <h3>상세화면</h3>
  <div>
    <h3>제목 : {{ post.title }}</h3>
    <p>내용 : {{ post.content }}</p>
    <p>
      <em>작성자 : {{ post.writer }}</em>
    </p>
    <p>작성일시 : {{ post.write_date }}</p>
    <button v-on:click="modifyPostHandler">수정</button><br />
    <button v-on:click="deletePostHandler">삭제</button><br />
    <RouterLink to="/">목록으로</RouterLink>
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { usePostStore } from '@/stores/post';

const route = useRoute(); //라우트 정보 접근
const router = useRouter(); //라우트 인스턴스 접근

const postStore = usePostStore();

// state, getter 사용.
const post = computed(() => {
  return postStore.getPostById(route.params.id);
});

// 게시글 데이터 상태 관리
onBeforeMount(async () => {
  await postStore.fetchPosts(); // 게시글 목록을 미리 가져옴
});

// const writeDate = computed(() => {
//   if (post.value.write_date) {
//     return new Date(post.value.write_date).toLocaleDateString();
//   }
//   return '';
// });
// onMounted(async () => {
//   const result = await axios.get(`http://localhost:3000/board/${route.params.id}`);
//   console.log('Post Data:', result.data);
//   post.value = result.data[0];
// });

// 삭제 핸들러
const deletePostHandler = async () => {
  const postId = route.params.id;
  await postStore.deletePost(postId);
  //목록이동
  router.push({ name: 'HomeView' });
};

const modifyPostHandler = () => {
  const postId = route.params.id;
  router.push(`/modify/${postId}`);
};
</script>
