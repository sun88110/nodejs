<template>
  <h3>게시글 수정</h3>
  <div v-if="post">
    <label for="title-input">변경할 제목 : </label>
    <input id="title-input" type="text" v-model="post.title" class="input-field" /><br />

    <label for="content-textarea">변경할 내용 : </label> <br />
    <textarea id="content-textarea" v-model="post.content" rows="10" class="input-field"></textarea>
    <br />

    <button v-on:click="updatePostHandler" class="btn-primary">수정 저장</button> <br />

    <RouterLink :to="`/post/${postId}`" class="btn-link">수정 취소</RouterLink>

    <RouterLink to="/" class="btn-link">목록으로</RouterLink>
  </div>
  <div v-else>
    <p>게시글 정보를 불러오는 중입니다...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { usePostStore } from '@/stores/post';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();

// 1. 라우트 ID와 원본 게시글 데이터 가져오기
const postId = route.params.id;

// Pinia Getter를 통해 원본 게시글을 가져오는 Computed 속성 (읽기 전용)
const originalPost = computed(() => {
  return postStore.getPostById(postId);
});

// 2. 수정 가능한 폼 상태 (Ref)
const post = ref(null);

onMounted(async () => {
  // Pinia에 데이터가 없을 경우를 대비해 목록을 먼저 로드
  if (postStore.posts.length === 0) {
    await postStore.fetchPosts();
  }

  const fetchedPost = originalPost.value;

  if (fetchedPost) {
    // 💡 중요: 원본 Pinia state를 직접 수정하지 않도록 데이터를 깊은 복사하여 사용
    post.value = JSON.parse(JSON.stringify(fetchedPost));
  } else {
    console.error('수정할 게시글을 찾을 수 없습니다.');
    router.push({ name: 'HomeView' }); // 찾지 못하면 목록으로 이동
  }
});

// 3. 수정 버튼 클릭 핸들러
const updatePostHandler = async () => {
  if (!post.value || !post.value.title || !post.value.content) {
    alert('제목과 내용을 입력해주세요.');
    return;
  }

  if (!confirm('게시글을 수정하시겠습니까?')) {
    return;
  }

  try {
    const obj = {
      id: postId,
      title: post.value.title,
      content: post.value.content,
      writer: post.value.writer, // ✅ 작성자 추가
    };
    // Pinia Store Action 호출: 서버 통신 및 State 업데이트를 Store에 위임
    await postStore.updatePost(obj);

    alert('게시글이 성공적으로 수정되었습니다.');
    // 수정 후 상세 페이지로 이동
    router.push(`/`);
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    alert('게시글 수정에 실패했습니다. 서버 상태를 확인하세요.');
  }
};
</script>
