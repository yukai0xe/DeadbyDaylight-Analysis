<template>
    <DBDNavbar></DBDNavbar>
    <div class="main-container">
        <slot />
    </div>
</template>

<script setup>
import DBDNavbar from "@/components/Navbar/DBDNavbar.vue";
</script>