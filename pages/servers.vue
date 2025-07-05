<template>
  <div>
    <!-- Yaratish Tugmasi -->
    <div v-if="admin" class="flex w-full justify-between mb-2">
      <input
        @input="searchServers"
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

    <!-- Yaratish Modali -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <h2 class="text-xl font-semibold text sottolinea-800 mb-4">
          Server Yaratish
        </h2>
        <form @submit.prevent="createServer" class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomi
            </label>
            <input
              v-model="newServer.name"
              type="text"
              id="name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Server nomini kiriting"
              required
            />
          </div>
          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Narxi
            </label>
            <input
              v-model="newServer.price"
              type="number"
              id="price"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Narxni kiriting"
              required
            />
          </div>
          <div>
            <label
              for="serverIp"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              IP Manzil
            </label>
            <input
              v-model="newServer.serverIp"
              type="text"
              id="serverIp"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Server IP manzilini kiriting"
            />
          </div>
          <div>
            <label
              for="user"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Foydalanuvchi
            </label>
            <input
              v-model="newServer.user"
              type="text"
              id="user"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Foydalanuvchi nomini kiriting"
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
              v-model="newServer.password"
              type="password"
              id="password"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Parolni kiriting"
            />
          </div>
          <div>
            <label
              for="provider"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Provider</label
            >
            <select
              v-model="newServer.provider"
              id="provider"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option disabled value="">Provider tanlang</option>
              <option
                v-for="prov in providers"
                :key="prov._id"
                :value="prov._id"
              >
                {{ prov.name }}
              </option>
            </select>
          </div>
          <div>
            <label
              for="users"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Foydalanuvchilarni tanlang
            </label>
            <CustomMultipleSelect
              id="users"
              v-model="selectedOptions"
              :options="users"
            />
          </div>
          <div>
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Boshlanish Sanasi
            </label>
            <input
              v-model="newServer.startDate"
              type="date"
              id="startDate"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Boshlanish sanasini tanlang"
              required
            />
          </div>
          <div>
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Tugash Sanasi
            </label>
            <input
              v-model="newServer.endDate"
              type="date"
              id="endDate"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tugash sanasini tanlang"
              required
            />
          </div>
          <div class="col-span-2 flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Yaratish
            </button>
          </div>
        </form>
        <button
          @click="showCreateModal = false"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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

    <!-- Tahrirlash Modali -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">
          Serverni Tahrirlash
        </h2>
        <form @submit.prevent="updateServer" class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Nomi
            </label>
            <input
              v-model="editedServer.name"
              type="text"
              id="name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Server nomini kiriting"
              required
            />
          </div>
          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Narxi
            </label>
            <input
              v-model="editedServer.price"
              type="number"
              id="price"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Narxni kiriting"
              required
            />
          </div>
          <div>
            <label
              for="serverIp"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              IP Manzil
            </label>
            <input
              v-model="editedServer.serverIp"
              type="text"
              id="serverIp"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Server IP manzilini kiriting"
            />
          </div>
          <div>
            <label
              for="user"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Foydalanuvchi
            </label>
            <input
              v-model="editedServer.user"
              type="text"
              id="user"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Foydalanuvchi nomini kiriting"
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
              v-model="editedServer.password"
              type="password"
              id="password"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Parolni kiriting"
            />
          </div>
          <div>
            <label
              for="provider"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Provider</label
            >
            <select
              v-model="editedServer.provider"
              id="provider"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option disabled value="">Provider tanlang</option>
              <option
                v-for="prov in providers"
                :key="prov._id"
                :value="prov._id"
              >
                {{ prov.name }}
              </option>
            </select>
          </div>
          <div>
            <label
              for="users"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Foydalanuvchilarni tanlang
            </label>
            <CustomMultipleSelect
              id="users"
              v-model="selectedOptions"
              :options="users"
            />
          </div>
          <div>
            <label
              for="startDate"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Boshlanish Sanasi
            </label>
            <input
              v-model="editedServer.startDate"
              type="date"
              id="startDate"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Boshlanish sanasini tanlang"
              required
            />
          </div>
          <div>
            <label
              for="endDate"
              class="block text-sm font-medium text-gray-700 mb-1"
            >
              Tugash Sanasi
            </label>
            <input
              v-model="editedServer.endDate"
              type="date"
              id="endDate"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tugash sanasini tanlang"
              required
            />
          </div>
          <div class="col-span-2 flex justify-end space-x-2 mt-4">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 Rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Saqlash
            </button>
          </div>
        </form>
        <button
          @click="showEditModal = false"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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

    <div class="w-full h-full">
      <ul
        v-if="data.length > 0"
        class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <li
          v-for="item in data"
          :key="item._id"
          :class="[
            'shadow-lg p-4 rounded-lg w-full flex flex-col justify-between space-y-2 border hover:shadow-xl transition-shadow',
            getCardBgColor(item.endDate),
          ]"
        >
          <p class="text-xl font-bold text-gray-800 truncate">
            {{ item.name }}
          </p>
          <p class="text-lg text-gray-600">
            <span class="font-medium">Narxi:</span> {{ item.price }} USD
          </p>

          <div v-if="admin" class="space-y-1">
            <p>
              <span class="font-medium text-gray-700">IP: </span>
              <span class="blurry-text">{{ item.serverIp }}</span>
              <span
                @click="copyToClipboard(`ssh ${item.user}@${item.serverIp}`)"
                class="ml-2 text-blue-500 cursor-pointer hover:underline"
                >Nusxalash</span
              >
            </p>
            <p>
              <span class="font-medium text-gray-700">Foydalanuvchi: </span>
              {{ item.user }}
            </p>
            <p>
              <span class="font-medium text-gray-700">Parol: </span>
              <span class="blurry-text">{{ item.password }}</span>
              <span
                @click="copyToClipboard(item.password)"
                class="ml-2 text-blue-500 cursor-pointer hover:underline"
                >Nusxalash</span
              >
            </p>
          </div>

          <p class="text-sm text-gray-600">
            <span class="font-medium">Provider:</span>
            {{ item.provider?.name || item.provider }}
          </p>

          <!-- Belgilangan Foydalanuvchilar -->
          <div>
            <p class="text-sm font-medium text-gray-700 mt-2">
              Belgilangan Foydalanuvchilar:
            </p>
            <ul class="list-disc ml-4 text-sm">
              <li v-for="user in item.users" :key="user._id">
                {{ user.username }}
              </li>
            </ul>
          </div>

          <div
            class="grid grid-cols-2 gap-4 text-center border-t pt-4 border-gray-100"
          >
            <div>
              <p class="text-sm text-gray-500">Boshlanish Sanasi</p>
              <p class="text-sm font-medium text-gray-700">
                {{ formatDate(item.startDate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tugash Sanasi</p>
              <p class="text-sm font-medium text-gray-700">
                {{ formatDate(item.endDate) }}
              </p>
            </div>
          </div>

          <!-- Qolgan Kunlar Bo'limi -->
          <div class="text-center mt-2">
            <p class="text-sm font-medium text-gray-600">
              Qolgan Kunlar:
              <span :class="getTextColor(item.endDate)">
                {{ calculateRemainingDays(item.endDate) }}
              </span>
            </p>
          </div>

          <div class="flex justify-end gap-2 mt-4">
            <button
              v-if="admin"
              @click="openEditModal(item)"
              type="button"
              class="px-4 py-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm transition dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800"
            >
              Tahrirlash
            </button>
            <button
              v-if="admin"
              @click="deleteServer(item._id)"
              type="button"
              class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm transition dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-900"
            >
              O'chirish
            </button>
          </div>
        </li>
      </ul>
      <div v-else class="w-full h-full flex items-center justify-center">
        <p>Hech qanday server topilmadi.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { toast } from "vue3-toastify";
import CustomMultipleSelect from "~/components/CustomMultipleSelect.vue";

const config = useRuntimeConfig();

const data = ref([]);
const users = ref([]);
const providers = ref([]); // 🔹 Provider ro‘yxati
const selectedOptions = ref([]);
const editedServer = ref({});
const admin = ref(false);
const showEditModal = ref(false);
const showCreateModal = ref(false);
const search = ref("");

const newServer = ref({
  name: "",
  price: 0,
  serverIp: "",
  user: "root",
  password: "",
  provider: "",
});

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Muvaffaqiyatli nusxalandi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Nusxalanishda xatolik yuz berdi!", { autoClose: 2000 });
  }
};

const openEditModal = (item) => {
  editedServer.value = { ...item };
  selectedOptions.value = item.users;
  editedServer.value.provider = item.provider?._id || item.provider;
  editedServer.value.startDate = new Date(item.startDate)
    .toISOString()
    .split("T")[0];
  editedServer.value.endDate = new Date(item.endDate)
    .toISOString()
    .split("T")[0];
  showEditModal.value = true;
};

async function getServers(token) {
  const res = await axios.get(`${config.public.url}/servers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  data.value = res.data.data;
  if (res.data.admin) admin.value = true;
}

async function getUsers(token) {
  const res = await axios.get(`${config.public.url}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  users.value = res.data.data;
}

async function getProviders(token) {
  const res = await axios.get(`${config.public.url}/providers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  providers.value = res.data.data;
}

const convertToTimestamp = (field) => {
  if (newServer.value[field]) {
    newServer.value[field] = new Date(newServer.value[field]).getTime();
  }
  if (editedServer.value[field]) {
    editedServer.value[field] = new Date(editedServer.value[field]).getTime();
  }
};

async function createServer() {
  try {
    convertToTimestamp("startDate");
    convertToTimestamp("endDate");
    newServer.value.users = selectedOptions.value;
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.post(`${config.public.url}/servers`, newServer.value, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getServers(token);
    showCreateModal.value = false;
    Object.keys(newServer.value).forEach((key) => (newServer.value[key] = ""));
    toast.success("Server muvaffaqiyatli yaratildi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Xatolik yuz berdi. Iltimos qayta urinib ko‘ring!", {
      autoClose: 2000,
    });
  }
}

async function updateServer() {
  try {
    convertToTimestamp("startDate");
    convertToTimestamp("endDate");
    const itemId = editedServer.value._id;
    delete editedServer.value._id;
    editedServer.value.users = selectedOptions.value;
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.put(
      `${config.public.url}/servers/${itemId}`,
      editedServer.value,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    getServers(token);
    showEditModal.value = false;
    toast.success("Server muvaffaqiyatli tahrirlandi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("Tahrirlashda xatolik yuz berdi!", { autoClose: 2000 });
  }
}

async function deleteServer(id) {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    await axios.delete(`${config.public.url}/servers/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getServers(token);
    toast.success("Server muvaffaqiyatli o'chirildi!", { autoClose: 2000 });
  } catch (error) {
    toast.error("O'chirishda xatolik yuz berdi!", { autoClose: 2000 });
  }
}

function calculateRemainingDays(endDate) {
  const currentDate = new Date().getTime();
  const differenceInDays = Math.ceil(
    (endDate - currentDate) / (1000 * 60 * 60 * 24)
  );
  return differenceInDays > 0 ? differenceInDays : 0;
}

function getCardBgColor(endDate) {
  const remainingDays = calculateRemainingDays(endDate);
  if (remainingDays < 10) return "bg-red-200";
  if (remainingDays < 15) return "bg-yellow-200";
  return "bg-green-200";
}

function getTextColor(endDate) {
  const remainingDays = calculateRemainingDays(endDate);
  if (remainingDays < 10) return "text-red-600";
  if (remainingDays < 15) return "text-yellow-600";
  return "text-green-600";
}

function searchServers() {
  if (!search.value) {
    const token = JSON.parse(localStorage.getItem("token"));
    getServers(token);
    return;
  }
  data.value = data.value.filter((item) => {
    const regex = new RegExp(search.value, "i");
    return regex.test(item.name);
  });
}

onMounted(() => {
  const token = JSON.parse(localStorage.getItem("token"));
  getUsers(token);
  getProviders(token); // 🔹 provider list
  getServers(token);
});
</script>

<style scoped>
.blurry-text {
  color: transparent;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

/* Modal optimizations */
.modal-container {
  max-width: 48rem; /* 768px, slightly wider for two columns */
  width: 90%; /* Responsive width */
  max-height: 90vh; /* Prevent overflow on small screens */
  overflow-y: auto; /* Scroll if content overflows */
  padding: 1.5rem; /* Consistent padding */
}

/* Form grid layout */
form {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two equal columns */
  gap: 1rem; /* Spacing between fields */
}

/* Full-width buttons container */
.buttons-container {
  grid-column: span 2; /* Span both columns */
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  form {
    grid-template-columns: 1fr; /* Single column on small screens */
  }
  .buttons-container {
    grid-column: span 1;
  }
  .modal-container {
    width: 95%;
    padding: 1rem;
  }
}

/* Close button */
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

/* Input and select styling */
input,
select {
  font-size: 0.875rem; /* Smaller font for compactness */
}

/* Modal header */
h2 {
  font-size: 1.25rem; /* Slightly smaller header */
  line-height: 1.5;
}
</style>
