import { d as defineStore, b as useLocalStorage, l as mockUser, n as navigateTo } from './server.mjs';
import { computed } from 'vue';

const useAuthStore = defineStore("auth", () => {
  const user = useLocalStorage("otter.auth.user", null);
  const demoToken = useLocalStorage("otter.auth.demo-token", null);
  const isLoggedIn = computed(() => !!user.value && !!demoToken.value);
  function setSession(nextUser) {
    user.value = nextUser;
    demoToken.value = `demo_${Date.now()}`;
  }
  function login(email, _password) {
    setSession({ ...mockUser, email });
    navigateTo("/app");
  }
  function register(email, _password) {
    setSession({ ...mockUser, email, name: email.split("@")[0] });
    navigateTo("/app");
  }
  function loginWithGoogle() {
    setSession({ ...mockUser });
    navigateTo("/app");
  }
  function logout() {
    user.value = null;
    demoToken.value = null;
    navigateTo("/");
  }
  function updateAvatar(url) {
    if (user.value) user.value.avatar = url;
  }
  function updateName(name) {
    if (user.value) user.value.name = name;
  }
  function activatePremium() {
    if (user.value) user.value.isPremium = true;
  }
  return {
    user,
    demoToken,
    isLoggedIn,
    login,
    register,
    loginWithGoogle,
    logout,
    updateAvatar,
    updateName,
    activatePremium
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth-CYHEneUG.mjs.map
