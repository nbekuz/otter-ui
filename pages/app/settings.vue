<template>
  <div class="page-container" :class="isDarkTheme ? 'bg-[#0f1115]' : 'bg-sber-gray-light'">
    <!-- Header -->
    <div class="page-header-top px-4 pb-4" :class="isDarkTheme ? 'bg-[#171a21] border-b border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
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
               :class="premiumStore.isPremium ? 'ring-2 ring-yellow-400 ring-offset-2' : ''">
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
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <p class="truncate text-base font-bold text-sber-black">{{ authStore.user?.name }}</p>
            <span
              v-if="premiumStore.isPremium"
              class="shrink-0 text-base leading-none"
              title="Премиум"
              aria-label="Премиум"
            >⭐</span>
          </div>
          <p class="truncate text-sm text-sber-gray">{{ authStore.user?.email }}</p>
          <p v-if="premiumStore.isPremium && premiumExpiresLabel" class="mt-1 text-xs font-medium text-yellow-700">
            Срок до {{ premiumExpiresLabel }}
          </p>
          <button
            type="button"
            class="mt-3 w-full rounded-xl border px-3 py-2 text-left transition-colors"
            :class="isDarkTheme
              ? 'border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/15'
              : 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100'"
            @click.stop="premiumModal = true"
          >
            <p class="text-[10px] font-semibold uppercase tracking-wide text-yellow-600">Premium</p>
            <p class="mt-0.5 text-xs font-semibold text-sber-black">
              {{ premiumBannerTitle }}
            </p>
            <p v-if="premiumBannerSubtitle" class="mt-0.5 text-[11px] text-sber-gray">
              {{ premiumBannerSubtitle }}
            </p>
          </button>
        </div>
        <ChevronRight class="w-5 h-5 text-sber-gray-mid flex-shrink-0" />
      </div>
    </button>

    <!-- Account section -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Аккаунт</p>

      <SettingsRow label="Имя" :value="profileFullNameDisplay" @click="openNameModal">
        <template #icon><User class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Аватар" @click="openAvatarModal">
        <template #icon><Camera class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Профиль" @click="navigateTo('/app/profile')">
        <template #icon><Info class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Пароль" @click="passwordModal = true">
        <template #icon><Lock class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Устройства" @click="runStubAction">
        <template #icon><Smartphone class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Премиум" label-class="text-yellow-600" @click="premiumModal = true">
        <template #icon><Crown class="w-5 h-5 text-yellow-500 mr-3" /></template>
      </SettingsRow>
    </div>

    <!-- Bottom menu customization: fixed rows + CSS order (icons never remount on reorder) -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Нижнее меню</p>
      <p class="px-4 pb-2 text-xs text-sber-gray">Включайте вкладки и меняйте порядок перетаскиванием.</p>
      <div class="grid grid-cols-1">
        <div
          class="flex items-center gap-3 border-b border-sber-gray-light px-4 py-3"
          :class="draggedBottomMenuId === 'tasks' ? 'opacity-60' : ''"
          :style="{ order: bottomMenuOrder.tasks ?? 0 }"
          @dragover.prevent="onBottomMenuDragOver('tasks')"
          @drop.prevent="onBottomMenuDrop('tasks')"
        >
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-sber-gray active:cursor-grabbing"
            draggable="true"
            aria-label="Переместить"
            @dragstart="onBottomMenuDragStart($event, 'tasks')"
            @dragend="onBottomMenuDragEnd"
          >
            <GripVertical class="pointer-events-none h-4 w-4" />
          </button>
          <NavItemTasks mode="settings" class="pointer-events-none text-sber-gray" />
          <span class="pointer-events-none flex-1 text-sm font-medium text-sber-black">Задачи</span>
          <button
            class="relative h-6 w-12 rounded-full transition-colors"
            :class="isBottomMenuEnabled('tasks') ? 'bg-sber-green' : 'bg-sber-gray-mid'"
            @click="toggleBottomMenuItem('tasks')"
          >
            <div
              class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
              :class="isBottomMenuEnabled('tasks') ? 'translate-x-7' : 'translate-x-1'"
            />
          </button>
        </div>

        <div
          class="flex items-center gap-3 border-b border-sber-gray-light px-4 py-3"
          :class="draggedBottomMenuId === 'calendar' ? 'opacity-60' : ''"
          :style="{ order: bottomMenuOrder.calendar ?? 1 }"
          @dragover.prevent="onBottomMenuDragOver('calendar')"
          @drop.prevent="onBottomMenuDrop('calendar')"
        >
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-sber-gray active:cursor-grabbing"
            draggable="true"
            aria-label="Переместить"
            @dragstart="onBottomMenuDragStart($event, 'calendar')"
            @dragend="onBottomMenuDragEnd"
          >
            <GripVertical class="pointer-events-none h-4 w-4" />
          </button>
          <NavItemCalendar mode="settings" class="pointer-events-none text-sber-gray" />
          <span class="pointer-events-none flex-1 text-sm font-medium text-sber-black">Календарь</span>
          <button
            class="relative h-6 w-12 rounded-full transition-colors"
            :class="isBottomMenuEnabled('calendar') ? 'bg-sber-green' : 'bg-sber-gray-mid'"
            @click="toggleBottomMenuItem('calendar')"
          >
            <div
              class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
              :class="isBottomMenuEnabled('calendar') ? 'translate-x-7' : 'translate-x-1'"
            />
          </button>
        </div>

        <div
          class="flex items-center gap-3 border-b border-sber-gray-light px-4 py-3"
          :class="draggedBottomMenuId === 'matrix' ? 'opacity-60' : ''"
          :style="{ order: bottomMenuOrder.matrix ?? 2 }"
          @dragover.prevent="onBottomMenuDragOver('matrix')"
          @drop.prevent="onBottomMenuDrop('matrix')"
        >
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-sber-gray active:cursor-grabbing"
            draggable="true"
            aria-label="Переместить"
            @dragstart="onBottomMenuDragStart($event, 'matrix')"
            @dragend="onBottomMenuDragEnd"
          >
            <GripVertical class="pointer-events-none h-4 w-4" />
          </button>
          <NavItemMatrix mode="settings" class="pointer-events-none text-sber-gray" />
          <span class="pointer-events-none flex-1 text-sm font-medium text-sber-black">Матрица</span>
          <button
            class="relative h-6 w-12 rounded-full transition-colors"
            :class="isBottomMenuEnabled('matrix') ? 'bg-sber-green' : 'bg-sber-gray-mid'"
            @click="toggleBottomMenuItem('matrix')"
          >
            <div
              class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
              :class="isBottomMenuEnabled('matrix') ? 'translate-x-7' : 'translate-x-1'"
            />
          </button>
        </div>

        <div
          class="flex items-center gap-3 border-b border-sber-gray-light px-4 py-3"
          :class="draggedBottomMenuId === 'pomodoro' ? 'opacity-60' : ''"
          :style="{ order: bottomMenuOrder.pomodoro ?? 3 }"
          @dragover.prevent="onBottomMenuDragOver('pomodoro')"
          @drop.prevent="onBottomMenuDrop('pomodoro')"
        >
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-sber-gray active:cursor-grabbing"
            draggable="true"
            aria-label="Переместить"
            @dragstart="onBottomMenuDragStart($event, 'pomodoro')"
            @dragend="onBottomMenuDragEnd"
          >
            <GripVertical class="pointer-events-none h-4 w-4" />
          </button>
          <NavItemPomodoro mode="settings" class="pointer-events-none text-sber-gray" />
          <span class="pointer-events-none flex-1 text-sm font-medium text-sber-black">Помодоро</span>
          <button
            class="relative h-6 w-12 rounded-full transition-colors"
            :class="isBottomMenuEnabled('pomodoro') ? 'bg-sber-green' : 'bg-sber-gray-mid'"
            @click="toggleBottomMenuItem('pomodoro')"
          >
            <div
              class="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform"
              :class="isBottomMenuEnabled('pomodoro') ? 'translate-x-7' : 'translate-x-1'"
            />
          </button>
        </div>

        <div
          class="flex items-center gap-3 px-4 py-3"
          :class="draggedBottomMenuId === 'settings' ? 'opacity-60' : ''"
          :style="{ order: bottomMenuOrder.settings ?? 4 }"
          @dragover.prevent="onBottomMenuDragOver('settings')"
          @drop.prevent="onBottomMenuDrop('settings')"
        >
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-sber-gray active:cursor-grabbing"
            draggable="true"
            aria-label="Переместить"
            @dragstart="onBottomMenuDragStart($event, 'settings')"
            @dragend="onBottomMenuDragEnd"
          >
            <GripVertical class="pointer-events-none h-4 w-4" />
          </button>
          <NavItemSettings mode="settings" class="pointer-events-none text-sber-gray" />
          <span class="pointer-events-none flex-1 text-sm font-medium text-sber-black">Настройки</span>
          <span class="text-xs font-medium text-sber-gray">Всегда</span>
        </div>
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

      <SettingsRow
        label="Вид"
        :value="calendarViewLabel"
        @click="viewModal = true"
      >
        <template #icon><Paintbrush class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow
        label="Дата и время"
        :value="timezoneLabel"
        @click="dateTimeModal = true"
      >
        <template #icon><Clock class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Интеграции и импорт" @click="integrationsModal = true">
        <template #icon><Download class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
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

      <div class="border-b border-sber-gray-light px-4 py-3">
        <div class="flex items-start gap-3">
          <Bell class="mt-0.5 h-5 w-5 shrink-0 text-sber-gray" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-sber-black">Браузерные push</p>
            <p class="mt-0.5 text-xs text-sber-gray">
              {{ pushPermissionLabel }}
            </p>
            <button
              type="button"
              class="mt-2 rounded-xl bg-sber-green px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
              :disabled="pushEnabling"
              @click="enableBrowserPush"
            >
              {{ pushEnabling ? 'Подключение…' : 'Разрешить уведомления' }}
            </button>
          </div>
        </div>
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

      <SettingsRow
        label="Звук уведомления"
        :value="soundsStore.soundLabel(settingsStore.appSettings.notificationSound, 'notification')"
        @click="openSoundModal('notification')"
      >
        <template #icon><Volume2 class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow
        label="Звук подтверждения"
        :value="soundsStore.soundLabel(settingsStore.appSettings.completionSound, 'completion')"
        @click="openSoundModal('completion')"
      >
        <template #icon><CheckCircle class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
    </div>

    <!-- Visible groups -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Разделы списка задач</p>
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

    <!-- General -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Общее</p>
      <SettingsRow label="Язык" :value="selectedLanguageLabel" @click="languageModal = true">
        <template #icon><Globe class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
    </div>

    <!-- Help & info -->
    <div class="mx-4 mt-4 rounded-2xl overflow-hidden" :class="isDarkTheme ? 'bg-[#171a21] border border-[#2a303a] shadow-none' : 'bg-white shadow-sm'">
      <p class="text-xs font-semibold text-sber-gray px-4 pt-3 pb-1 uppercase tracking-wide">Помощь и информация</p>
      <SettingsRow label="Частые вопросы (FAQ)" @click="navigateTo('/app/faq')">
        <template #icon><HelpCircle class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Юридические документы" @click="navigateTo('/app/legal')">
        <template #icon><FileText class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Рекомендовать друзьям" @click="shareApp">
        <template #icon><Share2 class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="Написать нам" @click="contactModal = true">
        <template #icon><MessageSquareText class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
      <SettingsRow label="О приложении" @click="aboutModal = true">
        <template #icon><Info class="w-5 h-5 text-sber-gray mr-3" /></template>
      </SettingsRow>
    </div>

    <div class="mx-4 mt-6 mb-2">
      <button
        type="button"
        class="w-full rounded-2xl border border-red-200 bg-red-50 py-4 text-sm font-semibold text-red-600"
        @click="showDeleteAccount = true"
      >
        Удалить аккаунт
      </button>
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
            <h3 class="text-xl font-bold text-sber-black">{{ BRAND_NAME }} Premium</h3>
            <p class="text-sm text-sber-gray mt-1">Больше функций в приложении</p>
          </div>
          <PremiumSubscriptionPanel
            :features="premiumStore.features"
            :features-loading="premiumStore.featuresLoading"
            :tariffs="premiumStore.tariffs"
            :tariffs-loading="premiumStore.tariffsLoading"
            :selected-tariff-code="premiumStore.selectedTariffCode"
            :subscription="premiumStore.subscription"
            :subscription-loading="premiumStore.subscriptionLoading"
            :is-premium="premiumStore.isPremium"
            :expires-label="premiumExpiresLabel"
            :action-loading="premiumStore.actionLoading"
            :refresh-loading="premiumRefreshLoading"
            @select-tariff="premiumStore.selectTariff"
            @trial="onPremiumTrial"
            @checkout="onPremiumCheckout"
            @refresh="onPremiumRefresh"
            @cancel="cancelPremiumSubscription"
          />
          <button class="btn-secondary mt-2 w-full" type="button" @click="premiumModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Sound selector -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="soundModal" class="overlay" @click="soundModal = null" /></Transition>
      <Transition name="modal">
        <div v-if="soundModal" class="app-modal px-5 py-5" style="max-height: 85dvh; overflow-y: auto;" @click.stop>
          <h3 class="text-lg font-bold mb-4">
            {{ soundModal === 'notification' ? 'Звук уведомления' : 'Звук подтверждения' }}
          </h3>
          <p v-if="soundPickerLoading" class="mb-3 text-sm text-sber-gray">Загрузка…</p>
          <div class="flex flex-col gap-2">
            <button
              v-for="s in soundPickerOptions"
              :key="s.key"
              type="button"
              class="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors"
              :class="getCurrentSound(soundModal) === s.key
                ? 'border-sber-green bg-sber-green-light'
                : 'border-sber-gray-light'"
              @click="setSound(soundModal, s)"
            >
              <span class="text-xl">{{ s.emoji }}</span>
              <span class="text-sm font-medium text-sber-black">{{ s.title }}</span>
              <Check v-if="getCurrentSound(soundModal) === s.key" class="w-4 h-4 text-sber-green ml-auto" />
            </button>
          </div>
          <button class="btn-secondary mt-4 w-full" type="button" @click="soundModal = null">Закрыть</button>
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

    <!-- View (Вид) modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="viewModal" class="overlay" @click="viewModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="viewModal" class="app-modal px-5 py-5" style="max-height: 85dvh; overflow-y: auto;" @click.stop>
          <h3 class="text-lg font-bold mb-1">Вид</h3>
          <p class="mb-4 text-sm text-sber-gray">Как открывается календарь и какие часы свёрнуты по умолчанию.</p>

          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-sber-gray">Календарь по умолчанию</p>
          <div class="mb-4 grid grid-cols-2 gap-2">
            <button
              v-for="opt in calendarViewOptions"
              :key="opt.id"
              type="button"
              class="rounded-2xl border px-3 py-3 text-sm font-medium transition-colors"
              :class="(settingsStore.appSettings.calendarDefaultView || 'day') === opt.id
                ? 'border-sber-green bg-sber-green-light text-sber-green'
                : 'border-sber-gray-light text-sber-black'"
              @click="setCalendarDefaultView(opt.id)"
            >
              {{ opt.label }}
            </button>
          </div>

          <button class="btn-secondary w-full" type="button" @click="viewModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Date & time modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="dateTimeModal" class="overlay" @click="dateTimeModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="dateTimeModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-1">Дата и время</h3>
          <p class="mb-4 text-sm text-sber-gray">
            Часовой пояс используется для напоминаний и группировки «Сегодня» / «Просрочено».
          </p>

          <div class="mb-3 rounded-2xl border border-sber-gray-light px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-wide text-sber-gray">Часовой пояс</p>
            <p class="mt-1 text-sm font-semibold text-sber-black">{{ timezoneLabel }}</p>
            <p class="mt-1 text-xs text-sber-gray">Сейчас: {{ deviceNowLabel }}</p>
          </div>

          <button
            class="btn-primary mb-3 w-full"
            type="button"
            :disabled="timezoneSyncing"
            @click="syncTimezoneFromDevice"
          >
            {{ timezoneSyncing ? 'Синхронизация…' : 'Синхронизировать с устройством' }}
          </button>
          <button class="btn-secondary w-full" type="button" @click="dateTimeModal = false">Закрыть</button>
        </div>
      </Transition>
    </Teleport>

    <!-- Integrations & import modal -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="integrationsModal" class="overlay" @click="integrationsModal = false" /></Transition>
      <Transition name="modal">
        <div v-if="integrationsModal" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold mb-1">Интеграции и импорт</h3>
          <p class="mb-4 text-sm text-sber-gray">
            Экспортируйте задачи в JSON или импортируйте их из файла Otter.
          </p>

          <button
            class="mb-2 flex w-full items-center gap-3 rounded-2xl border border-sber-gray-light px-4 py-4 text-left transition-colors hover:bg-sber-gray-light"
            type="button"
            :disabled="exportingTasks"
            @click="exportTasksFile"
          >
            <Download class="h-5 w-5 text-sber-gray" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-sber-black">Экспорт задач</span>
              <span class="block text-xs text-sber-gray">Скачать JSON со всеми задачами</span>
            </span>
          </button>

          <button
            class="mb-4 flex w-full items-center gap-3 rounded-2xl border border-sber-gray-light px-4 py-4 text-left transition-colors hover:bg-sber-gray-light"
            type="button"
            :disabled="importingTasks"
            @click="importTasksInputRef?.click()"
          >
            <Upload class="h-5 w-5 text-sber-gray" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-sber-black">Импорт задач</span>
              <span class="block text-xs text-sber-gray">Загрузить JSON-файл Otter</span>
            </span>
          </button>
          <input
            ref="importTasksInputRef"
            type="file"
            accept="application/json,.json"
            class="hidden"
            @change="onImportTasksFile"
          >

          <button class="btn-secondary w-full" type="button" @click="integrationsModal = false">Закрыть</button>
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
            <div class="mx-auto mb-3 flex justify-center">
              <BrandLogo size="lg" show-name-from="always" />
            </div>
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
            <button class="w-full flex items-center gap-3 px-4 py-3 bg-sber-gray-light rounded-2xl" type="button" @click="navigateTo('/app/legal')">
              <FileText class="w-4 h-4 text-sber-gray" />
              <span class="text-sm">Юридические документы</span>
            </button>
          </div>
          <button class="btn-secondary mt-4" @click="aboutModal = false">Закрыть</button>
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

    <!-- Delete account confirm -->
    <Teleport to="body">
      <Transition name="overlay"><div v-if="showDeleteAccount" class="overlay" @click="showDeleteAccount = false" /></Transition>
      <Transition name="modal">
        <div v-if="showDeleteAccount" class="app-modal px-5 py-5" @click.stop>
          <h3 class="text-lg font-bold text-center mb-2">Удалить аккаунт?</h3>
          <p class="text-sm text-sber-gray text-center mb-6">
            Аккаунт и связанные данные будут удалены безвозвратно.
          </p>
          <p v-if="deleteAccountError" class="mb-3 text-center text-sm text-red-500">{{ deleteAccountError }}</p>
          <button
            class="mb-3 w-full rounded-2xl bg-red-500 py-4 font-semibold text-white disabled:opacity-60"
            type="button"
            :disabled="deleteAccountLoading"
            @click="confirmDeleteAccount"
          >
            {{ deleteAccountLoading ? 'Удаление…' : 'Удалить' }}
          </button>
          <button class="btn-secondary" type="button" @click="showDeleteAccount = false">Отмена</button>
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
          <input ref="avatarInputRef" type="file" accept="image/*" capture="environment" class="hidden" @change="handleAvatarFileChange">
          <input ref="avatarGalleryInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarFileChange">
          <button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2"
                  @click="avatarInputRef?.click()">
            <Camera class="w-5 h-5 text-sber-gray" /> Сделать фото
          </button>
          <button class="w-full flex items-center gap-3 px-4 py-4 bg-sber-gray-light rounded-2xl mb-2"
                  @click="pickAvatarFromGallery">
            <Image class="w-5 h-5 text-sber-gray" /> Выбрать из галереи
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
  HelpCircle, Info, Star, Check, ChevronDown, ChevronRight, User, Lock, FileText,
  Paintbrush, Clock, Download, Upload, Share2, Smartphone, Crown, GripVertical, MessageSquareText,
} from 'lucide-vue-next'
import { Moon, Sun } from 'lucide-vue-next'
import type { CalendarDefaultView } from '~/data/mockData'
import type { ApiSound } from '~/types/mobile-api'
import { BRAND_NAME } from '~/utils/site-info'
import { getApiErrorMessage } from '~/utils/api'
import { validateNewPassword } from '~/utils/password-policy'
import { buildNavOrderMap } from '~/utils/nav-items'
import { downloadTasksExportJson, parseTasksExport } from '~/utils/task-export'
import { enableWebPushNotifications } from '~/utils/fcm-devices'

definePageMeta({ layout: 'app' })

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const premiumStore = usePremiumStore()
const tasksStore = useTasksStore()
const calendarStore = useCalendarStore()
const soundsStore = useSoundsStore()
const { showToast } = useAppToast()

const pushEnabling = ref(false)
const pushPermissionTick = ref(0)

const pushPermissionLabel = computed(() => {
  pushPermissionTick.value
  if (!import.meta.client || !('Notification' in window)) {
    return 'Браузер не поддерживает уведомления'
  }
  const p = Notification.permission
  if (p === 'granted') return 'Разрешено — устройство можно зарегистрировать для push'
  if (p === 'denied') return 'Заблокировано в браузере. Разрешите уведомления в настройках сайта'
  return 'Не разрешено — нажмите кнопку ниже'
})

async function enableBrowserPush() {
  if (pushEnabling.value) return
  pushEnabling.value = true
  try {
    if (!settingsStore.appSettings.notifications) {
      await settingsStore.updateSettings({ notifications: true })
    }
    const result = await enableWebPushNotifications()
    pushPermissionTick.value += 1
    if (result.ok) {
      showToast('Браузерные уведомления включены', 'success')
    }
    else if (result.reason === 'permission-denied') {
      showToast(result.message, 'error')
    }
    else {
      showToast(result.message || 'Не удалось включить push', 'error')
    }
  }
  catch (err) {
    showToast(getApiErrorMessage(err, 'Не удалось включить уведомления'), 'error')
  }
  finally {
    pushEnabling.value = false
  }
}

const nameModal = ref(false)
const passwordModal = ref(false)
const premiumModal = ref(false)
const soundModal = ref<'notification' | 'completion' | null>(null)
const soundPickerLoading = ref(false)
const languageModal = ref(false)
const viewModal = ref(false)
const dateTimeModal = ref(false)
const integrationsModal = ref(false)
const contactModal = ref(false)
const aboutModal = ref(false)
const premiumRefreshLoading = ref(false)
const contactSending = ref(false)
const contactScreenshotFile = ref<File | null>(null)
const avatarModal = ref(false)
const avatarSettingsError = ref('')
const avatarInputRef = ref<HTMLInputElement | null>(null)
const avatarGalleryInputRef = ref<HTMLInputElement | null>(null)
const contactScreenshotInputRef = ref<HTMLInputElement | null>(null)
const importTasksInputRef = ref<HTMLInputElement | null>(null)
const showLogout = ref(false)
const showDeleteAccount = ref(false)
const deleteAccountLoading = ref(false)
const deleteAccountError = ref('')
const comingSoonVisible = ref(false)
const timezoneSyncing = ref(false)
const exportingTasks = ref(false)
const importingTasks = ref(false)
const deviceNowTick = ref(0)
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
const languages = [
  { id: 'ru', label: 'Русский' },
]

const bottomMenuCatalog = [
  { id: 'tasks', label: 'Задачи' },
  { id: 'calendar', label: 'Календарь' },
  { id: 'matrix', label: 'Матрица' },
  { id: 'pomodoro', label: 'Помодоро' },
  { id: 'settings', label: 'Настройки' },
]

const orderedBottomMenuItems = computed(() => {
  const enabled = settingsStore.appSettings.bottomNavItems || []
  const byId = new Map(bottomMenuCatalog.map(item => [item.id, item]))
  const ordered = enabled.map(id => byId.get(id)).filter(Boolean)
  const rest = bottomMenuCatalog.filter(item => !enabled.includes(item.id))
  return [...ordered, ...rest] as typeof bottomMenuCatalog
})

/** Visual order only — DOM stays fixed so Lucide SVGs never remount/corrupt. */
const bottomMenuOrder = computed(() =>
  buildNavOrderMap(orderedBottomMenuItems.value.map(item => item.id)),
)

const selectedLanguageLabel = computed(() =>
  languages.find(l => l.id === selectedLanguage.value)?.label || 'Русский'
)

const calendarViewOptions: { id: CalendarDefaultView; label: string }[] = [
  { id: 'day', label: 'День' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
  { id: 'year', label: 'Год' },
]

const calendarViewLabel = computed(() => {
  const id = settingsStore.appSettings.calendarDefaultView || 'day'
  return calendarViewOptions.find(o => o.id === id)?.label || 'День'
})

const timezoneLabel = computed(() =>
  settingsStore.appSettings.timezone
  || (import.meta.client ? Intl.DateTimeFormat().resolvedOptions().timeZone : '')
  || '—'
)

const deviceNowLabel = computed(() => {
  void deviceNowTick.value
  if (!import.meta.client) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: timezoneLabel.value !== '—' ? timezoneLabel.value : undefined,
  }).format(new Date())
})

let deviceNowTimer: ReturnType<typeof setInterval> | null = null
watch(dateTimeModal, (open) => {
  if (open) {
    deviceNowTick.value++
    deviceNowTimer = setInterval(() => { deviceNowTick.value++ }, 1000)
    return
  }
  if (deviceNowTimer) {
    clearInterval(deviceNowTimer)
    deviceNowTimer = null
  }
})

onUnmounted(() => {
  if (deviceNowTimer) {
    clearInterval(deviceNowTimer)
    deviceNowTimer = null
  }
})

const route = useRoute()

watch(
  () => route.query.openContact,
  (value) => {
    if (value === '1') contactModal.value = true
  },
  { immediate: true },
)

watch(
  () => route.query.openPremium,
  (value) => {
    if (value === '1') premiumModal.value = true
  },
  { immediate: true },
)

watch(premiumModal, (open) => {
  if (open) {
    void premiumStore.loadAll()
    return
  }
  // Modal yopilganda query ni tozalaymiz — Premium yana bosilganda ochiladi
  if (route.query.openPremium != null) {
    const nextQuery = { ...route.query }
    delete nextQuery.openPremium
    void navigateTo({ path: '/app/settings', query: nextQuery }, { replace: true })
  }
})

const isDarkTheme = computed(() => settingsStore.appSettings.theme === 'dark')

const profileFullNameDisplay = computed(() => {
  const raw = `${authStore.profileFirstName || ''} ${authStore.profileLastName || ''}`.trim()
  return raw || authStore.user?.name || '—'
})

const premiumExpiresLabel = computed(() => {
  const expiresAt = premiumStore.expiresAt || authStore.user?.premiumExpiresAt
  if (!expiresAt) return ''

  const date = new Date(expiresAt)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

const premiumBannerTitle = computed(() => {
  if (!premiumStore.isPremium) return 'Подключить Premium'
  const status = premiumStore.subscription?.status
  if (status === 'trial') return 'Пробный период активен'
  if (status === 'cancelled') return 'Premium активен (без автопродления)'
  return 'Premium активен'
})

const premiumBannerSubtitle = computed(() => {
  if (!premiumStore.isPremium) return ''
  const tariff = premiumStore.subscription?.tariff?.title
  const until = premiumExpiresLabel.value
  if (tariff && until) return `${tariff} · до ${until}`
  if (tariff) return tariff
  if (until) return `до ${until}`
  return ''
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

function pickAvatarFromGallery() {
  avatarGalleryInputRef.value?.click()
}

function shareApp() {
  if (navigator.share) {
    navigator.share({ title: `${BRAND_NAME} - Планировщик`, url: window.location.origin })
  } else {
    showComingSoon()
  }
}

async function confirmDeleteAccount() {
  deleteAccountError.value = ''
  deleteAccountLoading.value = true
  try {
    await authStore.deleteAccount()
    showDeleteAccount.value = false
  }
  catch (err) {
    deleteAccountError.value = getApiErrorMessage(err, 'Не удалось удалить аккаунт')
  }
  finally {
    deleteAccountLoading.value = false
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

async function setCalendarDefaultView(view: CalendarDefaultView) {
  await settingsStore.updateSettings({ calendarDefaultView: view })
  calendarStore.applyViewDefaultsFromSettings()
}

async function syncTimezoneFromDevice() {
  if (!import.meta.client || timezoneSyncing.value) return
  timezoneSyncing.value = true
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!tz) {
      showToast('Не удалось определить часовой пояс устройства', 'error')
      return
    }
    await settingsStore.updateSettings({ timezone: tz })
    showToast('Часовой пояс обновлён', 'success')
  }
  catch (err) {
    showToast(getApiErrorMessage(err, 'Не удалось синхронизировать часовой пояс'), 'error')
  }
  finally {
    timezoneSyncing.value = false
  }
}

async function exportTasksFile() {
  if (exportingTasks.value) return
  exportingTasks.value = true
  try {
    if (!tasksStore.initialized) {
      await tasksStore.fetchGrouped()
    }
    const tasks = tasksStore.tasks || []
    if (!tasks.length) {
      showToast('Нет задач для экспорта', 'error')
      return
    }
    downloadTasksExportJson(tasks)
    showToast(`Экспортировано задач: ${tasks.length}`, 'success')
  }
  catch (err) {
    showToast(getApiErrorMessage(err, 'Не удалось экспортировать задачи'), 'error')
  }
  finally {
    exportingTasks.value = false
  }
}

async function onImportTasksFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || importingTasks.value) return

  importingTasks.value = true
  try {
    const text = await file.text()
    const parsed = parseTasksExport(JSON.parse(text))
    let created = 0
    for (const item of parsed) {
      await tasksStore.addTask({
        title: item.title,
        description: item.description,
        dueDate: item.dueDate,
        dueTime: item.dueTime,
        duration: item.duration,
        priority: item.priority || 'none',
        completed: false,
        notification: item.notification,
        repeat: item.repeat || 'none',
        repeatDays: item.repeatDays,
        repeatCustom: item.repeatCustom,
        isAllDay: item.isAllDay,
        matrixBlock: item.matrixBlock,
      })
      created++
    }
    showToast(`Импортировано задач: ${created}`, 'success')
    integrationsModal.value = false
  }
  catch (err) {
    const message = err instanceof Error && err.message
      ? err.message
      : getApiErrorMessage(err, 'Не удалось импортировать задачи')
    showToast(message, 'error')
  }
  finally {
    importingTasks.value = false
  }
}

async function onPremiumTrial(payload: { tariff: string; recurringConsent: boolean }) {
  try {
    await premiumStore.startTrial(payload.tariff, payload.recurringConsent)
    showToast('Пробный период Premium активирован', 'success')
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
}

async function onPremiumCheckout(payload: { tariff: string; recurringConsent: boolean }) {
  try {
    const { checkout_url } = await premiumStore.checkout(payload.tariff, {
      recurringConsent: payload.recurringConsent,
    })
    window.open(checkout_url, '_blank', 'noopener,noreferrer')
    showToast('Откройте вкладку оплаты Robokassa. После оплаты нажмите «обновить статус».', 'success', 6000)
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
}

async function onPremiumRefresh() {
  premiumRefreshLoading.value = true
  try {
    const sub = await premiumStore.fetchSubscription()
    if (sub.is_premium) {
      const until = premiumExpiresLabel.value
      const tariff = sub.tariff?.title
      const parts = ['Premium активен']
      if (tariff) parts.push(tariff)
      if (until) parts.push(`до ${until}`)
      showToast(parts.join(' · '), 'success')
    }
    else {
      showToast('Оплата ещё не подтверждена. Подождите немного и обновите снова.', 'error')
    }
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
  finally {
    premiumRefreshLoading.value = false
  }
}

async function cancelPremiumSubscription() {
  try {
    await premiumStore.cancel()
    showToast('Автопродление отключено. Доступ сохранится до конца периода.', 'success')
  }
  catch (err) {
    showToast(getApiErrorMessage(err), 'error')
  }
}

function getCurrentSound(modal: string | null) {
  if (modal === 'notification') return settingsStore.appSettings.notificationSound
  return settingsStore.appSettings.completionSound
}

const soundPickerOptions = computed(() => {
  if (soundModal.value === 'completion') return soundsStore.completion
  if (soundModal.value === 'notification') return soundsStore.notification
  return []
})

async function openSoundModal(kind: 'notification' | 'completion') {
  soundModal.value = kind
  soundPickerLoading.value = true
  try {
    await soundsStore.ensureFeedbackLoaded()
  }
  finally {
    soundPickerLoading.value = false
  }
}

async function setSound(modal: string | null, sound: ApiSound) {
  if (!modal) return
  soundsStore.previewSound(sound)
  if (modal === 'notification') {
    await settingsStore.updateSettings({ notificationSound: sound.key })
  }
  else {
    await settingsStore.updateSettings({ completionSound: sound.key })
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
  if (itemId === 'settings') return
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

function onBottomMenuDragStart(event: DragEvent, itemId: string) {
  draggedBottomMenuId.value = itemId
  event.dataTransfer?.setData('text/plain', itemId)
  event.dataTransfer!.effectAllowed = 'move'
  // Avoid cloning Lucide SVGs into the drag ghost — browsers can leave broken SVG trees behind.
  const ghost = document.createElement('div')
  ghost.textContent = '⋮⋮'
  ghost.style.cssText = 'position:fixed;top:-1000px;left:-1000px;padding:8px 12px;border-radius:12px;background:#21A038;color:#fff;font:600 14px/1 sans-serif;'
  document.body.appendChild(ghost)
  event.dataTransfer?.setDragImage(ghost, 16, 16)
  requestAnimationFrame(() => ghost.remove())
}

function onBottomMenuDragOver(_itemId: string) {
  /* allow drop */
}

function onBottomMenuDragEnd() {
  draggedBottomMenuId.value = null
}

function onBottomMenuDrop(targetItemId: string) {
  if (!draggedBottomMenuId.value || draggedBottomMenuId.value === targetItemId) {
    draggedBottomMenuId.value = null
    return
  }

  const current = [...settingsStore.appSettings.bottomNavItems]
  const fromIndex = current.indexOf(draggedBottomMenuId.value)
  const toIndex = current.indexOf(targetItemId)
  if (fromIndex === -1 || toIndex === -1) {
    draggedBottomMenuId.value = null
    return
  }

  const [moved] = current.splice(fromIndex, 1)
  current.splice(toIndex, 0, moved)
  settingsStore.reorderNavItems(current)
  draggedBottomMenuId.value = null
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
