<template>
  <div>
    <div v-if="admin" class="flex w-full justify-between mb-2">
      <input
        @input="searchSms"
        type="text"
        v-model="search"
        placeholder="Qidirish..."
        class="lg:w-1/3 sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        @click="showCreateModal = true"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Yaratish
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          {{ newSms._id ? "SMS tahrirlash" : "SMS yaratish" }}
        </h2>
        <form
          @submit.prevent="newSms._id ? updateSms() : createSms()"
          class="space-y-4"
        >
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nomi</label
            >
            <input
              v-model="newSms.name"
              type="text"
              id="name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Narxi</label
            >
            <input
              v-model="newSms.price"
              type="number"
              id="price"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              for="provider"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Provider</label
            >
            <select
              v-model="newSms.provider"
              id="provider"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Provider tanlang</option>
              <option
                v-for="provider in providers"
                :key="provider._id"
                :value="provider._id"
              >
                {{ provider.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="id" class="block text-sm font-medium text-gray-700 mb-1"
              >ID</label
            >
            <input
              v-model="newSms.id"
              type="text"
              id="id"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label
              for="users"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Foydalanuvchilarni tanlang</label
            >
            <CustomMultipleSelect
              id="users"
              v-model="selectedOptions"
              :options="users"
            />
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
            >
              Saqlash
            </button>
          </div>
        </form>
        <button
          @click="showCreateModal = false"
          class="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
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

    <!-- Monthly Report Modal -->
    <div
      v-if="showItemModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
        <div class="flex justify-between items-center mb-4">
          <p class="text-lg font-semibold text-gray-700">Oylik hisobot</p>
          <button
            @click="showItemModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <ul>
          <li
            v-for="item in smsMonthlyCounts.slice().reverse()"
            :key="item._id"
            class="flex justify-between items-center border-b border-gray-300 py-2 text-sm"
          >
            <span class="w-1/4 font-medium text-gray-800">{{
              item.month
            }}</span>
            <span class="w-1/4 text-gray-600">SMS: {{ item.count }}</span>
            <span class="w-1/4 text-gray-600"
              >Narxi: {{ parentItem.price }} so'm</span
            >
            <span class="w-1/4 text-blue-700 font-semibold"
              >Umumiy: {{ formatNumber(item.count * parentItem.price) }} so'm</span
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- SMS Items Grid -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in data"
        :key="item._id"
        class="p-4 bg-white shadow-md rounded-lg border border-gray-200"
      >
        <h3 class="text-lg font-bold text-gray-800">{{ item.name }}</h3>
        <p class="text-gray-600">ID: {{ item.id }}</p>
        <p class="text-gray-600">Narxi: {{ item.price }} so'm</p>
        <p class="text-gray-600">Provider: {{ item.provider?.name }}</p>
        <p class="text-sm font-medium text-gray-700 mt-2">
          Biriktirilgan foydalanuvchilar:
        </p>
        <ul class="list-disc ml-4 text-sm">
          <li v-for="user in item.users" :key="user._id">
            {{ user.username }}
          </li>
        </ul>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            @click="openItemModal(item)"
            class="px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg"
          >
            Oylik hisobotni ko‘rish
          </button>
          <button
            @click="openEditModal(item)"
            class="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg"
          >
            Tahrirlash
          </button>
          <button
            @click="removeSms(item._id)"
            class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg"
          >
            O‘chirish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";

const config = useRuntimeConfig();

const token = ref(null);
const admin = ref(false);
const search = ref("");
const showCreateModal = ref(false);
const showItemModal = ref(false);
const data = ref([]);
const users = ref([]);
const providers = ref([]);
const smsMonthlyCounts = ref([]);
const selectedOptions = ref([]);
const parentItem = ref(null);

const newSms = ref({
  name: "",
  price: null,
  provider: "",
  id: generateUUID(),
  users: [],
});

onMounted(() => {
  token.value = JSON.parse(localStorage.getItem("token"));
  getSms();
  getUsers();
  getProviders();
});

function formatNumber(num) {
  return num
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}


function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function searchSms() {
  if (!search.value) return getSms();
  const regex = new RegExp(search.value, "i");
  data.value = data.value.filter((item) => regex.test(item.name));
}

async function getSms() {
  const res = await axios.get(`${config.public.url}/sms`, {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  data.value = res.data.data;
  admin.value = res.data.admin;
}

async function getUsers() {
  const res = await axios.get(`${config.public.url}/users`, {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  users.value = res.data.data;
}

async function getProviders() {
  const res = await axios.get(`${config.public.url}/providers`, {
    headers: { Authorization: `Bearer ${token.value}` },
  });
  providers.value = res.data.data;
}

async function createSms() {
  try {
    delete newSms.value._id;
    newSms.value.users = selectedOptions.value;
    await axios.post(`${config.public.url}/sms`, newSms.value, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    resetForm();
    toast.success("SMS muvaffaqiyatli yaratildi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

async function updateSms() {
  try {
    newSms.value.users = selectedOptions.value;
    await axios.put(
      `${config.public.url}/sms/${newSms.value._id}`,
      newSms.value,
      {
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    resetForm();
    toast.success("SMS muvaffaqiyatli tahrirlandi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

function openItemModal(item) {
  smsMonthlyCounts.value = item.monthlyCounts;
  parentItem.value = item;
  showItemModal.value = true;
}

function openEditModal(item) {
  newSms.value = {
    _id: item._id,
    name: item.name,
    price: item.price,
    provider: item.provider,
    id: item.id,
    users: item.users,
  };
  selectedOptions.value = item.users;
  showCreateModal.value = true;
}

async function removeSms(id) {
  try {
    await axios.delete(`${config.public.url}/sms/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    getSms();
    toast.success("SMS muvaffaqiyatli o'chirildi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko'ring!", {
      autoClose: 2000,
    });
  }
}

function resetForm() {
  showCreateModal.value = false;
  getSms();
  newSms.value = {
    name: "",
    price: null,
    provider: "",
    id: generateUUID(),
    users: [],
  };
  selectedOptions.value = [];
}
</script>
