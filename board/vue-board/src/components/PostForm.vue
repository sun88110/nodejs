<template>
  <div class="container">
    <div class="auth-status">
      <span v-if="authStore.isLoggedIn" class="logged-in-message">
        👋 **{{ authStore.username }}**님, 환영합니다! ({{ authStore.userRole }})
      </span>
      <span v-else class="logged-out-message"> 로그인이 필요합니다. </span>
      <button v-if="authStore.isLoggedIn" @click="authStore.logout" class="logout-btn">
        로그아웃
      </button>
    </div>

    <h3 class="login-heading">로그인</h3>
    <form @submit.prevent="loginHandler" class="login-form">
      <div>
        <label for="login-id"> 아이디 : </label>
        <input type="text" id="login-id" v-model="loginId" required />
      </div>
      <div>
        <label for="login-pw"> 비밀번호 : </label>
        <input type="password" id="login-pw" v-model="loginPw" required />
      </div>
      <button type="submit" :disabled="authStore.isLoggedIn">로그인</button>
    </form>

    <h3>글작성</h3>
    <form v-on:submit.prevent="addPostHandler">
      <div>
        <label for="title"> 제목 : </label>
        <input type="text" id="title" name="title" v-model="title" required />
      </div>
      <div>
        <label for="content"> 내용 : </label>
        <textarea id="content" name="content" v-model="content" required />
      </div>
      <div>
        <label for="writer"> 작성자 : </label>
        <input
          id="writer"
          name="writer"
          v-model="writer"
          :disabled="authStore.isLoggedIn"
          required
        />
      </div>
      <button type="submit">작성</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// pinia store 에서 addpost 함수 주입
import { usePostStore } from '@/stores/post';
import { useAuthStore } from '@/stores/auth'; // 💡 Auth Store 추가
const postStore = usePostStore();
const authStore = useAuthStore(); // 💡 Auth Store 사용
const { addPost } = postStore;

// 폼 데이터 상태 관리 (로그인 폼)
const loginId = ref('test'); // 테스트 편의를 위해 초기값 설정
const loginPw = ref('1234'); // 테스트 편의를 위해 초기값 설정

// 폼 데이터 상태 관리 (글작성 폼)
const title = ref('');
const content = ref('');
const writer = ref(authStore.username); // 💡 초기 작성자: 로그인 사용자 이름

// 💡 로그인 상태 변경 시 작성자 필드 자동 업데이트
watch(
  () => authStore.username,
  (newUsername) => {
    writer.value = newUsername;
  },
  { immediate: true },
);

// 폼 제출 핸들러 (로그인 폼)
const loginHandler = async () => {
  if (authStore.isLoggedIn) return; // 이미 로그인 상태면 무시

  if (!loginId.value || !loginPw.value) {
    alert('아이디와 비밀번호를 입력해주세요.');
    return;
  }

  const success = await authStore.login({
    id: loginId.value,
    pw: loginPw.value,
  });

  if (success) {
    alert(`${authStore.username}님, 환영합니다! 로그인에 성공했습니다.`);
    // 폼 초기화
    loginId.value = '';
    loginPw.value = '';
  } else {
    alert('로그인 정보가 올바르지 않습니다.');
  }
};

// 폼 제출 핸들러 (글작성 폼 - 기존 로직 유지)
const addPostHandler = () => {
  // 💡 글작성은 로그인 없이도 가능하도록 유지 (필요에 따라 로그인 필수 로직 추가 가능)

  if (!title.value || !content.value || !writer.value) {
    alert('모든 필드를 작성해주세요.');
    return;
  }
  const newPost = {
    title: title.value,
    content: content.value,
    // 💡 작성자 ID를 저장하여 권한 체크에 활용할 수 있도록 개선 가능
    writer: writer.value,
    writerId: authStore.userId, // 로그인된 경우 ID 저장
  };

  // 실제로 글을 작성할 권한이 있는지 체크 (선택 사항)
  // if (!authStore.isLoggedIn) {
  //     alert('로그인 후 글 작성이 가능합니다.');
  //     return;
  // }

  addPost(newPost);

  //폼 초기화
  title.value = '';
  content.value = '';
  // 작성자 필드는 watch를 통해 로그인 상태에 따라 자동 설정되도록 유지
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 추가 */
.container {
  max-width: 600px;
  margin: 40px auto;
  padding: 0 10px; /* 좌우 여백 */
}

/* 💡 인증 상태 표시 영역 */
.auth-status {
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
}

.logged-in-message {
  color: #28a745; /* 녹색 */
  font-weight: bold;
}

.logged-out-message {
  color: #dc3545; /* 빨간색 */
}

.logout-btn {
  padding: 8px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #5a6268;
}

/* 전체 폼 컨테이너 스타일 */
form {
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 은은한 그림자 */
  background-color: #f9f9f9; /* 배경색 */
  font-family: 'Arial', sans-serif;
  margin-bottom: 40px; /* 폼 간 간격 추가 */
}

/* 로그인 폼 전용 스타일 */
.login-form {
  padding: 20px;
  border: 1px solid #007bff;
  background-color: #eaf5ff;
}

/* 제목 (h3) 스타일 */
h3 {
  text-align: center;
  color: #333;
  margin-bottom: 25px;
  border-bottom: 2px solid #007bff; /* 강조선 */
  padding-bottom: 10px;
  font-size: 1.8em;
}

/* 로그인 제목 전용 스타일 */
.login-heading {
  border-bottom: 2px solid #5cb85c; /* 다른 강조선 색상 */
  margin-top: 0;
}

/* 각 입력 필드를 감싸는 div 스타일 */
form > div {
  display: flex;
  flex-direction: column; /* 세로 방향으로 요소 배치 */
  margin-bottom: 20px;
}

/* 레이블 스타일 */
label {
  font-weight: bold;
  color: #555;
  margin-bottom: 8px; /* 입력 필드와의 간격 */
  font-size: 1em;
}

/* input 및 textarea 스타일 */
input[type="text"],
input[type="password"], /* password input 추가 */
input:not([type="password"]), /* writer input 포함 (password 제외) */
textarea {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box; /* 패딩과 테두리가 너비에 포함되도록 설정 */
  width: 100%; /* 부모 div 너비에 꽉 차도록 */
  transition: border-color 0.3s;
}

/* disabled 상태 input 스타일 */
input:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

/* 포커스 시 스타일 변경 */
input:focus,
textarea:focus {
  border-color: #007bff; /* 포커스 시 파란색 테두리 */
  outline: none; /* 기본 아웃라인 제거 */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
}

/* textarea 전용 스타일 */
textarea {
  resize: vertical; /* 수직 크기만 조절 가능 */
  min-height: 150px; /* 최소 높이 설정 */
}

/* 버튼 스타일 */
button[type='submit'] {
  display: block; /* 블록 요소로 만들어 폼 너비에 맞게 정렬 */
  width: 100%;
  padding: 12px;
  background-color: #007bff; /* 버튼 배경색 */
  color: white; /* 글자색 */
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.1s;
  margin-top: 10px;
}

/* 버튼 호버 시 스타일 */
button[type='submit']:hover {
  background-color: #0056b3; /* 호버 시 진한 파란색 */
}

/* 버튼 클릭(active) 시 스타일 */
button[type='submit']:active {
  transform: translateY(1px); /* 약간 아래로 눌리는 효과 */
}

/* disabled 버튼 스타일 */
button[type='submit']:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>
