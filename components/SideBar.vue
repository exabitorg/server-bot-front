<template>
  <div class="h-full px-3 pb-4 overflow-y-auto">
    <ul class="space-y-2 font-medium">
      <li v-for="item in data" v-bind:key="item.id">
        <NuxtLink
          v-if="item.user !== admin"
          :to="item.link"
          class="flex mb-1 items-center p-2 rounded-lg hover:bg-neutral-400 group transition"
          active-class="bg-neutral-300"
          @click="toggleSidebar"
        >
          <img :src="`/images/${item.icon}`" >
          <span class="ms-3">{{ item.name }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
  const props = defineProps(['admin']);

  const data = [
    {
      id: 1,
      name: "Foydalanuvchilar",
      link: "/users",
      icon: "user.svg",
      user: false
    },
    {
      id: 2,
      name: "Servelar",
      link: "/servers",
      icon: "server.svg"
    },
    {
      id: 3,
      name: "Domainlar",
      link: "/domains",
      icon: "domain.svg"
    },
    {
      id: 4,
      name: "SMS",
      link: "/sms",
      icon: "sms.svg"
    },
    {
      id: 5,
      name: "Akkauntlar",
      link: "/accounts",
      icon: "account.svg",
      user: false
    },
    {
      id: 6,
      name: "Obunalar",
      link: "/subscriptions",
      icon: "subscription.svg",
      user: false
    },
    {
      id: 7,
      name: "Settings",
      link: "/settings",
      icon: "settings.svg",
      user: false
    }
  ]
</script>
