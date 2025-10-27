<template>
  <h3>글작성</h3>
  <form v-on:submit.prevent="addPostHandler">
    <!-- prevent가 없으면 페이지 이동임-->
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
      <input id="writer" name="writer" v-model="writer" required />
    </div>
    <button type="submit">작성</button>
  </form>
</template>

<script setup>
import { ref, inject } from 'vue';
// inject 함수로 addPost 함수 주입
const addPost = inject('addPost');
// 폼 데이터 상태 관리
const title = ref('');
const content = ref('');
const writer = ref('');

// 폼 제출 핸들러
const addPostHandler = () => {
  if (!title.value || !content.value || !writer.value) {
    alert('모든 필드를 작성해주세요.');
    return;
  }
  const newPost = {
    title: title.value,
    content: content.value,
    writer: writer.value,
  };
  addPost(newPost);
  //폼 초기화
  title.value = '';
  content.value = '';
  writer.value = '';
};
</script>

<style scoped>
/* 전체 폼 컨테이너 스타일 */
form {
  max-width: 600px; /* 폼의 최대 너비 설정 */
  margin: 40px auto; /* 중앙 정렬 및 상하 여백 */
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 은은한 그림자 */
  background-color: #f9f9f9; /* 배경색 */
  font-family: 'Arial', sans-serif;
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
input, /* writer input 포함 */
textarea {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box; /* 패딩과 테두리가 너비에 포함되도록 설정 */
  width: 100%; /* 부모 div 너비에 꽉 차도록 */
  transition: border-color 0.3s;
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

/* 작성 버튼 스타일 */
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
</style>
