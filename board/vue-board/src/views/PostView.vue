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
/* 전체 댓글 섹션 카드 느낌 */
.replies-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

/* 댓글 작성 영역 */
.reply-form {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.reply-form textarea {
  width: 100%;
  min-height: 70px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  resize: vertical;
  font-size: 14px;
  transition: border-color 0.2s;
}

.reply-form textarea:focus {
  outline: none;
  border-color: #3b82f6; /* 파란색 포커스 */
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
}

/* 댓글 작성 버튼 */
.reply-form button {
  margin-top: 8px;
  align-self: flex-end;
  padding: 6px 16px;
  background-color: #3b82f6;
  color: #fff;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reply-form button:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.reply-form button:hover:not(:disabled) {
  background-color: #2563eb;
}

/* 댓글 리스트 */
.reply-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reply-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.1s;
}

.reply-list li:hover {
  transform: translateY(-2px);
}

/* 댓글 작성자 강조 */
.reply-list strong {
  color: #1f2937;
}

/* 댓글 삭제 버튼 */
.reply-list button {
  padding: 4px 10px;
  background-color: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.reply-list button:hover {
  background-color: #b91c1c;
}

/* 게시글 영역 */
div > h3 {
  margin-bottom: 8px;
  color: #111827;
}

div > p {
  margin-bottom: 6px;
  color: #374151;
}

div > button {
  margin-right: 10px;
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background-color: #3b82f6;
  color: #fff;
  transition: background-color 0.2s;
}

div > button:hover {
  background-color: #2563eb;
}

RouterLink {
  display: inline-block;
  margin-top: 10px;
  color: #3b82f6;
  font-weight: 500;
}
</style>
