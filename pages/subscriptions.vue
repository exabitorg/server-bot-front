<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between mb-4">
      <input
        v-model="search"
        @input="searchSubscriptions"
        type="text"
        placeholder="Qidirish..."
        class="lg:w-1/3 sm:w-1/2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="openCreateModal"
        class="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg"
      >
        Yaratish
      </button>
    </div>

    <!-- Subscription Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="subscription in subscriptions"
        :key="subscription._id"
        :class="['shadow-lg p-4 rounded-lg flex flex-col justify-between space-y-2 border hover:shadow-xl transition-shadow', getCardBgColor(subscription.endDate)]"
      >
        <h3 class="text-lg font-bold text-gray-800">{{ subscription.name }}</h3>
        <p class="text-gray-600">Narxi: {{ subscription.price }} USD</p>
        <p class="text-gray-600">Website: 
          <a 
            :href="subscription.website"
            target="_blank" class="text-blue-600 hover:underline break-all">
              {{ subscription.website || '-----' }}
          </a>
        </p>

        <div class="grid grid-cols-2 gap-4 text-center border-t pt-4 border-gray-100">
          <div>
            <p class="text-sm text-gray-500">Boshlanish sanasi</p>
            <p class="text-sm font-medium text-gray-700">{{ formatDate(subscription.startDate) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tugash sanasi</p>
            <p class="text-sm font-medium text-gray-700">{{ formatDate(subscription.endDate) }}</p>
          </div>
        </div>

        <div class="text-center mt-2">
          <p class="text-sm font-medium text-gray-600">
            Qolgan kunlar:
            <span :class="getTextColor(subscription.endDate)">
              {{ calculateRemainingDays(subscription.endDate) }}
            </span>
          </p>
        </div>

        <div class="flex justify-end space-x-2 mt-4">
          <button @click="openEditModal(subscription)" class="px-3 py-1 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg">
            Tahrirlash
          </button>
          <button @click="removeSubscription(subscription._id)" class="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg">
            O'chirish
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          {{ isEditMode ? "Obunani tahrirlash" : "Yangi obuna" }}
        </h2>

        <form @submit.prevent="isEditMode ? updateSubscription() : createSubscription()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nomi</label>
            <input v-model="newSubscription.name" type="text" class="w-full border rounded-lg px-3 py-2" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Narxi</label>
            <input v-model="newSubscription.price" type="number" class="w-full border rounded-lg px-3 py-2" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input v-model="newSubscription.website" type="text" class="w-full border rounded-lg px-3 py-2" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Boshlanish</label>
              <input v-model="newSubscription.startDate" type="date" class="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tugash</label>
              <input v-model="newSubscription.endDate" type="date" class="w-full border rounded-lg px-3 py-2" required />
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Bekor</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              {{ isEditMode ? "Saqlash" : "Qo'shish" }}
            </button>
          </div>
        </form>

        <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          ✖
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';

const config = useRuntimeConfig();
const token = ref(null);

const subscriptions = ref([]);
const search = ref('');
const showModal = ref(false);
const isEditMode = ref(false);
const editingId = ref(null);

const newSubscription = ref({
  name: '',
  price: 0,
  website: '',
  startDate: '',
  endDate: '',
});

const fetchSubscriptions = async () => {
  try {
    const res = await axios.get(`${config.public.url}/subscriptions`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    subscriptions.value = res.data.data;
  } catch (e) {
    console.error(e);
  }
};

const createSubscription = async () => {
  try {
    const payload = {
      ...newSubscription.value,
      startDate: new Date(newSubscription.value.startDate).getTime(),
      endDate: new Date(newSubscription.value.endDate).getTime(),
    };
    await axios.post(`${config.public.url}/subscriptions`, payload, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    toast.success("Obuna yaratildi!");
    fetchSubscriptions();
    closeModal();
  } catch (e) {
    toast.error("Xatolik yuz berdi!");
    console.error(e);
  }
};

const updateSubscription = async () => {
  try {
    const payload = {
      ...newSubscription.value,
      startDate: new Date(newSubscription.value.startDate).getTime(),
      endDate: new Date(newSubscription.value.endDate).getTime(),
    };
    await axios.put(`${config.public.url}/subscriptions/${editingId.value}`, payload, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    toast.success("Obuna yangilandi!");
    fetchSubscriptions();
    closeModal();
  } catch (e) {
    toast.error("Yangilashda xatolik!");
    console.error(e);
  }
};

const removeSubscription = async (id) => {
  try {
    await axios.delete(`${config.public.url}/subscriptions/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    toast.success("O'chirildi!");
    subscriptions.value = subscriptions.value.filter((s) => s._id !== id);
  } catch (e) {
    toast.error("O'chirishda xatolik!");
    console.error(e);
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  resetForm();
  showModal.value = true;
};

const openEditModal = (sub) => {
  isEditMode.value = true;
  editingId.value = sub._id;
  newSubscription.value = {
    name: sub.name,
    price: sub.price,
    website: sub.website || '',
    startDate: new Date(sub.startDate).toISOString().split("T")[0],
    endDate: new Date(sub.endDate).toISOString().split("T")[0],
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  newSubscription.value = { name: '', price: 0, website: '', startDate: '', endDate: '' };
  editingId.value = null;
};

const searchSubscriptions = () => {
  if (!search.value) return fetchSubscriptions();
  const q = search.value.toLowerCase();
  subscriptions.value = subscriptions.value.filter(s => s.name.toLowerCase().includes(q));
};

// Utility functions
const calculateRemainingDays = (endDate) => {
  const now = Date.now();
  return Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
};

const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString();

const getCardBgColor = (endDate) => {
  const days = calculateRemainingDays(endDate);
  if (days < 10) return 'bg-red-200';
  if (days < 15) return 'bg-yellow-200';
  return 'bg-green-200';
};

const getTextColor = (endDate) => {
  const days = calculateRemainingDays(endDate);
  if (days < 10) return 'text-red-600';
  if (days < 15) return 'text-yellow-600';
  return 'text-green-600';
};

onMounted(() => {
  token.value = JSON.parse(localStorage.getItem('token'));
  fetchSubscriptions();
});
</script>
