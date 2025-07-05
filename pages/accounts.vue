<template>
  <div>
    <!-- Yaratish Tugmasi bilan Sarlavha -->
    <div class="flex w-full justify-end mb-2">
      <button
        @click="showCreateModal = true"
        class="me-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Yaratish
      </button>
    </div>

    <!-- Foydalanuvchilar Ro'yxati -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="account in accounts"
        :key="account._id"
        class="p-4 bg-white shadow-md rounded-lg border border-gray-200"
      >
        <h3 class="text-lg font-bold text-gray-800">{{ account.name }}</h3>
        <p class="text-gray-600">Website: 
          <a 
            :href="account.website"
            target="_blank" class="text-blue-600 hover:underline break-all">
              {{ account.website || '-----' }}
          </a>
        </p>
        <p class="text-gray-600">Login: {{ account.login }}</p>
        <p class="text-gray-600">
          Parol: <span class="blurry-text">{{ account.password }}</span>
          <span
            @click="copyToClipboard(account.password)"
            class="ml-2 text-blue-500 cursor-pointer hover:underline"
            >Nusxalash</span
          >
        </p>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            @click="openEditModal(account)"
            class="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          >
            Tahrirlash
          </button>
          <button
            @click="removeAccount(account._id)"
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
          {{ isEditMode ? "Hisobni Tahrirlash" : "Hisob Yaratish" }}
        </h2>
        <form @submit.prevent="isEditMode ? updateAccount() : createAccount()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Ism</label>
            <input
              v-model="newAccount.name"
              type="text"
              id="name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ism kiriting"
              required
            />
          </div>
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              v-model="newAccount.website"
              type="text"
              id="website"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Website URL"
              required
            />
          </div>
          <div>
            <label for="login" class="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <input
              v-model="newAccount.login"
              type="text"
              id="login"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Login kiriting"
              required
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input
              v-model="newAccount.password"
              type="password"
              id="password"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Parol kiriting"
            />
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";
import { ref, onMounted } from "vue";

const config = useRuntimeConfig();

const accounts = ref([]);
const showCreateModal = ref(false);
const isEditMode = ref(false);
const newAccount = ref({
  name: "",
  website: "",
  login: "",
  password: "",
});
let editingAccountId = ref(null);

async function getAccounts(token) {
  try {
    const res = await axios.get(`${config.public.url}/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    accounts.value = res.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
  }
}

async function createAccount() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.post(`${config.public.url}/accounts`, newAccount.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    getAccounts(token);
    resetForm();
    closeModal();
    toast.success("Hisob muvaffaqiyatli yaratildi!", { autoClose: 2000 });
  } catch (error) {
    console.error("Error creating account:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", { autoClose: 2000 });
  }
}

async function updateAccount() {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.put(
      `${config.public.url}/accounts/${editingAccountId.value}`,
      newAccount.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    getAccounts(token);
    resetForm();
    closeModal();
    toast.success("Hisob muvaffaqiyatli yangilandi!", { autoClose: 2000 });
  } catch (error) {
    console.error("Error updating account:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", { autoClose: 2000 });
  }
}

async function removeAccount(accountId) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.delete(`${config.public.url}/accounts/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    accounts.value = accounts.value.filter((account) => account._id !== accountId);
    toast.success("Hisob muvaffaqiyatli o'chirildi!", { autoClose: 2000 });
  } catch (error) {
    console.error("Error removing account:", error);
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", { autoClose: 2000 });
  }
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Muvaffaqiyatli nusxalandi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Nusxalanishda xatolik yuz berdi!", { autoClose: 2000 });
  }
};

function openCreateModal() {
  isEditMode.value = false;
  resetForm();
  showCreateModal.value = true;
}

function openEditModal(account) {
  isEditMode.value = true;
  editingAccountId.value = account._id;
  newAccount.value = { name: account.name, website: account.website, login: account.login, password: account.password };
  showCreateModal.value = true;
}

function closeModal() {
  showCreateModal.value = false;
  resetForm();
}

function resetForm() {
  newAccount.value = { name: "", website: "", login: "", password: "" };
  editingAccountId.value = null;
}

onMounted(() => {
  const token = JSON.parse(localStorage.getItem("token"));
  getAccounts(token);
});
</script>

<style scoped>
.blurry-text {
  filter: blur(4px);
}
</style>
