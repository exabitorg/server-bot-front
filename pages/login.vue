<template>
  <div class="flex w-full h-screen justify-center items-center px-4">
    <div class="p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
      <p class="text-3xl text-center font-bold mb-6 text-gray-800">Kirish</p>
      <form @submit.prevent="login" class="space-y-4">
        <!-- Foydalanuvchi nomi maydoni -->
        <div>
          <label for="username" class="block mb-1 text-sm font-medium text-gray-700">
            Foydalanuvchi nomi
          </label>
          <input
            v-model="username"
            type="text"
            id="username"
            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 focus:outline-none"
            placeholder="Foydalanuvchi nomini kiriting"
          />
        </div>
        <!-- Parol maydoni -->
        <div>
          <label for="password" class="block mb-1 text-sm font-medium text-gray-700">
            Parol
          </label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 focus:outline-none"
            placeholder="Parolni kiriting"
          />
        </div>
        <!-- Parolni unutdingizmi? havolasi va jo‘natish tugmasi -->
        <div>
          <NuxtLink
            to="/forgot"
            class="block text-sm mb-3 text-blue-500 hover:text-blue-600 text-center sm:text-left"
          >
            Parolni unutdingizmi?
          </NuxtLink>
          <button
            type="submit"
            class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
          >
            Kirish
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";

definePageMeta({
  layout: "empty",
});

const config = useRuntimeConfig();
const username = ref("");
const password = ref("");

onMounted(() => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (token) {
    getMe(token);
  }
});

async function getMe(token) {
  try {
    await axios.get(`${config.public.url}/users/get-me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    navigateTo('/')
  } catch (error) {
    console.error(
      "Failed to fetch user data:",
      error.response?.data || error.message
    );
  }
}

async function login(event) {
  try {
    username.value = username.value.startsWith('@') ? username.value.slice(1) : username.value;
    const res = await axios.post(`${config.public.url}/users/login`, {
      username: username.value.trim(),
      password: password.value.trim(),
    });

    if (res.data.token) {
      localStorage.setItem("token", JSON.stringify(res.data.token));
      navigateTo('/')
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    toast.error("Login failed. Please try again.", {
      autoClose: 2000,
    });
  }
}
</script>
