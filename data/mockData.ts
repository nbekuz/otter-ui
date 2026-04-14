import dayjs from 'dayjs'

export type Priority = 'high' | 'medium' | 'low' | 'none'
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string       // ISO date string
  dueTime?: string       // 'HH:mm'
  duration?: { start: string; end: string } // 'HH:mm'
  priority: Priority
  completed: boolean
  completedAt?: string
  notification?: string  // minutes before
  repeat: RepeatType
  repeatDays?: number[]  // days of week
  imageUrl?: string
  listId?: string
  matrixBlock?: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important'
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isPremium: boolean
}

export interface PomodoroSettings {
  duration: number       // minutes
  shortBreak: number
  longBreak: number
  sessionsUntilLong: number
  sound: string
  workingSound?: string
  showOnLockScreen: boolean
}

export interface AppSettings {
  language: string
  theme: string
  visibleGroups: string[]
  notifications: boolean
  vibration: boolean
  notificationSound: string
  completionSound: string
  bottomNavItems: string[]
}

// ─── Mock User ───────────────────────────────────────────────────────────────
export const mockUser: User = {
  id: 'user-1',
  email: 'demo@otter.app',
  name: 'Александр',
  isPremium: false,
}

// ─── Mock Tasks ───────────────────────────────────────────────────────────────
const today = dayjs().format('YYYY-MM-DD')
const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
const twoDaysAgo = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
const in3Days = dayjs().add(3, 'day').format('YYYY-MM-DD')
const in7Days = dayjs().add(7, 'day').format('YYYY-MM-DD')

export const mockTasks: Task[] = [
  // Overdue
  {
    id: 't1',
    title: 'Отправить отчёт за прошлый месяц',
    description: 'Нужно подготовить и отправить финансовый отчёт руководству',
    dueDate: twoDaysAgo,
    dueTime: '10:00',
    priority: 'high',
    completed: false,
    repeat: 'none',
    notification: '30',
    createdAt: dayjs().subtract(7, 'day').toISOString(),
    matrixBlock: 'urgent-important',
  },
  {
    id: 't2',
    title: 'Позвонить в банк по вопросу карты',
    dueDate: yesterday,
    dueTime: '14:00',
    priority: 'medium',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    matrixBlock: 'urgent-not-important',
  },

  // Today
  {
    id: 't3',
    title: 'Встреча с командой разработки',
    description: 'Еженедельный стендап, обсудить спринт',
    dueDate: today,
    dueTime: '10:00',
    duration: { start: '10:00', end: '11:00' },
    priority: 'high',
    completed: false,
    repeat: 'weekly',
    notification: '15',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    matrixBlock: 'urgent-important',
  },
  {
    id: 't4',
    title: 'Сходить в спортзал',
    dueDate: today,
    dueTime: '19:00',
    duration: { start: '19:00', end: '20:30' },
    priority: 'medium',
    completed: false,
    repeat: 'daily',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    matrixBlock: 'not-urgent-important',
  },
  {
    id: 't5',
    title: 'Купить продукты',
    dueDate: today,
    dueTime: '18:00',
    priority: 'low',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    matrixBlock: 'urgent-not-important',
  },
  {
    id: 't6',
    title: 'Прочитать 30 страниц книги',
    dueDate: today,
    dueTime: '21:00',
    priority: 'medium',
    completed: false,
    repeat: 'daily',
    createdAt: dayjs().subtract(10, 'day').toISOString(),
    matrixBlock: 'not-urgent-important',
  },

  // Tomorrow
  {
    id: 't7',
    title: 'Презентация нового проекта',
    description: 'Подготовить слайды и тезисы выступления',
    dueDate: tomorrow,
    dueTime: '09:30',
    duration: { start: '09:30', end: '11:00' },
    priority: 'high',
    completed: false,
    repeat: 'none',
    notification: '60',
    createdAt: dayjs().subtract(3, 'day').toISOString(),
    matrixBlock: 'urgent-important',
  },
  {
    id: 't8',
    title: 'Оплатить коммунальные услуги',
    dueDate: tomorrow,
    dueTime: '12:00',
    priority: 'medium',
    completed: false,
    repeat: 'monthly',
    createdAt: dayjs().toISOString(),
    matrixBlock: 'urgent-not-important',
  },

  // Later
  {
    id: 't9',
    title: 'Записаться на курс по Python',
    dueDate: in3Days,
    priority: 'medium',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().toISOString(),
    matrixBlock: 'not-urgent-important',
  },
  {
    id: 't10',
    title: 'Сделать резервную копию файлов',
    dueDate: in7Days,
    priority: 'low',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().toISOString(),
    matrixBlock: 'not-urgent-not-important',
  },
  {
    id: 't11',
    title: 'Обновить резюме',
    dueDate: in7Days,
    priority: 'medium',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().toISOString(),
    matrixBlock: 'not-urgent-important',
  },

  // No date
  {
    id: 't12',
    title: 'Посмотреть документальный фильм о природе',
    priority: 'none',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().toISOString(),
    matrixBlock: 'not-urgent-not-important',
  },
  {
    id: 't13',
    title: 'Выучить 10 новых слов на английском',
    priority: 'low',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().toISOString(),
    matrixBlock: 'not-urgent-important',
  },
  {
    id: 't14',
    title: 'Разобрать гардероб',
    priority: 'none',
    completed: false,
    repeat: 'none',
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    matrixBlock: 'not-urgent-not-important',
  },

  // Completed
  {
    id: 't15',
    title: 'Написать план на неделю',
    dueDate: yesterday,
    priority: 'high',
    completed: true,
    completedAt: yesterday,
    repeat: 'weekly',
    createdAt: dayjs().subtract(8, 'day').toISOString(),
  },
  {
    id: 't16',
    title: 'Позвонить маме',
    dueDate: yesterday,
    priority: 'medium',
    completed: true,
    completedAt: yesterday,
    repeat: 'none',
    createdAt: dayjs().subtract(2, 'day').toISOString(),
  },
  {
    id: 't17',
    title: 'Проверить email',
    dueDate: today,
    dueTime: '09:00',
    priority: 'low',
    completed: true,
    completedAt: today,
    repeat: 'daily',
    createdAt: dayjs().subtract(15, 'day').toISOString(),
  },
]

// ─── Pomodoro Settings ────────────────────────────────────────────────────────
export const defaultPomodoroSettings: PomodoroSettings = {
  duration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLong: 4,
  sound: 'bell',
  workingSound: 'rain',
  showOnLockScreen: true,
}

// ─── App Settings ─────────────────────────────────────────────────────────────
export const defaultAppSettings: AppSettings = {
  language: 'ru',
  theme: 'light',
  visibleGroups: ['overdue', 'today', 'tomorrow', 'later', 'nodate', 'completed'],
  notifications: true,
  vibration: true,
  notificationSound: 'chime',
  completionSound: 'success',
  bottomNavItems: ['tasks', 'calendar', 'matrix', 'pomodoro', 'settings'],
}

// ─── Eisenhower Matrix Defaults ───────────────────────────────────────────────
export const matrixBlockDefaults = {
  'urgent-important': {
    id: 'urgent-important',
    title: 'Срочно и важно',
    color: '#FF3B30',
    bgColor: '#FFF0EF',
    description: 'Сделать немедленно',
    dateFilter: ['overdue', 'today'],
    priorityFilter: ['high'],
  },
  'not-urgent-important': {
    id: 'not-urgent-important',
    title: 'Не срочно, но важно',
    color: '#007AFF',
    bgColor: '#EFF5FF',
    description: 'Запланировать',
    dateFilter: ['tomorrow', 'later'],
    priorityFilter: ['high', 'medium'],
  },
  'urgent-not-important': {
    id: 'urgent-not-important',
    title: 'Срочно, не важно',
    color: '#FF9500',
    bgColor: '#FFF8EF',
    description: 'Делегировать',
    dateFilter: ['overdue', 'today', 'tomorrow'],
    priorityFilter: ['medium', 'low'],
  },
  'not-urgent-not-important': {
    id: 'not-urgent-not-important',
    title: 'Не срочно, не важно',
    color: '#8E8E93',
    bgColor: '#F5F5F5',
    description: 'Устранить',
    dateFilter: ['later', 'nodate'],
    priorityFilter: ['low', 'none'],
  },
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
export const faqData = [
  {
    id: 'f1',
    question: 'Как создать новую задачу?',
    answer: 'Нажмите кнопку «+» в нижней части экрана на странице списка задач или в представлении календаря.',
  },
  {
    id: 'f2',
    question: 'Как установить приоритет задачи?',
    answer: 'При создании задачи нажмите на иконку флажка и выберите один из четырёх уровней приоритета: высокий, средний, низкий или без приоритета.',
  },
  {
    id: 'f3',
    question: 'Что такое Матрица Эйзенхауэра?',
    answer: 'Это метод управления задачами, который делит задачи на 4 квадранта по степени срочности и важности. Помогает сфокусироваться на действительно важных делах.',
  },
  {
    id: 'f4',
    question: 'Как работает таймер Помодоро?',
    answer: 'Технология Помодоро предполагает работу в течение 25 минут с полной концентрацией, затем 5-минутный перерыв. Такие циклы помогают оставаться продуктивным.',
  },
  {
    id: 'f5',
    question: 'Как удалить задачу?',
    answer: 'Смахните задачу влево — появится красная кнопка удаления. Или откройте задачу и нажмите на кнопку удаления внутри.',
  },
  {
    id: 'f6',
    question: 'Как отметить задачу как выполненную?',
    answer: 'Смахните задачу вправо или нажмите на квадрат-чекбокс слева от названия задачи.',
  },
]

// ─── Sounds ───────────────────────────────────────────────────────────────────
export const soundOptions = [
  { id: 'bell', name: 'Колокольчик', icon: '🔔' },
  { id: 'chime', name: 'Перезвон', icon: '🎵' },
  { id: 'success', name: 'Успех', icon: '✅' },
  { id: 'ding', name: 'Динь', icon: '🔊' },
  { id: 'soft', name: 'Мягкий', icon: '🎶' },
  { id: 'none', name: 'Без звука', icon: '🔇' },
]

export const workSoundOptions = [
  { id: 'rain', name: 'Дождь', icon: '🌧️' },
  { id: 'forest', name: 'Лес', icon: '🌲' },
  { id: 'cafe', name: 'Кафе', icon: '☕' },
  { id: 'white-noise', name: 'Белый шум', icon: '💨' },
  { id: 'none', name: 'Без звука', icon: '🔇' },
]
