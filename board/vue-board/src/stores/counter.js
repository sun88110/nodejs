import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// use + counter + store => useCounterStore 선언.
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0); // state
  const doubleCount = computed(() => count.value * 2); // getter 계산속성
  function increment() {
    // action : 상태값 변경
    count.value++;
  }

  return { count, doubleCount, increment };
});
