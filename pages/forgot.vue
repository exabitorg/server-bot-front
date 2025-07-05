<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Parolni tiklash
      </h1>
      <p class="text-gray-600 text-sm mb-6 text-center">
        Agar parolingizni unutgan bo'lsangiz, Telegram usernameingizni kiriting va biz sizga yangi parolni yuboramiz.
      </p>
      <form @submit.prevent="resetPassword" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Telegram Username
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="Username"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Jo‘natish
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import axios from "axios";
const config = useRuntimeConfig();

definePageMeta({
  layout: "empty",
});

const username = ref("");

async function resetPassword() {
  try {
    username.value = username.value.startsWith('@') ? username.value.slice(1) : username.value;
    await axios.post(`${config.public.url}/users/reset`, { username: username.value.trim() });
    navigateTo("/login");
  } catch (error) {
    console.error("Error resetting password:", error.message);
    toast.error("Error resetting password. Please try again.", {
      autoClose: 2000,
    });
  }
}
</script>
