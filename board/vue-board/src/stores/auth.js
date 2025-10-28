import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // State: 로그인한 사용자 정보 (ID, name, role 등)
  const user = ref(null);

  // Getters
  const isLoggedIn = computed(() => user.value !== null);
  const username = computed(() => (user.value ? user.value.name : '비회원'));
  const userId = computed(() => (user.value ? user.value.id : null));
  const userRole = computed(() => (user.value ? user.value.role : 'GUEST'));

  // Actions
  const login = (credentials) => {
    // Mock-up 로그인 처리 (실제는 서버 통신 필요)
    console.log('로그인 시도:', credentials.id); // 테스트용 계정: test/1234 (ADMIN), user/0000 (USER)

    if (credentials.id === 'test' && credentials.pw === '1234') {
      user.value = {
        id: 'test',
        name: '테스트 관리자',
        role: 'ADMIN',
      };
      return true;
    } else if (credentials.id === 'user' && credentials.pw === '0000') {
      user.value = {
        id: 'user',
        name: '일반 사용자',
        role: 'USER',
      };
      return true;
    } else {
      user.value = null;
      return false;
    }
  };

  const logout = () => {
    user.value = null;
  };

  /**
   * 게시글 수정/삭제 권한을 체크합니다.
   * 1. 비회원은 불가
   * 2. 관리자(ADMIN)는 무조건 가능
   * 3. 일반 사용자(USER)는 본인 작성 글만 가능
   * @param {string | number} authorId - 게시글에 저장된 작성자의 ID
   * @returns {boolean} 권한 여부
   */
  const hasPermission = (authorId) => {
    // 1. 비로그인 상태는 권한 없음
    if (!isLoggedIn.value) {
      return false;
    }
    // 2. 관리자(ADMIN)는 모든 권한 허용
    if (userRole.value === 'ADMIN') {
      return true;
    }
    // 3. 일반 사용자는 본인 작성글인지 확인
    return String(userId.value) === String(authorId);
  };

  /**
   * 댓글 수정/삭제 권한을 체크합니다. (추가된 댓글 권한 로직)
   * 댓글 권한 로직은 게시글 권한 로직과 동일합니다.
   * @param {string | number} authorId - 댓글에 저장된 작성자의 ID
   * @returns {boolean} 권한 여부
   */
  const hasReplyPermission = (authorId) => {
    // 1. 비로그인 상태는 권한 없음
    if (!isLoggedIn.value) {
      return false;
    }
    // 2. 관리자(ADMIN)는 모든 권한 허용
    if (userRole.value === 'ADMIN') {
      return true;
    }
    // 3. 일반 사용자는 본인 작성 댓글인지 확인
    // 주의: tb1_reply 테이블의 writer 컬럼에 사용자 ID가 저장되어 있어야 합니다.
    return String(userId.value) === String(authorId);
  };

  return {
    user,
    isLoggedIn,
    username,
    userId,
    userRole,
    login,
    logout,
    hasPermission,
    hasReplyPermission, // 새롭게 추가된 댓글 권한 체크 함수
  };
});
