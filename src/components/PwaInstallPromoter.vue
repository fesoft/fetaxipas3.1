<template>
  <div v-if="showInstallPromotion" class="pwa-install-banner q-pa-md">
    <q-banner class="bg-primary text-white">
      <template v-slot:avatar>
        <q-icon name="install_mobile" color="white" />
      </template>
      
      Instale nosso aplicativo para uma melhor experiência!
      
      <template v-slot:action>
        <q-btn 
          flat 
          color="white" 
          label="Instalar" 
          @click="installPWA" 
        />
        <q-btn 
          flat 
          color="white" 
          label="Fechar" 
          @click="dismissPrompt" 
        />
      </template>
    </q-banner>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const showInstallPromotion = ref(false)
    const deferredPrompt = ref(null)

    const isRunningAsPWA = () => {
      return window.matchMedia('(display-mode: standalone)').matches || 
             window.navigator.standalone ||
             window.matchMedia('(display-mode: fullscreen)').matches
    }

    onMounted(() => {
      // Só mostra se não for PWA já instalado
      if (!isRunningAsPWA()) {
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault()
          deferredPrompt.value = e
          showInstallPromotion.value = true
        })
      }
    })

    const installPWA = async () => {
      if (deferredPrompt.value) {
        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        if (outcome === 'accepted') {
          console.log('Usuário aceitou a instalação')
        }
        deferredPrompt.value = null
        showInstallPromotion.value = false
      }
    }

    const dismissPrompt = () => {
      showInstallPromotion.value = false
      // Opcional: Armazenar no localStorage para não mostrar novamente
      localStorage.setItem('pwaInstallDismissed', 'true')
    }

    return {
      showInstallPromotion,
      installPWA,
      dismissPrompt
    }
  }
}
</script>

<style scoped>
.pwa-install-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
</style>