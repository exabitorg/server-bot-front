<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
    <div v-if="!showEditModal">
      <div class="flex justify-between items-center mb-6">
        <p class="text-2xl font-bold text-gray-800">Profilingiz</p>
        <button
          @click="showEditModal = true"
          class="bg-indigo-600 text-white p-2 rounded-lg shadow-md bg-white hover:bg-gray-200 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="28"
            height="28"
          >
            <path
              d="M12.8995 6.85453L17.1421 11.0972L7.24264 20.9967H3V16.754L12.8995 6.85453ZM14.3137 5.44032L16.435 3.319C16.8256 2.92848 17.4587 2.92848 17.8492 3.319L20.6777 6.14743C21.0682 6.53795 21.0682 7.17112 20.6777 7.56164L18.5563 9.68296L14.3137 5.44032Z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="space-y-4 text-lg text-gray-700">
        <p class="flex justify-between">
          <span class="font-medium">Ism:</span>
          <span>{{ user.name }}</span>
        </p>
        <p class="flex justify-between">
          <span class="font-medium">Foydalanuvchi nomi:</span>
          <span>{{ user.username }}</span>
        </p>
        <p class="flex justify-between">
          <span class="font-medium">Roli:</span>
          <span>{{ user.role }}</span>
        </p>
        <p class="flex justify-between">
          <span class="font-medium">Oxirgi faollik:</span>
          <span>{{ new Date(user.lastActivity).toLocaleString() }}</span>
        </p>
        <p class="flex justify-between">
          <span class="font-medium">Yaratilgan vaqti:</span>
          <span>{{ new Date(user.createdAt).toLocaleString() }}</span>
        </p>
      </div>
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <p class="text-2xl font-bold text-gray-800">Profilni yangilash</p>
        <button
          @click="showEditModal = false"
          class="bg-gray-500 p-2 rounded-lg shadow-md bg-white hover:bg-gray-200 transition duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="24"
            height="24"
          >
            <path
              d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"
            ></path>
          </svg>
        </button>
      </div>
      <form @submit.prevent="update">
        <div class="space-y-6 text-lg text-gray-700">
          <div class="flex flex-col mb-2">
            <label for="name" class="font-medium text-gray-800 mb-2">Ism</label>
            <input
              type="text"
              id="name"
              v-model="user.name"
              class="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col mb-2">
            <label for="username" class="font-medium text-gray-800 mb-2"
              >Foydalanuvchi nomi</label
            >
            <input
              type="text"
              id="username"
              v-model="user.username"
              class="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col mb-2">
            <label for="password" class="font-medium text-gray-800 mb-2"
              >Parol</label
            >
            <input
              type="text"
              id="password"
              v-model="user.password"
              class="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex flex-col">
            <label for="role" class="font-medium text-gray-800 mb-2"
              >Roli</label
            >
            <select
              name="role"
              id="role"
              disabled
              :value="user.role"
              class="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">Foydalanuvchi</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="showEditModal = false"
            class="bg-gray-500 p-2 mr-2 rounded-lg shadow-md bg-white hover:bg-gray-200 transition duration-300"
          >
            Bekor qilish
          </button>
          <button
            class="bg-green-600 text-white p-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Yangilash
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";

const config = useRuntimeConfig();

const showEditModal = ref(false);
const user = ref({
  _id: "",
  name: "",
  username: "",
  role: "",
  lastActivity: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

onMounted(() => {
  const token = JSON.parse(localStorage.getItem("token"));
  getMe(token);
});

async function getMe(token) {
  const res = await axios.get(`${config.public.url}/users/get-me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  user.value = res.data.data;
}

async function update() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.put(
      `${config.public.url}/users/${user.value._id}`,
      user.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getMe(token);
    showEditModal.value = false;
    toast.success("Foydalanuvchi muvaffaqiyatli yangilandi!", {
      autoClose: 2000,
    })
  } catch (error) {
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    })
    console.error("Error updating user:", error);
  }
}
</script>

<style scoped>
@media (max-width: 768px) {
  .max-w-3xl {
    max-width: 100%;
  }
  .p-6 {
    padding: 24px;
  }
  .space-y-4 {
    margin-bottom: 1rem;
  }
}
</style>
