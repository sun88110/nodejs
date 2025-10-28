<template>
  <div class="edit-container">
    <h3 class="edit-heading">게시글 수정</h3>
    <div v-if="post">
      <!-- 게시글 수정 폼 -->
      <label for="title-input">변경할 제목 : </label>
      <input id="title-input" type="text" v-model="post.title" class="input-field" /><br />

      <label for="content-textarea">변경할 내용 : </label> <br />
      <textarea
        id="content-textarea"
        v-model="post.content"
        rows="10"
        class="input-field"
      ></textarea>
      <br />

      <!-- 수정 저장 버튼: 모달을 띄웁니다. -->
      <button v-on:click="showConfirmModal = true" class="btn-primary">수정 저장</button> <br />

      <RouterLink :to="`/post/${postId}`" class="btn-link cancel-link">수정 취소</RouterLink>

      <RouterLink to="/" class="btn-link back-link">목록으로</RouterLink>
    </div>
    <div v-else>
      <p>게시글 정보를 불러오는 중이거나 접근 권한을 확인 중입니다...</p>
    </div>
  </div>

  <!-- 💡 수정 확인 커스텀 모달 (금지된 confirm() 함수 대체) -->
  <div v-if="showConfirmModal" class="custom-modal-backdrop">
    <div class="custom-modal">
      <p>게시글을 수정하시겠습니까?</p>
      <div class="modal-actions">
        <button @click="updatePostHandler" class="btn-confirm">수정</button>
        <button @click="showConfirmModal = false" class="btn-cancel">취소</button>
      </div>
    </div>
  </div>

  <!-- 💡 알림 커스텀 모달 (금지된 alert() 함수 대체) -->
  <div v-if="showAlertModal" class="custom-modal-backdrop">
    <div class="custom-modal">
      <p>{{ alertMessage }}</p>
      <div class="modal-actions">
        <button @click="showAlertModal = false" class="btn-cancel">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { usePostStore } from '@/stores/post';
import { useAuthStore } from '@/stores/auth'; // 💡 권한 체크를 위해 Auth Store import

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const authStore = useAuthStore(); // 💡 Auth Store 인스턴스 사용

// 1. 상태 관리
const postId = route.params.id;
const post = ref(null);
const showConfirmModal = ref(false); // 수정 확인 커스텀 모달 상태
const showAlertModal = ref(false); // 알림 커스텀 모달 상태
const alertMessage = ref(''); // 알림 모달 메시지

const showMessage = (message, redirect = false) => {
  alertMessage.value = message;
  showAlertModal.value = true;
  if (redirect) {
    // 알림 확인 버튼 클릭 시 리다이렉트되도록 추가 로직 필요
    // 간단하게 setTimeout 후 router.push를 사용하는 방식으로 구현
    setTimeout(() => {
      if (showAlertModal.value === false) {
        // 사용자가 이미 닫았을 경우
        router.push(`/post/${postId}`);
      }
    }, 100);
  }
};

// Pinia Getter: Retrieves the original post data.
const originalPost = computed(() => {
  // useRoute를 사용하여 현재 라우트의 ID를 참조하므로 인자는 필요 없습니다.
  return postStore.getPostById();
});

onMounted(async () => {
  // Pinia에 데이터가 없을 경우를 대비해 목록을 먼저 로드
  if (postStore.posts.length === 0) {
    await postStore.fetchPosts();
  }

  const fetchedPost = originalPost.value;

  if (fetchedPost) {
    // 💡 1. 권한 체크: hasPermission을 사용하여 본인인지 ADMIN인지 확인
    // fetchedPost에는 서버에서 가져온 writerId가 포함되어야 합니다.
    if (!authStore.hasPermission(fetchedPost.writerId)) {
      showMessage('게시글 수정 권한이 없습니다. 본인 작성 글 또는 관리자만 수정 가능합니다.', true);
      router.push(`/post/${postId}`); // 상세 페이지로 리다이렉트
      return;
    } // 권한이 있는 경우에만 수정 가능한 상태로 복사
    // 원본 Pinia State를 직접 수정하지 않기 위해 깊은 복사 사용

    post.value = JSON.parse(JSON.stringify(fetchedPost));
  } else {
    console.error('수정할 게시글을 찾을 수 없습니다.');
    router.push('/'); // 찾지 못하면 목록으로 이동
  }
});

// 3. 수정 버튼 클릭 핸들러 (모달의 '수정' 버튼 클릭 시 실행)
const updatePostHandler = async () => {
  // 모달 닫기
  showConfirmModal.value = false;

  if (!post.value || !post.value.title || !post.value.content) {
    showMessage('제목과 내용을 입력해주세요.');
    return;
  }

  try {
    const obj = {
      id: parseInt(postId),
      title: post.value.title,
      content: post.value.content,
      writer: post.value.writer, // 기존 작성자 이름 유지
    }; // Pinia Store Action 호출 (여기서 서버에 권한 체크와 수정 요청을 위임)

    await postStore.updatePost(obj);

    showMessage('게시글이 성공적으로 수정되었습니다.'); // 수정 후 목록 페이지로 이동
    // 💡 알림 모달이 닫힌 후 리다이렉션되도록 처리 (간단화)
    setTimeout(() => {
      router.push(`/`);
    }, 500);
  } catch (error) {
    console.error('게시글 수정 실패:', error);

    let errorMessage = '게시글 수정에 실패했습니다. 서버 상태를 확인하세요.';
    if (error.message && error.message.startsWith('AUTH_ERROR')) {
      errorMessage = '게시글 수정 권한이 없습니다. 로그인 상태를 확인해주세요.';
    }

    showMessage(errorMessage);
  }
};
</script>
