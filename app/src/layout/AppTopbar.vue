<script setup>
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle, toggleDarkMode, isDarkTheme } = useLayout();

// Ścieżki do logo w trybie jasnym i ciemnym
const lightLogo = 'https://galeon.pl/wp-content/themes/galeon/_/img/logo.png';
const darkLogo = 'https://galeon.pl/wp-content/themes/galeon/_/img/logo.png';
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="onMenuToggle">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <!-- Dynamiczne logo -->
                <img src="https://galeon.pl/wp-content/themes/galeon/_/img/logo.png" alt="Logo" class="w-auto h-7 invert dark:invert-0"  />
                <!-- Tekst pod logo -->
                <span class="layout-topbar-logo-text">OmniGaleon</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <!-- Przycisk zmiany trybu jasny/ciemny -->
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<style>
/* Stylizacja kontenera logo */
.layout-topbar-logo-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

/* Stylizacja linku z logo */
.layout-topbar-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

/* Obrazek logo */
.layout-topbar-logo-img {
    max-width: 100px;
    margin-bottom: 0.5rem; /* Odstęp między logo a tekstem */
}

/* Tekst pod logo */
.layout-topbar-logo-text {
    font-size: 1rem;
    font-weight: bold;
}
</style>
