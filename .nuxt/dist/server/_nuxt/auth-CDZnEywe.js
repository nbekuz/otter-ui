import { d as defineStore, e as useLocalStorage, o as apiGet, p as apiPut, q as apiPost, t as setAuthTokens, n as navigateTo } from "../server.mjs";
import { ref, computed } from "vue";
const useAuthStore = defineStore("auth", () => {
  const user = useLocalStorage("otter.auth.user", null);
  const accessToken = useLocalStorage("access_token", null);
  const refreshToken = useLocalStorage("refresh_token", null);
  const profileFirstName = useLocalStorage("otter.auth.first-name", "");
  const profileLastName = useLocalStorage("otter.auth.last-name", "");
  const profileLoaded = ref(false);
  const isLoggedIn = computed(() => !!accessToken.value);
  const requiresProfileFill = computed(
    () => isLoggedIn.value && (!profileFirstName.value.trim() || !profileLastName.value.trim())
  );
  function mapBackendUser(nextUser) {
    const fullName = `${nextUser.first_name || ""} ${nextUser.last_name || ""}`.trim();
    return {
      id: String(nextUser.id),
      email: nextUser.email,
      name: fullName || nextUser.email.split("@")[0] || "User",
      avatar: nextUser.avatar || void 0,
      isPremium: user.value?.isPremium || false,
      premiumExpiresAt: user.value?.premiumExpiresAt
    };
  }
  function setSession(nextUser, tokens) {
    profileFirstName.value = nextUser.first_name || "";
    profileLastName.value = nextUser.last_name || "";
    profileLoaded.value = true;
    user.value = mapBackendUser(nextUser);
    accessToken.value = tokens.access;
    refreshToken.value = tokens.refresh;
  }
  async function fetchMyProfile() {
    const profile = await apiGet("profile/");
    profileFirstName.value = profile.first_name || "";
    profileLastName.value = profile.last_name || "";
    profileLoaded.value = true;
    user.value = mapBackendUser(profile);
    return profile;
  }
  async function updateProfile(first_name, last_name, avatar) {
    const formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    if (avatar) {
      formData.append("avatar", avatar);
    }
    const profile = await apiPut("profile/", formData);
    profileFirstName.value = profile.first_name || "";
    profileLastName.value = profile.last_name || "";
    profileLoaded.value = true;
    user.value = mapBackendUser(profile);
    return profile;
  }
  async function login(email, password) {
    const response = await apiPost("auth/login/", {
      email,
      password
    });
    accessToken.value = response.tokens.access;
    refreshToken.value = response.tokens.refresh;
    setAuthTokens(response.tokens);
    await fetchMyProfile();
    navigateTo("/app");
  }
  async function register(email, password, first_name = "", last_name = "", options = {}) {
    const { navigateOnSuccess = true } = options;
    const response = await apiPost("auth/register/", {
      email,
      password,
      first_name,
      last_name
    });
    setSession(response.user, response.tokens);
    if (navigateOnSuccess) {
      navigateTo("/app");
    }
    return response;
  }
  async function loginWithGoogle(payload) {
    if (!payload?.firebase_token) {
      console.warn("[otter:google] loginWithGoogle: firebase_token yo‘q, chiqildi");
      return;
    }
    console.log("[otter:google] loginWithGoogle: auth/google/ so‘rov yuborilmoqda…");
    const response = await apiPost("auth/google/", payload);
    console.log("[otter:google] loginWithGoogle: javob keldi", {
      userId: response?.user?.id,
      email: response?.user?.email,
      hasAccess: !!response?.tokens?.access,
      hasRefresh: !!response?.tokens?.refresh
    });
    setSession(response.user, response.tokens);
    await fetchMyProfile();
    console.log("[otter:google] navigateTo(/app)");
    navigateTo("/app");
  }
  async function forgotPassword(email) {
    return apiPost("auth/forgot-password/", { email });
  }
  async function forgotPasswordVerify(email, code) {
    return apiPost("auth/forgot-password/verify/", {
      email,
      code
    });
  }
  async function forgotPasswordConfirm(reset_token, new_password) {
    return apiPost("auth/forgot-password/confirm/", {
      reset_token,
      new_password
    });
  }
  async function changePassword(newPassword) {
    return apiPost("profile/change-password/", {
      new_password: newPassword
    });
  }
  function logout() {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    profileFirstName.value = "";
    profileLastName.value = "";
    profileLoaded.value = false;
    navigateTo("/");
  }
  function updateAvatar(url) {
    if (user.value) user.value.avatar = url;
  }
  function updateName(name) {
    if (user.value) user.value.name = name;
  }
  function activatePremium() {
    if (user.value) {
      const premiumExpiresAt = /* @__PURE__ */ new Date();
      premiumExpiresAt.setMonth(premiumExpiresAt.getMonth() + 1);
      user.value.isPremium = true;
      user.value.premiumExpiresAt = premiumExpiresAt.toISOString();
    }
  }
  return {
    user,
    accessToken,
    refreshToken,
    profileFirstName,
    profileLastName,
    profileLoaded,
    isLoggedIn,
    requiresProfileFill,
    fetchMyProfile,
    updateProfile,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    forgotPasswordVerify,
    forgotPasswordConfirm,
    changePassword,
    logout,
    updateAvatar,
    updateName,
    activatePremium
  };
});
export {
  useAuthStore as u
};
//# sourceMappingURL=auth-CDZnEywe.js.map
