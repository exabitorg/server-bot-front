<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-4xl font-bold text-gray-800">Boshqaruv Paneli</h1>
      <button
        @click="refreshDashboard"
        class="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Yangilash
      </button>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      <!-- Active Servers -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
        <div class="flex items-center space-x-4">
          <p class="text-xl font-semibold text-gray-800">Faol Serverlar</p>
        </div>
        <p class="text-3xl font-bold text-green-600">{{ servers.active.length }}</p>
        <p class="text-gray-500">15 kundan ko'proq muddat qolgani serverlar</p>
      </div>

      <!-- Expiring Servers -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
        <div class="flex items-center space-x-4">
          <p class="text-xl font-semibold text-gray-800">Tez orada tugaydiganlar</p>
        </div>
        <p class="text-3xl font-bold text-yellow-600">{{ servers.soon.length }}</p>
        <p class="text-gray-500">15 kundan kam muddat qolgani serverlar</p>
      </div>

      <!-- Inactive Servers -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
        <div class="flex items-center space-x-4">
          <p class="text-xl font-semibold text-gray-800">Muddati o'tgan Serverlar</p>
        </div>
        <p class="text-3xl font-bold text-red-600">{{ servers.inactive.length }}</p>
        <p class="text-gray-500">Muddat o‘tgan serverlar</p>
      </div>
    </div>

    <!-- Domains Section -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Active Domains -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
        <div class="flex items-center space-x-4">
          <p class="text-xl font-semibold text-gray-800">Faol Domenlar</p>
        </div>
        <p class="text-3xl font-bold text-green-600">{{ domains.active.length }}</p>
        <p class="text-gray-500">15 kundan ko'proq muddat qolgani domenlar</p>
      </div>

      <!-- Expiring Domains -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
        <div class="flex items-center space-x-4">
          <p class="text-xl font-semibold text-gray-800">Tez orada tugaydiganlar</p>
        </div>
        <p class="text-3xl font-bold text-yellow-600">{{ domains.soon.length }}</p>
        <p class="text-gray-500">15 kundan kam muddat qolgani domenlar</p>
      </div>

      <!-- Inactive Domains -->
      <div class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
        <div class="flex items-center space-x-4">
          <p class="text-xl font-semibold text-gray-800">Muddati o'tgan Domenlar</p>
        </div>
        <p class="text-3xl font-bold text-red-600">{{ domains.inactive.length }}</p>
        <p class="text-gray-500">Muddat o‘tgan domenlar</p>
      </div>
    </div>

    <!-- SMS Usage Section -->
    <div class="bg-white shadow-lg rounded-lg p-8 mt-8">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">SMS Foydalanish Ko‘rinishi</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- SMS Usage by Project -->
        <div v-for="(project, index) in smsUsage" :key="index" class="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-800">{{ project.name }}</h3>
            <span class="text-xl font-bold text-blue-600">{{ getSmsCountForCurrentMonth(project) }} SMS</span>
          </div>
          <p class="text-gray-500">Joriy oyda yuborilgan SMSlar</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const servers = ref({
  active: [],
  soon: [],
  inactive: [],
});

const domains = ref({
  active: [],
  soon: [],
  inactive: [],
});

const smsUsage = ref([]);

onMounted(() => {
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token) {
    navigateTo("/login");
  } else {
    loadDashboard(token);
  }
});

function getSmsCountForCurrentMonth(project) {
  const currentMonth = new Date().toISOString().slice(0, 7); // Get the current month in YYYY-MM format
  const monthlyData = project.monthlyCounts.find(
    (item) => item.month === currentMonth
  );
  return monthlyData ? monthlyData.count : 0; // If no data for the current month, return 0
}

async function loadDashboard(token) {
  try {
    const smsRes = await axios.get(`${config.public.url}/sms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    smsUsage.value = smsRes.data.data;

    const [serverRes, domainRes] = await Promise.all([
      axios.get(`${config.public.url}/servers`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${config.public.url}/domains`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const filteredServers = {
      active: [],
      soon: [],
      inactive: [],
    };
    serverRes.data.data.forEach((server) => {
      const endDate = new Date(server.endDate);
      const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 15) filteredServers.active.push(server);
      else if (daysLeft <= 15 && daysLeft > 0) filteredServers.soon.push(server);
      else filteredServers.inactive.push(server);
    });

    const filteredDomains = {
      active: [],
      soon: [],
      inactive: [],
    };
    domainRes.data.data.forEach((domain) => {
      const endDate = new Date(domain.endDate);
      const daysLeft = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft > 15) filteredDomains.active.push(domain);
      else if (daysLeft <= 15 && daysLeft > 0) filteredDomains.soon.push(domain);
      else filteredDomains.inactive.push(domain);
    });

    servers.value = filteredServers;
    domains.value = filteredDomains;
  } catch (error) {
    console.error(error);
  }
}

function refreshDashboard() {
  loadDashboard(JSON.parse(localStorage.getItem("token")));
}

</script>

<style scoped>
@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

.bg-white {
  border: 1px solid #e5e7eb; /* Light gray border for cleaner edges */
}

.shadow-lg {
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Softer shadow for a subtle effect */
}

.hover\:shadow-xl:hover {
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15); /* Enhanced hover shadow */
}

.transition {
  transition: all 0.3s ease-in-out; /* Smooth transition effect */
}

.text-gray-500 {
  color: #6b7280; /* Lighter text color for subheadings */
}

.text-xl {
  font-size: 1.25rem; /* Slightly larger font for headings */
}

.font-semibold {
  font-weight: 600; /* Better weight for headings */
}
</style>
