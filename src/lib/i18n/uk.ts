import type { DecisionCategoryFilter } from "@/lib/categories/registry";
import { getCategoryFilterLabels } from "@/lib/categories/registry";
import type { DecisionSortOption } from "@/lib/config/decision-list-params";
import type { DecisionStatusFilter } from "@/lib/config/decision-list-params";
import type { DecisionStatus } from "@/lib/types/decision";
import type { SupportLevel } from "@/lib/support-score";

export const m = {
  meta: {
    title: "Помічник рішень",
    description: "AI-помічник для аналізу складних рішень",
  },

  common: {
    email: "Електронна пошта",
    password: "Пароль",
    backToHome: "На головну",
    tryAgain: "Спробувати знову",
    goToDashboard: "На панель",
    menu: "Меню",
    mainNav: "Головна навігація",
    openNavMenu: "Відкрити мені навігації",
    toggleTheme: "Перемкнути тему",
    lightMode: "Світла тема",
    darkMode: "Темна тема",
    previous: "Назад",
    next: "Далі",
    createdAt: (date: string) => `Створено ${date}`,
  },

  landing: {
    title: "Приймайте кращі рішення з AI",
    subtitle:
      "Фіксуйте вибори, виявляйте когнітивні упередження та досліджуйте альтернативи, які могли випасти з уваги.",
    getStarted: "Почати",
    getStartedDescription:
      "Створіть обліковий запис або увійдіть, щоб проаналізувати перше рішення.",
    signIn: "Увійти",
    createAccount: "Створити обліковий запис",
  },

  auth: {
    signIn: "Увійти",
    signInDescription:
      "Введіть електронну пошту та пароль, щоб перейти на панель.",
    signingIn: "Вхід…",
    createAccount: "Створити обліковий запис",
    createAccountDescription:
      "Зареєструйтесь електронною поштою та паролем, щоб почати.",
    creatingAccount: "Створення облікового запису…",
    noAccount: "Немає облікового запису?",
    createOne: "Створити",
    hasAccount: "Уже маєте обліковий запис?",
    accountMenu: "Меню облікового запису",
    logOut: "Вийти",
    signUpNoSession:
      "Обліковий запис створено, але сесію не отримано. Вимкніть підтвердження email у налаштуваннях Supabase Auth.",
    validation: {
      invalidEmail: "Введіть коректну адресу електронної пошти",
      passwordMin: "Пароль має містити щонайменше 6 символів",
    },
  },

  nav: {
    appName: "Помічник рішень",
    dashboard: "Панель",
    decisions: "Рішення",
    newDecision: "Нове рішення",
  },

  dashboard: {
    welcome: "Знову вітаємо",
    recentDecisions: "Останні рішення",
    viewAllDecisions: "Переглянути всі рішення",
    insights: "Інсайти",
    insightsEmptyTitle: "Створіть перше рішення, щоб отримати інсайти.",
    insightsEmptyDescription:
      "Після аналізу тут з’являться тренди категорій, поширені упередження та розподіл рівня підтримки.",
    insightsFrom: (countLabel: string) =>
      `Інсайти на основі ${countLabel}.`,
    categoriesTitle: "Категорії рішень",
    categoriesDescription: "Найпоширеніші типи ваших рішень.",
    biasesTitle: "Поширені упередження",
    biasesDescription: "Когнітивні патерни, що з’являються найчастіше.",
    supportTitle: "Розподіл підтримки",
    supportDescription: "Розподіл рівня підтримки серед ваших рішень.",
    noCategoryData: "Даних про категорії ще немає.",
    noBiasData: "Упереджень поки не виявлено.",
    noSupportData: "Даних про рівень підтримки ще немає.",
    emptyTitle: "Рішень ще немає",
    emptyDescription:
      "Створіть перше рішення. Після аналізу тут з’являться інсайти, а AI допоможе побачити упередження та альтернативи.",
    insightsPendingTitle: "Інсайти з’являться після аналізу",
    insightsPendingDescription:
      "Коли AI завершить обробку ваших рішень, тут відобразяться категорії, упередження та рівень підтримки.",
  },

  decisions: {
    allTitle: "Усі рішення",
    totalLabel: (countLabel: string) => `${countLabel} загалом`,
    newTitle: "Нове рішення",
    newDescription:
      "Опишіть ситуацію — ми проаналізуємо її за допомогою AI.",
    form: {
      title: "Деталі рішення",
      description:
        "Заповніть контекст нижче. Після збереження AI-аналіз запуститься у фоні, поки ви переглядаєте сторінку рішення.",
      fieldTitle: "Назва",
      fieldTitleHelp: "Коротка назва, щоб легко знайти це рішення пізніше.",
      fieldTitlePlaceholder: "Чи варто прийняти пропозицію від стартапу?",
      fieldSituation: "Ситуація",
      fieldSituationPlaceholder:
        "Опишіть контекст, обмеження та що поставлено на карту…",
      fieldDecision: "Рішення",
      fieldDecisionPlaceholder: "Який вибір ви розглядаєте?",
      fieldThoughts: "Міркування (необов’язково)",
      fieldThoughtsPlaceholder:
        "Цілі, занепокоєння або інше, що AI має врахувати…",
      saving: "Збереження…",
      submit: "Створити та проаналізувати",
    },
    validation: {
      titleRequired: "Назва обов’язкова",
      titleMax: "Назва має містити не більше 200 символів",
      situationRequired: "Ситуація обов’язкова",
      situationMax: "Ситуація має містити не більше 5000 символів",
      decisionRequired: "Рішення обов’язкове",
      decisionMax: "Рішення має містити не більше 5000 символів",
      thoughtsMax: "Міркування мають містити не більше 5000 символів",
    },
    errors: {
      notFound: "Рішення не знайдено.",
      createFailed: "Не вдалося створити рішення. Спробуйте ще раз.",
      analysisStartFailed: "Не вдалося запустити аналіз. Спробуйте ще раз.",
    },
    list: {
      emptyFilteredTitle: "Немає відповідних рішень",
      emptyTitle: "Рішень ще немає",
      emptyFilteredDescription:
        "Спробуйте змінити сортування або фільтри, щоб побачити більше результатів.",
      emptyDescription:
        "Почніть з першого аналізу рішення. AI допоможе виявити упередження та альтернативи, які могли випасти з уваги.",
      viewDetails: "Детальніше",
    },
    detail: {
      contextTitle: "Контекст рішення",
      contextDescription: "Ситуація та вибір, які ви надіслали на аналіз.",
      situation: "Ситуація",
      decision: "Рішення",
      thoughts: "Міркування",
    },
    analysis: {
      unavailableTitle: "Аналіз недоступний",
      unavailableDescription:
        "AI-аналіз для цього рішення не вдалося завершити.",
      starting: "Запуск аналізу…",
      retry: "Повторити аналіз",
      reanalyze: "Проаналізувати знову",
      title: "AI-аналіз",
      description: "Інсайти на основі контексту вашого рішення.",
      summary: "Підсумок",
      biases: "Можливі упередження",
      alternatives: "Пропущені альтернативи",
      noBiases: "Помітних упереджень не виявлено.",
      noAlternatives: "Альтернатив не виявлено.",
      genericBiasDescription:
        "Можливо, це когнітивне упередження впливає на ваше міркування в цій ситуації.",
      inProgressTitle: "Аналіз триває",
      inProgressDescription:
        "AI переглядає ваше рішення. Сторінка оновиться автоматично, коли аналіз буде готовий.",
    },
    stats: {
      total: "Усього рішень",
      highSupport: "Висока підтримка",
      mediumSupport: "Середня підтримка",
      lowSupport: "Низька підтримка",
    },
    pagination: {
      ariaLabel: "Пагінація рішень",
      pageInfo: (page: number, totalPages: number, total: number) =>
        `Сторінка ${page} з ${totalPages} · ${total} загалом`,
    },
    toolbar: {
      sortBy: "Сортування",
      status: "Статус",
      category: "Категорія",
      bias: "Упередження",
      allBiases: "Усі упередження",
      activeFilters: "Активні фільтри",
      sortPrefix: "Сортування:",
      statusPrefix: "Статус:",
      categoryPrefix: "Категорія:",
      biasPrefix: "Упередження:",
      clearFilters: "Скинути фільтри",
    },
  },

  status: {
    processing: "В обробці",
    completed: "Готово",
    failed: "Помилка",
  } satisfies Record<DecisionStatus, string>,

  support: {
    low: "Низька підтримка",
    medium: "Середня підтримка",
    high: "Висока підтримка",
  } satisfies Record<SupportLevel, string>,

  config: {
    sort: {
      newest: "Спочатку нові",
      oldest: "Спочатку старі",
      confidence_high: "Найвища підтримка",
      confidence_low: "Найнижча підтримка",
      complexity_high: "Найвища складність",
      complexity_low: "Найнижча складність",
      title_asc: "Назва А → Я",
      title_desc: "Назва Я → А",
    } satisfies Record<DecisionSortOption, string>,
    statusFilter: {
      all: "Усі",
      completed: "Готово",
      processing: "В обробці",
      failed: "Помилка",
    } satisfies Record<DecisionStatusFilter, string>,
    category: getCategoryFilterLabels() satisfies Record<
      DecisionCategoryFilter,
      string
    >,
    allBiases: "Усі упередження",
  },

  errors: {
    genericTitle: "Щось пішло не так",
    genericDescription:
      "Під час завантаження сторінки сталася неочікувана помилка.",
    protectedTitle: "Не вдалося завантажити сторінку",
    protectedDescription:
      "Під час отримання даних сталася помилка. Спробуйте ще раз або поверніться на панель.",
  },
} as const;

export type Messages = typeof m;
