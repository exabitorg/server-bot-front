<template>
  <div>
    <!-- Yaratish Tugmasi bilan Sarlavha -->
    <div class="flex w-full justify-end mb-2">
      <button
        @click="showSendMessageModal = true"
        class="me-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Xabar Yuborish
      </button>
      <button
        @click="openCreateModal"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Yaratish
      </button>
    </div>

    <!-- Foydalanuvchilar Ro'yxati -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="user in users"
        :key="user._id"
        class="p-4 bg-white shadow-md rounded-lg border border-gray-200"
      >
        <h3 class="text-lg font-bold text-gray-800">{{ user.name }}</h3>
        <p class="text-gray-600">Foydalanuvchi nomi: {{ user.username }}</p>
        <p class="text-gray-600">Rol: {{ user.role }}</p>
        <p class="text-gray-600">
          Oxirgi faollik: {{ new Date(user.lastActivity).toLocaleString() }}
        </p>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            @click="openMessageModal(user._id)"
            class="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            xabar yuborish
          </button>
          <button
            @click="openEditModal(user)"
            class="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          >
            Tahrirlash
          </button>
          <button
            @click="removeUser(user._id)"
            class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          {{
            isEditMode ? "Foydalanuvchini Tahrirlash" : "Foydalanuvchi Yaratish"
          }}
        </h2>
        <form
          @submit.prevent="isEditMode ? updateUser() : createUser()"
          class="space-y-4"
        >
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Ism
            </label>
            <input
              v-model="newUser.name"
              type="text"
              id="name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ism kiriting"
              required
            />
          </div>
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Foydalanuvchi nomi
            </label>
            <input
              v-model="newUser.username"
              type="text"
              id="username"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Foydalanuvchi nomini kiriting"
              required
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Parol
            </label>
            <input
              v-model="newUser.password"
              type="password"
              id="password"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Parol kiriting"
            />
          </div>
          <div>
            <label
              for="role"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Rol
            </label>
            <select
              v-model="newUser.role"
              id="role"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="user">Foydalanuvchi</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <!-- Modal Harakatlari -->
          <div class="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {{ isEditMode ? "Yangilash" : "Yaratish" }}
            </button>
          </div>
        </form>
        <button
          @click="closeModal"
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Xabar Yuborish Modali -->
    <div
      v-if="showSendMessageModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          Xabar Yuborish
        </h2>
        <form @submit.prevent="sendMessage" class="space-y-4">
          <div>
            <label
              for="message"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Xabar
            </label>
            <textarea
              v-model="message"
              id="message"
              class="w-full border h-20 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Xabar kiriting"
              required
            ></textarea>
          </div>

          <div
            class="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0"
          >
            <div class="relative w-full">
              <div class="items-center justify-center max-w-xl mx-auto">
                <label
                  class="flex justify-center w-full h-16 px-2 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                  id="drop"
                  ><span class="flex items-center space-x-2"
                    ><svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-6 h-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path></svg
                    ><span class="font-medium text-gray-600"
                      >Fayl yuklash
                    </span></span
                  ><input
                    type="file"
                    name="file_upload"
                    class="hidden"
                    accept="image/png,image/jpeg"
                    id="input"
                    ref="fileInput"
                    @change="handleFileUpload"
                /></label>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-3">
            <button
              type="button"
              @click="showSendMessageModal = false"
              class="px-2 py-1 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Bekor qilish
            </button>
            <button
              id="sendMessageBtn"
              type="submit"
              class="px-2 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Yuborish
            </button>
          </div>
        </form>
        <button
          @click="closeSendMessageModal"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

const users = ref([]);
const showCreateModal = ref(false);
const showSendMessageModal = ref(false);
const isEditMode = ref(false);
const selectedUserId = ref(null);
const newUser = ref({
  name: "",
  username: "",
  password: "",
  role: "user",
});
const message = ref("");
let editingUserId = ref(null);
const fileInput = ref(null);
const fileUrl = ref(null);

async function getUsers(token) {
  try {
    const res = await axios.get(`${config.public.url}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    users.value = res.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

async function createUser() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.post(`${config.public.url}/users`, newUser.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    getUsers(token);
    resetForm();
    closeModal();
    toast.success("Foydalanuvchi muvaffaqiyatli yaratildi!", {
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

async function updateUser() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.put(
      `${config.public.url}/users/${editingUserId.value}`,
      newUser.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    getUsers(token);
    resetForm();
    closeModal();
    toast.success("Foydalanuvchi muvaffaqiyatli yangilandi!", {
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

async function removeUser(userId) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.delete(`${config.public.url}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    users.value = users.value.filter((user) => user._id !== userId);
    toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi!", {
      autoClose: 2000,
    });
  } catch (error) {
    console.error("Error removing user:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

const handleFileUpload = async () => {
  const file = fileInput.value.files[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "https://images.hypernova.uz/api/upload/single",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fileUrl.value = response.data.file.url;
      toast.success("File muvaffaqiyatli yuklandi!", {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
        autoClose: 2000,
      });
      console.error("Error uploading file:", error);
    }
  }
};

async function sendMessage() {
  try {
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    sendMessageBtn.disabled = true;
    const token = JSON.parse(localStorage.getItem("token"));
    if (selectedUserId.value) {
      await axios.post(
        `${config.public.url}/users/message/${selectedUserId.value}`,
        {
          message: message.value,
          imageUrl: fileUrl.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post(
        `${config.public.url}/users/message`,
        {
          message: message.value,
          imageUrl: fileUrl.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
    toast.success("Xabar muvaffaqiyatli yuborildi!", {
      autoClose: 2000,
    });
    sendMessageBtn.disabled = false;
    message.value = "";
    showSendMessageModal.value = false;
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

function openMessageModal(userId) {
  selectedUserId.value = userId;
  showSendMessageModal.value = true;
}

function openCreateModal() {
  isEditMode.value = false;
  resetForm();
  showCreateModal.value = true;
}

function openEditModal(user) {
  isEditMode.value = true;
  editingUserId.value = user._id;
  newUser.value = { name: user.name, username: user.username, role: user.role };
  showCreateModal.value = true;
}

function closeModal() {
  showCreateModal.value = false;
  resetForm();
}

function resetForm() {
  newUser.value = { name: "", username: "", password: "", role: "user" };
  editingUserId.value = null;
}

onMounted(() => {
  const token = JSON.parse(localStorage.getItem("token"));
  getUsers(token);
});
</script>
