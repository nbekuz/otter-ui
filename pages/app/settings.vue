<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <!-- Header -->
    <div class="px-4 pt-14 pb-4" :class="isDarkTheme ? 'bg-[#171a21] border-b border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-sber-black">Настройки</h1>
        <button class="text-sm font-semibold text-red-500" @click="showLogout = true">
          Выйти
        </button>
      </div>
    </div>

    <!-- Profile section -->
    <button
      class="mx-4 mt-4 w-[calc(100%-2rem)] rounded-2xl p-4 text-left"
      :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'"
      @click="navigateTo('/app/profile')"
    >
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-16 h-16 rounded-full overflow-hidden"
               :class="authStore.user?.isPremium ? 'ring-2 ring-yellow-400 ring-offset-2' : ''">
            <div v-if="!authStore.user?.avatar"
                 class="w-full h-full bg-sber-green flex items-center justify-center">
              <span class="text-white text-2xl font-bold">
                {{ authStore.user?.name?.[0]?.toUpperCase() || 'A' }}
              </span>
            </div>
            <img v-else :src="authStore.user.avatar" class="w-full h-full object-cover" />
          </div>
          <div class="absolute bottom-0 right-0 w-5 h-5 bg-sber-green rounded-full
                      flex items-center justify-center">
            <Camera class="w-3 h-3 text-white" />
          </div>
        </div>

        <!-- User info -->
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <p class="text-base font-bold text-sber-black">{{ authStore.user?.name }}</p>
            <span v-if="authStore.user?.isPremium"
                  class="text-[10px] font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
              ⭐ ПРЕМИУМ
            </span>
          </div>
          <p class="text-sm text-sber-gray">{{ authStore.user?.email }}</p>
          <p v-if="authStore.user?.isPremium && premiumExpiresLabel" class="mt-1 text-xs font-medium text-yellow-700">
            Срок до {{ premiumExpiresLabel }}
          </p>
        </div>
        <ChevronRight class="w-5 h-5 text-sber-gray-mid flex-shrink-0" />
      </div>
    </button>

    <!-- Account section -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Аккаунт</p>

      <SettingsSettingsRow label="Имя" :value="profileFullNameDisplay" @click="openNameModal">
        <template #icon><User class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Аватар" @click="openAvatarModal">
        <template #icon><Camera class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Профиль" @click="navigateTo('/app/profile')">
        <template #icon><Info class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Пароль" @click="passwordModal = true">
        <template #icon><Lock class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Устройства" @click="runStubAction">
        <template #icon><Smartphone class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Премиум" label-class="text-yellow-600" @click="premiumModal = true">
        <template #icon><Crown class="w-5 h-5 text-yellow-500 mr-3" /></template>
      </SettingsSettingsRow>
    </div>

    <!-- Premium highlight -->
    <div class="mx-4 mt-4 rounded-2xl border p-4 shadow-sm" :class="isDarkTheme ? 'border-yellow-500/30 bg-[#171a21]' : 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50'">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase tracking-wide text-yellow-600">Premium</p>
          <p class="mt-1 text-sm font-semibold text-sber-black">
            {{ authStore.user?.isPremium ? 'Premium активен' : 'Расширьте возможности приложения' }}
          </p>
          <p class="mt-1 text-xs text-sber-gray">
            {{ authStore.user?.isPremium ? 'Синхронизация, расширенная статистика и дополнительные инструменты уже доступны.' : 'Подключите Premium для расширенной статистики и синхронизации.' }}
          </p>
        </div>
        <button
          class="rounded-xl px-3 py-2 text-sm font-semibold text-white transition-colors"
          :class="authStore.user?.isPremium ? 'bg-yellow-500/70' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'"
          @click="premiumModal = true"
        >
          {{ authStore.user?.isPremium ? 'Управлять' : 'Подключить Premium' }}
        </button>
      </div>
    </div>

    <!-- Bottom menu customization -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Нижнее меню</p>
      <p class="px-4 pb-2 text-xs text-sber-gray">Включайте вкладки и меняйте порядок перетаскиванием.</p>
      <div
        v-for="item in orderedBottomMenuItems"
        :key="item.id"
        class="flex items-center gap-3 px-4 py-3 border-b border-sber-gray-light last:border-0"
        draggable="true"
        @dragstart="onBottomMenuDragStart(item.id)"
        @dragover.prevent
        @drop="onBottomMenuDrop(item.id)"
      >
        <GripVertical class="w-4 h-4 text-sber-gray cursor-grab" />
        <component :is="item.icon" class="w-5 h-5 text-sber-gray" />
        <span class="text-sm font-medium text-sber-black flex-1">{{ item.label }}</span>
        <button
          class="w-12 h-6 rounded-full transition-colors relative"
          :class="isBottomMenuEnabled(item.id) ? 'bg-sber-green' : 'bg-sber-gray-mid'"
          @click="toggleBottomMenuItem(item.id)"
        >
          <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
               :class="isBottomMenuEnabled(item.id) ? 'translate-x-7' : 'translate-x-1'" />
        </button>
      </div>
    </div>

    <!-- App settings -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Приложение</p>

      <div class="border-b border-sber-gray-light px-4 py-4">
        <div class="flex items-start gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl text-sber-black" :class="isDarkTheme ? 'bg-[#20242d]' : 'bg-sber-gray-light'">
            <Sun v-if="isDarkTheme" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm font-semibold text-sber-black">Переключение темы</p>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="isDarkTheme ? 'bg-sber-blue-light text-sber-blue' : 'bg-sber-green-light text-sber-green'"
              >
                {{ isDarkTheme ? 'Dark' : 'Light' }}
              </span>
            </div>
            <p class="mt-1 text-xs leading-5 text-sber-gray">
              Интерфейс переключается мгновенно и сохраняет выбранное оформление.
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                @click="toggleTheme"
                class="group relative overflow-hidden rounded-2xl border border-sber-gray-light p-2 text-sber-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
                :class="isDarkTheme ? 'bg-[#20242d]' : 'bg-white'"
              >
                <span class="absolute inset-0 bg-gradient-to-r from-sber-blue-light/70 to-sber-green-light/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span class="relative block transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Sun v-if="isDarkTheme" class="h-4 w-4" />
                  <Moon v-else class="h-4 w-4" />
                </span>
              </button>

              <button
                type="button"
                @click="setTheme('light')"
                class="rounded-xl px-3 py-2 text-sm font-medium transition-colors"
                :class="!isDarkTheme ? 'bg-sber-green text-white' : 'bg-[#20242d] text-slate-300'"
              >
                Светлая
              </button>

              <button
                type="button"
                @click="setTheme('dark')"
                class="rounded-xl px-3 py-2 text-sm font-medium transition-colors"
                :class="isDarkTheme ? 'bg-sber-blue text-white' : 'bg-sber-gray-light text-sber-gray'"
              >
                Тёмная
              </button>
            </div>
          </div>
        </div>
      </div>

      <SettingsSettingsRow label="Вид" @click="runStubAction">
        <template #icon><EyeOff class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Дата и время" @click="runStubAction">
        <template #icon><Clock class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Интеграции и импорт" @click="runStubAction">
        <template #icon><Download class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Рекомендовать друзьям" @click="shareApp">
        <template #icon><Share2 class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
    </div>

    <!-- Sound & Notifications -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Звуки и уведомления</p>

      <!-- Notifications toggle -->
      <div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light">
        <Bell class="w-5 h-5 text-sber-gray mr-3" />
        <span class="text-sm font-medium text-sber-black flex-1">Уведомления</span>
        <button class="w-12 h-6 rounded-full transition-colors relative"
                :class="settingsStore.appSettings.notifications ? 'bg-sber-green' : 'bg-sber-gray-mid'"
                @click="settingsStore.updateSettings({ notifications: !settingsStore.appSettings.notifications })">
          <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
               :class="settingsStore.appSettings.notifications ? 'translate-x-7' : 'translate-x-1'" />
        </button>
      </div>

      <!-- Vibration toggle -->
      <div class="flex items-center px-4 py-3.5 border-b border-sber-gray-light">
        <Vibrate class="w-5 h-5 text-sber-gray mr-3" />
        <span class="text-sm font-medium text-sber-black flex-1">Вибрация</span>
        <button class="w-12 h-6 rounded-full transition-colors relative"
                :class="settingsStore.appSettings.vibration ? 'bg-sber-green' : 'bg-sber-gray-mid'"
                @click="settingsStore.updateSettings({ vibration: !settingsStore.appSettings.vibration })">
          <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
               :class="settingsStore.appSettings.vibration ? 'translate-x-7' : 'translate-x-1'" />
        </button>
      </div>

      <SettingsSettingsRow label="Звук уведомления" :value="getSound(settingsStore.appSettings.notificationSound)" @click="soundModal = 'notification'">
        <template #icon><Volume2 class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Звук подтверждения" :value="getSound(settingsStore.appSettings.completionSound)" @click="soundModal = 'completion'">
        <template #icon><CheckCircle class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
    </div>

    <!-- Visible groups -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Разделы списка</p>
      <div v-for="group in taskGroups" :key="group.id"
           class="flex items-center px-4 py-3 border-b border-sber-gray-light last:border-0">
        <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: group.color }" />
        <span class="text-sm font-medium text-sber-black flex-1">{{ group.label }}</span>
        <button class="w-12 h-6 rounded-full transition-colors relative"
                :class="settingsStore.isGroupVisible(group.id) ? 'bg-sber-green' : 'bg-sber-gray-mid'"
                @click="settingsStore.toggleGroup(group.id)">
          <div class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
               :class="settingsStore.isGroupVisible(group.id) ? 'translate-x-7' : 'translate-x-1'" />
        </button>
      </div>
    </div>

    <!-- General / About -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <!-- <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Общее</p> -->
      <SettingsSettingsRow label="Язык" :value="selectedLanguageLabel" @click="languageModal = true">
        <template #icon><Globe class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Центр помощи" @click="helpModal = true">
        <template #icon><HelpCircle class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="Написать нам" @click="contactModal = true">
        <template #icon><MessageSquareText class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
      <SettingsSettingsRow label="О приложении" @click="aboutModal = true">
        <template #icon><Info class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsSettingsRow>
    </div>

    <div class="h-8" />

    <!-- ─── Modals ─────────────────────────────────────────────────────────── -->

    <!-- Name modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="nameModal" class="overlay" @click="closeNameModal" /></Transition>
      <Transition name="modal">
        <div v-if="nameModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-4">Имя и фамилия</h3>
          <label class="mb-2 block text-sm font-medium text-sber-gray">Имя</label>
          <input
            v-model="editFirstName"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': nameErrors.first }"
            placeholder="Имя"
            @input="nameErrors.first = ''"
          />
          <p v-if="nameErrors.first" class="mb-3 ml-1 text-xs text-red-500">{{ nameErrors.first }}</p>
          <label class="mb-2 block text-sm font-medium text-sber-gray">Фамилия</label>
          <input
            v-model="editLastName"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': nameErrors.last }"
            placeholder="Фамилия"
            @input="nameErrors.last = ''"
          />
          <p v-if="nameErrors.last" class="mb-3 ml-1 text-xs text-red-500">{{ nameErrors.last }}</p>
          <button class="btn-primary mb-3 w-full" :disabled="nameSaving" @click="saveName">
            {{ nameSaving ? 'Сохранение…' : 'Сохранить' }}
          </button>
          <button class="btn-secondary w-full" :disabled="nameSaving" @click="closeNameModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Password modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="passwordModal" class="overlay" @click="closePasswordModal" /></Transition>
      <Transition name="modal">
        <div v-if="passwordModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-2">Пароль</h3>
          <p class="mb-4 text-xs text-sber-gray">Новый: 8–20 символов, Aa + цифра + спецсимвол (!, @ …).</p>
          <input
            v-model="passwordForm.next"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': passwordErrors.next }"
            type="password"
            placeholder="Новый пароль"
            required
            @input="passwordErrors.next = ''"
          />
          <p v-if="passwordErrors.next" class="mb-3 ml-1 text-xs text-red-500">{{ passwordErrors.next }}</p>
          <input
            v-model="passwordForm.confirm"
            class="input-field mb-2"
            :class="{ 'border-red-400 bg-red-50': passwordErrors.confirm }"
            type="password"
            placeholder="Повторите новый пароль"
            required
            @input="passwordErrors.confirm = ''"
          />
          <p v-if="passwordErrors.confirm" class="mb-3 ml-1 text-xs text-red-500">{{ passwordErrors.confirm }}</p>
          <button class="btn-primary mb-3 w-full" :disabled="passwordSaving" @click="savePassword">
            {{ passwordSaving ? 'Сохранение…' : 'Сохранить' }}
          </button>
          <button class="btn-secondary w-full" :disabled="passwordSaving" @click="closePasswordModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Premium modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="premiumModal" class="overlay" @click="premiumModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="premiumModal" class="app-modal px-5 py-6" @click.stop>
          <div class="text-center mb-6">
            <div class="text-4xl mb-3">⭐</div>
            <h3 class="text-xl font-bold text-sber-black">Otter Premium</h3>
            <p class="text-sm text-sber-gray mt-1">Больше функций в приложении</p>
          </div>
          <p v-if="settingsStore.premiumFeaturesLoading" class="mb-4 text-center text-sm text-sber-gray">
            Загрузка возможностей…
          </p>
          <div v-else class="space-y-3 mb-6 max-h-48 overflow-y-auto">
            <div
              v-for="feat in settingsStore.premiumFeatures"
              :key="feat.key"
              class="flex items-center gap-3"
            >
              <div class="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                <Check class="w-3.5 h-3.5 text-yellow-600" />
              </div>
              <span class="text-sm text-sber-black">{{ feat.title }}</span>
            </div>
          </div>
          <button
            v-if="!authStore.user?.isPremium"
            class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-4 rounded-2xl active:opacity-90 disabled:opacity-60"
            type="button"
            :disabled="premiumCheckoutLoading"
            @click="purchasePremium"
          >
            {{ premiumCheckoutLoading ? 'Открываем оплату…' : 'Оплатить 299 ₽/месяц' }}
          </button>
          <button
            v-if="!authStore.user?.isPremium"
            class="btn-secondary mt-2 w-full"
            type="button"
            :disabled="premiumActivateLoading"
            @click="confirmPremiumPayment"
          >
            {{ premiumActivateLoading ? 'Активация…' : 'Я оплатил — активировать' }}
          </button>
          <p v-if="authStore.user?.isPremium" class="text-center text-sm font-semibold text-sber-green">
            Premium уже активен
          </p>
          <p class="text-center text-xs text-sber-gray mt-3">
            Оплата через Робокассу. После оплаты нажмите «Я оплатил — активировать».
          </p>
          <button class="btn-secondary mt-2 w-full" type="button" @click="premiumModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Sound selector -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="soundModal" class="overlay" @click="soundModal = null" /></Transition>
      <Transition name="modal">
        <div v-if="soundModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-4">
            {{ soundModal === 'notification' ? 'Звук уведомления' : 'Звук подтверждения' }}
          </h3>
          <div class="flex flex-col gap-2">
            <button v-for="s in soundOptions" :key="s.id"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"
                    :class="getCurrentSound(soundModal) === s.id
                      ? 'border-sber-green bg-sber-green-light'
                      : 'border-sber-gray-light'"
                    @click="setSound(soundModal, s.id)">
              <span class="text-xl">{{ s.icon }}</span>
              <span class="text-sm font-medium text-sber-black">{{ s.name }}</span>
              <Check v-if="getCurrentSound(soundModal) === s.id" class="w-4 h-4 text-sber-green ml-auto" />
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Language modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="languageModal" class="overlay" @click="languageModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="languageModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-4">Язык приложения</h3>
          <button
            v-for="lang in languages"
            :key="lang.id"
            class="mb-2 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors"
            :class="selectedLanguage === lang.id ? 'border-sber-green bg-sber-green-light' : 'border-sber-gray-light bg-white'"
            @click="setLanguage(lang.id)"
          >
            <span class="flex-1 text-sm font-medium text-sber-black">{{ lang.label }}</span>
            <Check v-if="selectedLanguage === lang.id" class="w-4 h-4 text-sber-green" />
          </button>
          <button class="btn-secondary mt-3" @click="languageModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Help modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="helpModal" class="overlay" @click="helpModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="helpModal" class="app-modal px-5 py-5" style="max-height: 85dvh; overflow-y: auto;" @click.stop>
          <h3 class="text-lg font-bold mb-1">Центр помощи</h3>
          <div class="relative mb-4">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sber-gray" />
            <input v-model="faqSearch" placeholder="Поиск по вопросам..." class="input-field pl-11 py-3 text-sm" />
          </div>
          <p v-if="settingsStore.helpFaqLoading" class="py-6 text-center text-sm text-sber-gray">
            Загрузка…
          </p>
          <p v-else-if="settingsStore.helpFaqError" class="py-4 text-center text-sm text-red-500">
            {{ settingsStore.helpFaqError }}
          </p>
          <button
            v-if="settingsStore.helpFaqError"
            class="btn-secondary mb-4 w-full"
            type="button"
            @click="loadHelpFaq"
          >
            Повторить
          </button>
          <p v-else-if="filteredFaq.length === 0" class="py-6 text-center text-sm text-sber-gray">
            Вопросы не найдены
          </p>
          <div v-for="faq in filteredFaq" :key="faq.id" class="mb-3">
            <button class="w-full text-left" @click="faq.open = !faq.open">
              <div class="flex items-start justify-between gap-2 py-2">
                <span class="text-sm font-semibold text-sber-black">{{ faq.question }}</span>
                <ChevronDown class="w-4 h-4 text-sber-gray flex-shrink-0 mt-0.5"
                             :class="faq.open ? 'rotate-180' : ''" />
              </div>
            </button>
            <Transition name="slide-down">
              <p v-if="faq.open" class="text-sm text-sber-gray pb-2 leading-relaxed">{{ faq.answer }}</p>
            </Transition>
            <div class="h-px bg-sber-gray-light" />
          </div>
          <button class="btn-primary mt-4" @click="openContactFromHelp">Связаться с нами</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Contact modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="contactModal" class="overlay" @click="contactModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="contactModal" class="app-modal px-5 py-5" style="max-height: 85dvh; overflow-y: auto;" @click.stop>
          <h3 class="text-lg font-bold mb-1">Написать нам</h3>
          <p class="text-sm text-sber-gray mb-3">Опишите проблему или идею, можно добавить скриншот.</p>
          <textarea
            v-model="contactMessage"
            class="input-field min-h-[120px] mb-3 resize-none"
            placeholder="Ваше сообщение..."
          />
          <input ref="contactScreenshotInputRef" type="file" accept="image/*" class="hidden" @change="handleContactScreenshotChange">
          <button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl mb-3" @click="contactScreenshotInputRef?.click()">
            <Image class="w-5 h-5 text-sber-gray" />
            <span class="text-sm text-sber-black">Добавить скриншот</span>
          </button>
          <div v-if="contactScreenshotName" class="mb-3 rounded-xl bg-sber-gray-light px-3 py-2 text-xs text-sber-gray">
            Прикреплено: {{ contactScreenshotName }}
          </div>
          <button class="btn-primary" type="button" :disabled="contactSending" @click="sendContactMessage">
            {{ contactSending ? 'Отправка…' : 'Отправить' }}
          </button>
          <button class="btn-secondary mt-3" @click="contactModal = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <!-- About modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="aboutModal" class="overlay" @click="aboutModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="aboutModal" class="app-modal px-5 py-5" @click.stop>
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sber-green to-sber-blue mx-auto mb-3
                        flex items-center justify-center">
              <span class="text-white font-bold text-2xl">🦦</span>
            </div>
            <h3 class="text-lg font-bold">Otter</h3>
            <p class="text-sm text-sber-gray">Версия 1.0.0</p>
          </div>
          <div class="space-y-2">
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" @click="openStoreRating('rustore')">
              <Star class="w-4 h-4 text-sber-gray" />
              <span class="text-sm">Оценить в RuStore</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" @click="openStoreRating('google')">
              <Star class="w-4 h-4 text-sber-gray" />
              <span class="text-sm">Оценить в Google Play</span>
            </button>
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" type="button" @click="openLegalModal">
              <Info class="w-4 h-4 text-sber-gray" />
              <span class="text-sm">Лицензии и информация</span>
            </button>
          </div>
          <button class="btn-secondary mt-4" @click="aboutModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Legal documents -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="legalModal" class="overlay" @click="legalModal = false" /></Transition>
      <Transition name="modal">
        <div
          v-if="legalModal"
          class="app-modal px-5 py-5"
          style="max-height: 85dvh; overflow-y: auto;"
          @click.stop
        >
          <h3 class="text-lg font-bold mb-3">Юридические документы</h3>
          <p v-if="settingsStore.legalDocumentsLoading" class="py-6 text-center text-sm text-sber-gray">
            Загрузка…
          </p>
          <p v-else-if="settingsStore.legalDocumentsError" class="py-4 text-center text-sm text-red-500">
            {{ settingsStore.legalDocumentsError }}
          </p>
          <button
            v-if="settingsStore.legalDocumentsError"
            class="btn-secondary mb-4 w-full"
            type="button"
            @click="loadLegalDocuments"
          >
            Повторить
          </button>
          <template v-else-if="selectedLegalDoc">
            <button class="mb-3 text-sm font-semibold text-sber-green" type="button" @click="selectedLegalDoc = null">
              ← Назад к списку
            </button>
            <h4 class="text-base font-bold text-sber-black mb-2">{{ selectedLegalDoc.title }}</h4>
            <p class="whitespace-pre-wrap text-sm leading-relaxed text-sber-gray">{{ selectedLegalDoc.content }}</p>
          </template>
          <div v-else class="space-y-2">
            <button
              v-for="doc in settingsStore.legalDocuments"
              :key="doc.doc_type"
              class="flex w-full items-center gap-3 rounded-2xl bg-sber-gray-light px-4 py-3 text-left"
              type="button"
              @click="selectedLegalDoc = doc"
            >
              <Info class="h-4 w-4 text-sber-gray" />
              <span class="text-sm text-sber-black">{{ doc.title }}</span>
              <ChevronRight class="ml-auto h-4 w-4 text-sber-gray" />
            </button>
          </div>
          <button class="btn-secondary mt-4 w-full" type="button" @click="legalModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Logout confirm -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="showLogout" class="overlay" @click="showLogout = false" /></Transition>
      <Transition name="modal">
        <div v-if="showLogout" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold text-center mb-2">Выйти из профиля?</h3>
          <p class="text-sm text-sber-gray text-center mb-6">Вы сможете войти снова в любое время.</p>
          <button class="w-full bg-red-500 text-white font-semibold py-4 rounded-2xl mb-3" @click="authStore.logout()">
            Выйти
          </button>
          <button class="btn-secondary" @click="showLogout = false">Отмена</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Coming soon toast -->
    <Teleport to="body">
      <Transition name="fade-notification">
        <div v-if="comingSoonVisible"
             class="fixed top-20 left-1/2 -translate-x-1/2 bg-sber-black text-white
                    px-5 py-3 rounded-2xl text-sm font-medium z-50 shadow-lg text-center">
          Уже разрабатываем, скоро будет готово 😊
        </div>
      </Transition>
    </Teleport>

    <!-- Avatar modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="avatarModal" class="overlay" @click="closeAvatarModal" /></Transition>
      <Transition name="modal">
        <div v-if="avatarModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-4">Фото профиля</h3>
          <p v-if="avatarSettingsError" class="mb-3 text-xs text-red-500">{{ avatarSettingsError }}</p>
          <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarFileChange">
          <button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2"
                  @click="avatarInputRef?.click()">
            <Image class="w-5 h-5 text-sber-gray" /> Выбрать изображение
          </button>
          <button class="mb-3 w-full rounded-2xl bg-sber-gray-light px-4 py-4" type="button" @click="onClearAvatarTap">
            <span class="flex items-center gap-3 text-sber-black">
              <Camera class="h-5 w-5 text-sber-gray" /> Удалить аватар
            </span>
          </button>
          <button class="btn-secondary" @click="closeAvatarModal">Отмена</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Bell, Vibrate, Volume2, CheckCircle, Camera, Image, Globe,
  HelpCircle, Info, Star, Check, ChevronDown, ChevronRight, Search, User, Lock,
  EyeOff, Clock, Download, Share2, Smartphone, Crown, GripVertical, MessageSquareText,
  CheckSquare, Calendar, Grid2x2, Timer, Settings
} from 'lucide-vue-next'
import { Moon, Sun } from 'lucide-vue-next'
import { soundOptions } from '~/data/mockData'
import type { ApiLegalDocument } from '~/types/mobile-api'
import { getApiErrorMessage } from '~/utils/api'
import { validateNewPassword } from '~/utils/password-policy'

definePageMeta({ layout: 'app' })

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const { showToast } = useAppToast()

const nameModal = ref(false)
const passwordModal = ref(false)
const premiumModal = ref(false)
const soundModal = ref<string | null>(null)
const languageModal = ref(false)
const helpModal = ref(false)
const contactModal = ref(false)
const aboutModal = ref(false)
const legalModal = ref(false)
const selectedLegalDoc = ref<ApiLegalDocument | null>(null)
const premiumCheckoutLoading = ref(false)
const premiumActivateLoading = ref(false)
const contactSending = ref(false)
const contactScreenshotFile = ref<File | null>(null)
const avatarModal = ref(false)
const avatarSettingsError = ref('')
const avatarInputRef = ref<HTMLInputElement | null>(null)
const contactScreenshotInputRef = ref<HTMLInputElement | null>(null)
const showLogout = ref(false)
const comingSoonVisible = ref(false)
const editFirstName = ref('')
const editLastName = ref('')
const nameErrors = reactive({ first: '', last: '' })
const nameSaving = ref(false)
const passwordSaving = ref(false)
const selectedLanguage = ref(settingsStore.appSettings.language || 'ru')
const draggedBottomMenuId = ref<string | null>(null)
const contactMessage = ref('')
const contactScreenshotName = ref('')
const passwordForm = reactive({
  next: '',
  confirm: '',
})
const passwordErrors = reactive({
  next: '',
  confirm: '',
})
const faqSearch = ref('')

const languages = [
  { id: 'ru', label: 'Русский' },
]

const bottomMenuCatalog = [
  { id: 'tasks', label: 'Задачи', icon: CheckSquare },
  { id: 'calendar', label: 'Календарь', icon: Calendar },
  { id: 'matrix', label: 'Матрица', icon: Grid2x2 },
  { id: 'pomodoro', label: 'Помодоро', icon: Timer },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

const orderedBottomMenuItems = computed(() => {
  const enabled = settingsStore.appSettings.bottomNavItems || []
  const byId = new Map(bottomMenuCatalog.map(item => [item.id, item]))
  const ordered = enabled.map(id => byId.get(id)).filter(Boolean)
  const rest = bottomMenuCatalog.filter(item => !enabled.includes(item.id))
  return [...ordered, ...rest] as typeof bottomMenuCatalog
})

const selectedLanguageLabel = computed(() =>
  languages.find(l => l.id === selectedLanguage.value)?.label || 'Русский'
)

const filteredFaq = computed(() => {
  const items = settingsStore.helpFaq
  if (!faqSearch.value.trim()) return items
  const q = faqSearch.value.trim().toLowerCase()
  return items.filter(f =>
    f.question.toLowerCase().includes(q)
    || f.answer.toLowerCase().includes(q),
  )
})

async function loadHelpFaq() {
  await settingsStore.fetchHelpFaq()
}

watch(helpModal, (open) => {
  if (open) void loadHelpFaq()
})

const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const profileFullNameDisplay = computed(() => {
  const raw = `${authStore.profileFirstName || ''} ${authStore.profileLastName || ''}`.trim()
  return raw || authStore.user?.name || '—'
})

const premiumExpiresLabel = computed(() => {
  const expiresAt = authStore.user?.premiumExpiresAt
  if (!expiresAt) return ''

  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

const taskGroups = [
  { id: 'overdue', label: 'Просрочено', color: '#FF3B30' },
  { id: 'today', label: 'Сегодня', color: '#FF9500' },
  { id: 'tomorrow', label: 'Завтра', color: '#007AFF' },
  { id: 'later', label: 'Позже', color: '#AF52DE' },
  { id: 'nodate', label: 'Без срока', color: '#8E8E93' },
  { id: 'completed', label: 'Готово', color: '#21A038' },
]

function showComingSoon() {
  comingSoonVisible.value = true
  setTimeout(() => { comingSoonVisible.value = false }, 2500)
}

function openAvatarModal() {
  avatarSettingsError.value = ''
  avatarModal.value = true
}

function closeAvatarModal() {
  avatarSettingsError.value = ''
  avatarModal.value = false
}

function shareApp() {
  if (navigator.share) {
    navigator.share({ title: 'Otter - Планировщик', url: window.location.origin })
  } else {
    showComingSoon()
  }
}

function openStoreRating(store: 'rustore' | 'google') {
  const urls = {
    rustore: 'https://www.rustore.ru/',
    google: 'https://play.google.com/store',
  }
  window.open(urls[store], '_blank')
}

function toggleTheme() {
  settingsStore.updateSettings({
    theme: isDarkTheme.value ? 'light' : 'dark',
  })
}

function setTheme(theme: 'light' | 'dark') {
  settingsStore.updateSettings({ theme })
}

function openNameModal() {
  nameErrors.first = ''
  nameErrors.last = ''
  editFirstName.value = authStore.profileFirstName.trim()
  editLastName.value = authStore.profileLastName.trim()
  if ((!editFirstName.value || !editLastName.value) && authStore.user?.name?.trim()) {
    const parts = authStore.user.name.trim().split(/\s+/).filter(Boolean)
    if (!editFirstName.value) editFirstName.value = parts[0] || ''
    if (!editLastName.value) editLastName.value = parts.slice(1).join(' ')
  }
  nameModal.value = true
}

async function saveName() {
  nameErrors.first = ''
  nameErrors.last = ''
  const first = editFirstName.value.trim()
  const last = editLastName.value.trim()
  let ok = true
  if (!first) {
    nameErrors.first = 'Введите имя'
    ok = false
  }
  if (!last) {
    nameErrors.last = 'Введите фамилию'
    ok = false
  }
  if (!ok || nameSaving.value) return

  nameSaving.value = true
  try {
    await authStore.updateProfile(first, last)
    closeNameModal()
  }
  catch (err: any) {
    const payload = err?.response?.data
    const f = Array.isArray(payload?.first_name) ? payload.first_name.join(' ') : ''
    const l = Array.isArray(payload?.last_name) ? payload.last_name.join(' ') : ''
    const detail = typeof payload?.detail === 'string' ? payload.detail : ''
    if (f) nameErrors.first = f
    if (l) nameErrors.last = l
    if (!f && !l && detail)
      nameErrors.first = detail
    if (!f && !l && !detail)
      nameErrors.first = 'Не удалось сохранить'
  }
  finally {
    nameSaving.value = false
  }
}

function closeNameModal() {
  nameErrors.first = ''
  nameErrors.last = ''
  nameModal.value = false
}

async function savePassword() {
  passwordErrors.next = ''
  passwordErrors.confirm = ''

  const nextRule = validateNewPassword(passwordForm.next)
  if (nextRule) {
    passwordErrors.next = nextRule
  }

  if (passwordForm.next !== passwordForm.confirm) {
    passwordErrors.confirm = 'Пароли не совпадают'
  }

  if (passwordErrors.next || passwordErrors.confirm) return

  passwordSaving.value = true
  try {
    const result = await authStore.changePassword(passwordForm.next.trim())
    closePasswordModal()
    const { showToast } = useAppToast()
    const msg = typeof result?.detail === 'string' ? result.detail : 'Пароль обновлён'
    showToast(msg, 'success')
  }
  catch (err: any) {
    const payload = err?.response?.data
    const detail = typeof payload?.detail === 'string' ? payload.detail : ''
    const np = Array.isArray(payload?.new_password) ? payload.new_password.join(' ') : ''
    if (np) {
      passwordErrors.next = np
    }
    else if (detail) {
      passwordErrors.next = detail
    }
    else {
      passwordErrors.next = 'Не удалось сменить пароль. Проверьте подключение к API (profile/change-password/).'
    }
  }
  finally {
    passwordSaving.value = false
  }
}

function closePasswordModal() {
  passwordForm.next = ''
  passwordForm.confirm = ''
  passwordErrors.next = ''
  passwordErrors.confirm = ''
  passwordModal.value = false
}

async function runStubAction() {
  try {
    const detail = await settingsStore.callStubAction()
    showToast(detail, 'success')
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
}

async function loadLegalDocuments() {
  await settingsStore.fetchLegalDocuments()
}

function openLegalModal() {
  aboutModal.value = false
  selectedLegalDoc.value = null
  legalModal.value = true
  void loadLegalDocuments()
}

watch(premiumModal, (open) => {
  if (open) void settingsStore.fetchPremiumFeatures()
})

async function purchasePremium() {
  premiumCheckoutLoading.value = true
  try {
    const { checkout_url } = await authStore.startPremiumCheckout()
    window.open(checkout_url, '_blank', 'noopener,noreferrer')
    showToast('Откройте вкладку оплаты. После оплаты нажмите «Я оплатил — активировать».', 'success', 6000)
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
  finally {
    premiumCheckoutLoading.value = false
  }
}

async function confirmPremiumPayment() {
  premiumActivateLoading.value = true
  try {
    await authStore.activatePremium()
    showToast('Premium активирован', 'success')
    premiumModal.value = false
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
  finally {
    premiumActivateLoading.value = false
  }
}

function getSound(soundId: string) {
  return soundOptions.find(s => s.id === soundId)?.name || ''
}

function getCurrentSound(modal: string | null) {
  if (modal === 'notification') return settingsStore.appSettings.notificationSound
  return settingsStore.appSettings.completionSound
}

function setSound(modal: string | null, soundId: string) {
  if (modal === 'notification') {
    settingsStore.updateSettings({ notificationSound: soundId })
  } else {
    settingsStore.updateSettings({ completionSound: soundId })
  }
  soundModal.value = null
}

function setLanguage(languageId: string) {
  selectedLanguage.value = languageId
  settingsStore.updateSettings({ language: languageId })
  languageModal.value = false
}

function isBottomMenuEnabled(itemId: string) {
  return settingsStore.appSettings.bottomNavItems.includes(itemId)
}

function toggleBottomMenuItem(itemId: string) {
  const current = [...settingsStore.appSettings.bottomNavItems]
  if (current.includes(itemId)) {
    if (current.length <= 2) {
      showComingSoon()
      return
    }
    settingsStore.reorderNavItems(current.filter(id => id !== itemId))
    return
  }
  current.push(itemId)
  settingsStore.reorderNavItems(current)
}

function onBottomMenuDragStart(itemId: string) {
  draggedBottomMenuId.value = itemId
}

function onBottomMenuDrop(targetItemId: string) {
  if (!draggedBottomMenuId.value || draggedBottomMenuId.value === targetItemId) return

  const current = [...settingsStore.appSettings.bottomNavItems]
  const fromIndex = current.indexOf(draggedBottomMenuId.value)
  const toIndex = current.indexOf(targetItemId)
  if (fromIndex === -1 || toIndex === -1) return

  const [moved] = current.splice(fromIndex, 1)
  current.splice(toIndex, 0, moved)
  settingsStore.reorderNavItems(current)
  draggedBottomMenuId.value = null
}

function openContactFromHelp() {
  helpModal.value = false
  contactModal.value = true
}

async function sendContactMessage() {
  if (!contactMessage.value.trim()) {
    showToast('Введите сообщение', 'error')
    return
  }
  contactSending.value = true
  try {
    await settingsStore.sendHelpMessage(
      contactMessage.value.trim(),
      contactScreenshotFile.value || undefined,
    )
    showToast('Сообщение отправлено', 'success')
    contactMessage.value = ''
    contactScreenshotName.value = ''
    contactScreenshotFile.value = null
    if (contactScreenshotInputRef.value) {
      contactScreenshotInputRef.value.value = ''
    }
    contactModal.value = false
  }
  catch (err) {
    showToast(getApiErrorMessage(err, 'Не удалось отправить сообщение'), 'error')
  }
  finally {
    contactSending.value = false
  }
}

function handleContactScreenshotChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  contactScreenshotFile.value = file
  contactScreenshotName.value = file.name
}

async function handleAvatarFileChange(event: Event) {
  avatarSettingsError.value = ''
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (input) input.value = ''
  if (!file || !file.type.startsWith('image/')) return

  let first = authStore.profileFirstName.trim()
  let last = authStore.profileLastName.trim()
  if ((!first || !last) && authStore.user?.name?.trim()) {
    const parts = authStore.user.name.trim().split(/\s+/).filter(Boolean)
    if (!first) first = parts[0] || ''
    if (!last) last = parts.slice(1).join(' ')
  }
  if (!first.trim()) {
    avatarSettingsError.value = 'Сначала укажите имя и фамилию в разделе «Имя».'
    return
  }
  if (!last.trim())
    last = first

  try {
    await authStore.updateProfile(first.trim(), last.trim(), file)
    closeAvatarModal()
  }
  catch (err: any) {
    const payload = err?.response?.data
    const av = Array.isArray(payload?.avatar) ? payload.avatar.join(' ') : ''
    const detail = typeof payload?.detail === 'string' ? payload.detail : ''
    avatarSettingsError.value = av || detail || 'Не удалось загрузить фото'
  }
}

function onClearAvatarTap() {
  closeAvatarModal()
  showComingSoon()
}
</script>


<style scoped>
.fade-notification-enter-active, .fade-notification-leave-active { transition: all 0.3s; }
.fade-notification-enter-from, .fade-notification-leave-to { opacity: 0; transform: translate(-50%, -10px); }
</style>
