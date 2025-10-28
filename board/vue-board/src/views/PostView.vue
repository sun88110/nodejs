<template>
  <h3>상세화면</h3>
  <div>
    <h3>제목 : {{ post.title }}</h3>
    <p>내용 : {{ post.content }}</p>
    <p>
      <em>작성자 : {{ post.writer }}</em>
    </p>
    <p>작성일시 : {{ formattedDate(post.write_date) }}</p>

    <button v-if="canEditPost()" @click="modifyPostHandler">수정</button>
    <button v-if="canEditPost()" @click="deletePostHandler">삭제</button>
    <RouterLink to="/">목록으로</RouterLink>
  </div>

  <!-- 댓글 영역 -->
  <div class="replies-section">
    <h3>댓글</h3>
    <div class="reply-form">
      <textarea v-model="newReplyContent" placeholder="댓글을 작성하세요"></textarea>
      <button @click="addReplyHandler" :disabled="!authStore.isLoggedIn && !allowGuest">
        댓글 작성
      </button>
      <small v-if="!authStore.isLoggedIn && !allowGuest"> 로그인 후 작성 가능합니다. </small>
    </div>

    <ul class="reply-list">
      <li v-for="reply in replies" :key="reply.reply_id">
        <strong>{{ reply.writer }}:</strong> {{ reply.content }}
        <button v-if="canDeleteReply(reply)" @click="deleteReplyHandler(reply.reply_id)">
          삭제
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { usePostStore } from '@/stores/post';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore();

const postId = route.params.id;
const newReplyContent = ref('');
const replies = ref([]);
const allowGuest = true; // 비회원 댓글 허용 여부

// 게시글 정보
const post = computed(() => postStore.getPostById(postId));

// 작성일시 포맷팅
const formattedDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleString() : '');

// 게시글 + 댓글 불러오기
onBeforeMount(async () => {
  await postStore.fetchPosts();
  await fetchReplies();
});

// 댓글 불러오기
const fetchReplies = async () => {
  await postStore.fetchReplies(postId);
  replies.value = postStore.replies;
};

// 댓글 작성
const addReplyHandler = async () => {
  if (!newReplyContent.value.trim()) return;

  const replyData = {
    content: newReplyContent.value,
    writer: authStore.username, // ADMIN / USER / GUEST
    writerId: authStore.userId, // null이면 비회원
    post_id: postId,
  };

  try {
    await postStore.addReply(postId, replyData);
    newReplyContent.value = '';
    await fetchReplies();
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    alert('댓글 작성 실패');
  }
};

// 댓글 삭제 권한
const canDeleteReply = (reply) => {
  // 로그인 상태여야 하고, 관리자거나 본인 댓글일 때만 삭제 가능
  if (!authStore.isLoggedIn) return false;
  return authStore.userRole === 'ADMIN' || String(authStore.userId) === String(reply.writerId);
};

// 댓글 삭제
const deleteReplyHandler = async (replyId) => {
  try {
    await postStore.deleteReply(replyId);
    await fetchReplies();
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    alert('댓글 삭제 실패');
  }
};

// 게시글 삭제
const deletePostHandler = async () => {
  await postStore.deletePost(postId);
  router.push({ name: 'HomeView' });
};

// 게시글 수정 페이지 이동
const modifyPostHandler = () => {
  router.push(`/modify/${postId}`);
};

// 게시글 수정 권한
const canEditPost = () => authStore.hasPermission(post.value?.writerId);
</script>

<style scoped>
.reply-form textarea {
  width: 100%;
  margin-bottom: 5px;
}
.reply-list {
  list-style: none;
  padding: 0;
}
.reply-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>
