import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
// 💡 useAuthStore를 import하여 글 수정/삭제 시 권한 체크에 사용합니다.
import { useAuthStore } from './auth';

export const usePostStore = defineStore('post', () => {
  const posts = ref([]); // state
  // getter;
  const getPostById = () => {
    const id = parseInt(useRoute().params.id);
    return posts.value.find((post) => post.id === id);
  }; //action

  const addPost = async (newPost) => {
    const result = await axios.post('http://localhost:3000/board', { param: newPost }); // DB 응답에 ID가 제대로 포함되어 있다고 가정합니다.
    posts.value.push({ ...newPost, id: result.data.insertId });
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/boards`); // 서버에서 가져온 데이터가 writerId 필드를 포함하고 있어야 권한 체크가 정상 작동합니다.
      posts.value = response.data;
    } catch (error) {
      console.error('게시글 목록 로딩에 실패했습니다:', error);
      // 목록 로딩 실패 시 상위 컴포넌트/액션으로 에러를 던져 처리를 위임
      throw new Error('SERVER_ERROR: 게시글 목록을 불러올 수 없습니다.');
    }
  }; // deletePost 액션에 'password' 인수를 추가하고 기본값을 null로 설정합니다.

  const deletePost = async (id, password = null) => {
    const authStore = useAuthStore();

    // 💡 ID 유효성 검사 추가 (id가 숫자가 아니거나 0이면 바로 DATA_ERROR 발생)
    const postId = parseInt(id);
    if (isNaN(postId) || postId <= 0) {
      throw new Error('DATA_ERROR: 삭제하려는 게시글 ID가 유효하지 않습니다.');
    } // 1. 로컬 Pinia State에서 게시글 찾기
    let postToDelete = posts.value.find((post) => post.id === postId);

    // 💡 강화된 로직: postToDelete가 없다면 상태가 오래되었을 수 있으므로 전체 목록을 다시 가져와서 재확인합니다.
    if (!postToDelete) {
      await fetchPosts();
      postToDelete = posts.value.find((post) => post.id === postId);
    }

    // 2. 게시글 정보가 끝까지 없다면 에러를 발생시켜 API 호출을 막습니다. (DATA_ERROR)
    if (!postToDelete) {
      throw new Error('DATA_ERROR: 삭제하려는 게시글 정보를 Pinia Store에서 찾을 수 없습니다.');
    }

    // 3. 권한 로직 분리: GUEST인 경우와 회원(USER/ADMIN)인 경우를 구분
    const isGuest = authStore.userRole === 'GUEST';

    if (!isGuest) {
      // --- 일반 회원/관리자 권한 체크 ---

      // 4. 회원(USER/ADMIN)은 ID 기반 권한 체크를 수행합니다.
      if (!authStore.hasPermission(postToDelete.writerId)) {
        // 에러를 throw하여 컴포넌트에서 커스텀 모달로 처리하도록 유도합니다. (AUTH_ERROR)
        throw new Error('AUTH_ERROR: 해당 글을 삭제할 권한이 없습니다.');
      }
    } else {
      // --- GUEST 권한 체크 (비밀번호 요구) ---
      // GUEST는 자신의 글이더라도 삭제 비밀번호가 없으면 진행을 막습니다.
      if (!password) {
        // 이 에러를 통해 컴포넌트는 비밀번호 입력 모달을 띄워야 함을 인지합니다.
        throw new Error('PASSWORD_REQUIRED: 게스트는 삭제 시 비밀번호가 필요합니다.');
      }
    }

    // 5. 서버에 삭제 요청 (GUEST인 경우 비밀번호를 데이터로 포함)
    const deleteConfig = {};
    if (isGuest && password) {
      // DELETE 요청의 Body에 데이터를 포함하기 위해 config를 사용합니다.
      // 서버의 DELETE 요청 처리가 Body를 지원해야 합니다.
      deleteConfig.data = { password };
    }

    await axios.delete(`http://localhost:3000/board/${postId}`, deleteConfig);
    posts.value = posts.value.filter((post) => post.id !== postId);
  };

  const updatePost = async (data) => {
    //💡 권한 체크: hasPermission 함수를 사용하여 비회원/일반유저/관리자 권한 분리 로직 적용
    const authStore = useAuthStore();
    const postToUpdate = posts.value.find((post) => post.id === data.id);

    // --- 디버깅 로그 ---
    console.log('--- UPDATE 권한 체크 시작 ---');
    console.log(`현재 사용자 역할: ${authStore.userRole}`);
    console.log(`현재 사용자 ID: ${authStore.userId}`);
    console.log(`수정하려는 글 작성자 ID: ${postToUpdate ? postToUpdate.writerId : '글 없음'}`);
    console.log(
      `hasPermission 결과: ${postToUpdate ? authStore.hasPermission(postToUpdate.writerId) : 'N/A'}`,
    );
    console.log('---------------------------'); // GUEST는 수정 권한이 없으므로 무조건 막습니다.
    // -----------------------

    if (authStore.userRole === 'GUEST') {
      throw new Error('AUTH_ERROR: 비회원은 글을 수정할 수 없습니다.');
    } // 게시글이 존재하고, 현재 사용자에게 수정 권한이 없다면 (회원 전용 체크)

    if (postToUpdate && !authStore.hasPermission(postToUpdate.writerId)) {
      // 에러를 throw하여 컴포넌트에서 커스텀 모달로 처리하도록 유도합니다.
      throw new Error('AUTH_ERROR: 해당 글을 수정할 권한이 없습니다.');
    }

    console.log('Update result:', data);
    await axios.put(`http://localhost:3000/board`, { param: data }); // Pinia state 업데이트

    const index = posts.value.findIndex((p) => p.id === data.id);
    if (index !== -1) {
      posts.value[index].title = data.title;
      posts.value[index].content = data.content;
    }
  };

  return { posts, getPostById, addPost, deletePost, fetchPosts, updatePost };
});
