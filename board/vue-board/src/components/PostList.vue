<template>
  <div class="post-list"></div>
  <h3>게시글 목록</h3>
  <ul>
    <li v-for="post in posts" :key="post.id">
      <h4>
        <RouterLink v-bind:to="{ name: 'PostView', params: { id: post.id } }">{{
          post.title
        }}</RouterLink>
      </h4>
      <p>{{ post.content }}</p>
      <p>
        <em>작성자 : {{ post.writer }}</em>
      </p>
    </li>
  </ul>
</template>

<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';
defineProps({
  posts: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
/* ================================== */
/* 1. 기본 설정 및 제목 (h3) 스타일 */
/* ================================== */

/* 목록 제목 (h3) 스타일 */
h3 {
  text-align: center;
  color: #2980b9; /* 진한 파란색 */
  margin: 30px auto 20px auto;
  padding-bottom: 10px;
  border-bottom: 3px solid #3498db; /* 강조선 */
  max-width: 700px;
  font-size: 1.8em;
  font-weight: 700;
  font-family: 'Malgun Gothic', 'Segoe UI', sans-serif;
}

/* ================================== */
/* 2. 전체 목록 컨테이너 (ul) 스타일 */
/* ================================== */
ul {
  list-style: none; /* 목록 기본 점 제거 */
  padding: 0;
  max-width: 700px; /* 최대 너비 설정 */
  margin: 0 auto 50px auto; /* 중앙 정렬 */
  font-family: 'Malgun Gothic', 'Segoe UI', sans-serif;
}

/* ================================== */
/* 3. 개별 게시글 항목 (li) 스타일 */
/* ================================== */
li {
  background-color: #ffffff;
  border: 1px solid #eef1f5; /* 아주 연한 테두리 */
  border-left: 5px solid #bdc3c7; /* 왼쪽에 강조색 구분선 */
  border-radius: 6px;
  padding: 15px 20px;
  margin-bottom: 15px; /* 항목 간 간격 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05); /* 부드러운 그림자 */
  cursor: pointer;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out,
    border-left-color 0.2s;
}

/* 호버 효과 (마우스를 올렸을 때) */
li:hover {
  transform: translateY(-4px); /* 약간 위로 떠오르는 효과 */
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
  border-left-color: #3498db; /* 호버 시 파란색으로 강조 */
}

/* ================================== */
/* 4. 항목 내부 요소 스타일 */
/* ================================== */

/* 게시글 제목 (h4) 스타일 */
li h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 1.3em;
  font-weight: 600;
}

/* 게시글 내용 (p) 스타일 (첫 번째 p 태그 - post.content) */
li p:first-of-type {
  color: #555;
  line-height: 1.5;
  margin-bottom: 10px;
  font-size: 1em;
  /* 내용이 길 경우 말줄임표 처리 (선택 사항) */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 작성자 정보 (p) 스타일 (두 번째 p 태그) */
li p:last-of-type {
  text-align: right;
  font-size: 0.9em;
  color: #95a5a6;
  margin: 0;
  padding-top: 10px;
  border-top: 1px dashed #ecf0f1; /* 구분선 추가 */
}

/* 작성자 이름 (em 태그) */
li p:last-of-type em {
  font-style: normal;
  font-weight: 500;
  color: #2980b9;
}
</style>
