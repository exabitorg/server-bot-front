<template>
  <div class="p-2">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Sozlamalar</h1>

    <div class="flex border-b gap-4 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 font-medium',
          activeTab === tab
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-blue-500'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="activeTab === 'Providerlar'">
      <ProviderSettings />
    </div>

    <div v-if="activeTab === 'Xizmat turlari'" class="text-gray-500">
      <p>❗ Bu bo‘lim hozircha mavjud emas.</p>
    </div>

    <div v-if="activeTab === 'Foydalanuvchi rollari'" class="text-gray-500">
      <p>❗ Bu bo‘lim ham keyinchalik qo‘shiladi.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = ['Providerlar', ]
const activeTab = ref('Providerlar')
</script>
