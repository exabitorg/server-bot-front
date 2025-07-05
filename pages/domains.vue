<template>
  <div>
    <!-- Header -->
    <div class="flex w-full justify-between mb-2">
      <input
        @input="searchDomains"
        type="text"
        v-model="search"
        placeholder="Qidirish..."
        class="lg:w-1/3 sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        @click="openCreateModal"
        class="w-22 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
      >
        Yaratish
      </button>
    </div>

    <!-- Domain Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="domain in domains"
        :key="domain._id"
        :class="['shadow-lg p-4 rounded-lg w-full flex flex-col justify-between space-y-2 border hover:shadow-xl transition-shadow', getCardBgColor(domain.endDate)]"
      >
        <h3 class="text-lg font-bold text-gray-800">{{ domain.name }}</h3>
        <p class="text-gray-600">Narxi: {{ domain.price }} USD</p>
        <p class="text-gray-600">Provider: {{ domain.provider?.name || "Noma'lum" }}</p>

        <div class="mb-3">
          <p class="text-sm font-medium text-gray-700">Foydalanuvchilar:</p>
          <ul class="list-disc ml-4 text-sm">
            <li v-for="user in domain.users" :key="user._id">{{ user.username }}</li>
          </ul>
        </div>

        <div class="grid grid-cols-2 gap-4 text-center border-t pt-4 border-gray-100">
          <div>
            <p class="text-sm text-gray-500">Boshlanish sanasi</p>
            <p class="text-sm font-medium text-gray-700">{{ formatDate(domain.startDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tugash sanasi</p>
            <p class="text-sm font-medium text-gray-700">{{ formatDate(domain.endDate) }}</p>
          </div>
        </div>

        <div class="text-center mt-2">
          <p class="text-sm font-medium text-gray-600">
            Qolgan kunlar:
            <span :class="getTextColor(domain.endDate)">
              {{ calculateRemainingDays(domain.endDate) }}
            </span>
          </p>
        </div>

        <div class="flex justify-end space-x-2 mt-4">
          <button @click="openEditModal(domain)" class="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg">
            Tahrirlash
          </button>
          <button @click="removeDomain(domain._id)" class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg">
            O'chirish
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          {{ isEditMode ? "Domain Tahrirlash" : "Domain Yaratish" }}
        </h2>

        <form @submit.prevent="isEditMode ? updateDomain() : createDomain()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Domain nomi</label>
            <input v-model="newDomain.name" type="text" id="name" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Narxi</label>
            <input v-model="newDomain.price" type="number" id="price" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
          </div>

          <div>
            <label for="provider" class="block text-sm font-medium text-gray-700 mb-1">Provider tanlang</label>
            <select v-model="selectedProvider" id="provider" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="" disabled>Provider tanlang</option>
              <option v-for="provider in providers" :key="provider._id" :value="provider._id">{{ provider.name }}</option>
            </select>
          </div>

          <div>
            <label for="users" class="block text-sm font-medium text-gray-700 mb-1">Foydalanuvchilar</label>
            <CustomMultipleSelect id="users" v-model="selectedOptions" :options="users" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Boshlanish sanasi</label>
              <input v-model="newDomain.startDate" type="date" id="startDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">Tugash sanasi</label>
              <input v-model="newDomain.endDate" type="date" id="endDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Bekor qilish</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">
              {{ isEditMode ? "O'zgartirish" : "Qo'shish" }}
            </button>
          </div>
        </form>

        <button @click="closeModal" class="absolute top-7 right-3 text-gray-500 hover:text-gray-700">
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
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import CustomMultipleSelect from "@/components/CustomMultipleSelect.vue";

const config = useRuntimeConfig();

const domains = ref([]);
const users = ref([]);
const providers = ref([]);
const selectedOptions = ref([]);
const selectedProvider = ref(null);
const token = ref(null);
const search = ref("");
const showCreateModal = ref(false);
const isEditMode = ref(false);
const editingDomainId = ref(null);

const newDomain = ref({
  name: "",
  price: 0,
  startDate: null,
  endDate: null,
  users: [],
  provider: null,
});

const convertToTimestamp = (field) => {
  if (newDomain.value[field]) {
    newDomain.value[field] = new Date(newDomain.value[field]).getTime();
  }
};

const calculateRemainingDays = (endDate) => {
  const now = new Date().getTime();
  return Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
};

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

const getCardBgColor = (endDate) => {
  const days = calculateRemainingDays(endDate);
  if (days < 10) return "bg-red-200";
  if (days < 15) return "bg-yellow-200";
  return "bg-green-200";
};

const getTextColor = (endDate) => {
  const days = calculateRemainingDays(endDate);
  if (days < 10) return "text-red-600";
  if (days < 15) return "text-yellow-600";
  return "text-green-600";
};

const getDomains = async () => {
  try {
    const res = await axios.get(`${config.public.url}/domains`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    domains.value = res.data.data;
  } catch (e) {
    console.error("Error fetching domains:", e);
  }
};

const getUsers = async () => {
  try {
    const res = await axios.get(`${config.public.url}/users`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    users.value = res.data.data;
  } catch (e) {
    console.error("Error fetching users:", e);
  }
};

const getProviders = async () => {
  try {
    const res = await axios.get(`${config.public.url}/providers`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    providers.value = res.data.data;
  } catch (e) {
    console.error("Error fetching providers:", e);
  }
};

const createDomain = async () => {
  try {
    convertToTimestamp("startDate");
    convertToTimestamp("endDate");
    newDomain.value.users = selectedOptions.value;
    newDomain.value.provider = selectedProvider.value;

    await axios.post(`${config.public.url}/domains`, newDomain.value, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    getDomains();
    resetForm();
    closeModal();
    toast.success("Domain muvaffaqiyatli yaratildi!");
  } catch (e) {
    console.error(e);
    toast.error("Domain yaratishda xatolik.");
  }
};

const updateDomain = async () => {
  try {
    convertToTimestamp("startDate");
    convertToTimestamp("endDate");
    newDomain.value.users = selectedOptions.value;
    newDomain.value.provider = selectedProvider.value;

    await axios.put(`${config.public.url}/domains/${editingDomainId.value}`, newDomain.value, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    getDomains();
    resetForm();
    closeModal();
    toast.success("Domain muvaffaqiyatli yangilandi!");
  } catch (e) {
    console.error(e);
    toast.error("Domain yangilashda xatolik.");
  }
};

const removeDomain = async (id) => {
  try {
    await axios.delete(`${config.public.url}/domains/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    domains.value = domains.value.filter((d) => d._id !== id);
    toast.success("Domain o'chirildi.");
  } catch (e) {
    console.error(e);
    toast.error("O'chirishda xatolik.");
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  resetForm();
  showCreateModal.value = true;
};

const openEditModal = (domain) => {
  isEditMode.value = true;
  editingDomainId.value = domain._id;
  newDomain.value = {
    name: domain.name,
    price: domain.price,
    startDate: new Date(domain.startDate).toISOString().split("T")[0],
    endDate: new Date(domain.endDate).toISOString().split("T")[0],
  };
  selectedOptions.value = domain.users;
  selectedProvider.value = domain.provider?._id || null;
  showCreateModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  resetForm();
};

const resetForm = () => {
  newDomain.value = { name: "", price: 0, startDate: null, endDate: null };
  selectedOptions.value = [];
  selectedProvider.value = null;
  editingDomainId.value = null;
};

const searchDomains = () => {
  if (!search.value) return getDomains();
  const query = search.value.toLowerCase();
  domains.value = domains.value.filter((d) => d.name.toLowerCase().includes(query));
};

onMounted(() => {
  token.value = JSON.parse(localStorage.getItem("token"));
  getDomains();
  getUsers();
  getProviders();
});
</script>
