import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useAuthStore } from './auth';

export const usePostStore = defineStore('post', () => {
  const posts = ref([]);
  const replies = ref([]);

  // ------------------- 게시글 getter -------------------
  const getPostById = () => {
    const id = Number(useRoute().params.id);
    return posts.value.find((post) => Number(post.id) === id);
  };

  // ------------------- 게시글 액션 -------------------
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/boards');
      posts.value = response.data;
    } catch (error) {
      console.error('게시글 목록 로딩 실패:', error);
      throw new Error('SERVER_ERROR: 게시글 목록을 불러올 수 없습니다.');
    }
  };

  const addPost = async (newPost) => {
    try {
      const result = await axios.post('http://localhost:3000/board', { param: newPost });
      posts.value.push({ ...newPost, id: result.data.insertId });
    } catch (error) {
      console.error('게시글 추가 실패:', error);
      throw new Error('SERVER_ERROR: 게시글 추가 실패');
    }
  };

  const updatePost = async (data) => {
    const authStore = useAuthStore();

    const postToUpdate = posts.value.find((p) => Number(p.id) === Number(data.id));
    if (!postToUpdate) throw new Error('DATA_ERROR: 수정할 게시글을 찾을 수 없습니다.');

    // GUEST는 수정 불가
    if (authStore.userRole === 'GUEST') {
      throw new Error('AUTH_ERROR: 비회원은 글을 수정할 수 없습니다.');
    }

    // 권한 체크
    const writerId = postToUpdate.writerId ?? postToUpdate.writer; // writerId 컬럼이 없으면 writer 사용
    if (!authStore.hasPermission(writerId)) {
      throw new Error('AUTH_ERROR: 수정 권한이 없습니다.');
    }

    try {
      await axios.put('http://localhost:3000/board', { param: data });

      // posts 배열 업데이트
      const index = posts.value.findIndex((p) => Number(p.id) === Number(data.id));
      if (index !== -1) {
        posts.value[index] = { ...posts.value[index], ...data };
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      throw new Error('SERVER_ERROR: 게시글 수정 실패');
    }
  };

  const deletePost = async (id, password = null) => {
    const authStore = useAuthStore();
    const postId = Number(id);
    if (isNaN(postId) || postId <= 0) throw new Error('DATA_ERROR: 게시글 ID가 유효하지 않습니다.');

    let postToDelete = posts.value.find((p) => Number(p.id) === postId);
    if (!postToDelete) {
      await fetchPosts();
      postToDelete = posts.value.find((p) => Number(p.id) === postId);
    }
    if (!postToDelete) throw new Error('DATA_ERROR: 삭제할 게시글을 찾을 수 없습니다.');

    const isGuest = authStore.userRole === 'GUEST';
    if (!isGuest && !authStore.hasPermission(postToDelete.writerId ?? postToDelete.writer)) {
      throw new Error('AUTH_ERROR: 삭제 권한이 없습니다.');
    }

    const deleteConfig = {};
    if (isGuest && password) deleteConfig.data = { password };

    try {
      await axios.delete(`http://localhost:3000/board/${postId}`, deleteConfig);
      posts.value = posts.value.filter((p) => Number(p.id) !== postId);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      throw new Error('SERVER_ERROR: 게시글 삭제 실패');
    }
  };

  // ------------------- 댓글 액션 -------------------
  const fetchReplies = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3000/replies/${postId}`);
      replies.value = response.data;
    } catch (error) {
      console.error('댓글 불러오기 실패:', error);
      throw new Error('SERVER_ERROR: 댓글을 불러올 수 없습니다.');
    }
  };

  const addReply = async (postId, newReply) => {
    try {
      const payload = { ...newReply, post_id: postId };
      const result = await axios.post('http://localhost:3000/reply', { param: payload });
      replies.value.push({ ...payload, reply_id: result.data.insertId });
    } catch (error) {
      console.error('댓글 추가 실패:', error);
      throw new Error('SERVER_ERROR: 댓글을 추가할 수 없습니다.');
    }
  };

  const updateReply = async (replyId, content) => {
    try {
      await axios.put('http://localhost:3000/reply', { param: { reply_id: replyId, content } });
      const index = replies.value.findIndex((r) => r.reply_id === replyId);
      if (index !== -1) replies.value[index].content = content;
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      throw new Error('SERVER_ERROR: 댓글을 수정할 수 없습니다.');
    }
  };

  const deleteReply = async (replyId) => {
    try {
      await axios.delete(`http://localhost:3000/reply/${replyId}`);
      replies.value = replies.value.filter((r) => r.reply_id !== replyId);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      throw new Error('SERVER_ERROR: 댓글을 삭제할 수 없습니다.');
    }
  };

  // ------------------- 반환 -------------------
  return {
    posts,
    getPostById,
    fetchPosts,
    addPost,
    updatePost,
    deletePost,
    replies,
    fetchReplies,
    addReply,
    updateReply,
    deleteReply,
  };
});
