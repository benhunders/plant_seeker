// Pure, framework-agnostic i18n data. Safe to import from server or client.
// The React context/hook lives in components/I18nProvider.tsx.

export type Locale = 'en' | 'no' | 'th';

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_STORAGE_KEY = 'plant-seeker:locale';

/** Native display names for the language switcher. */
export const LOCALES: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'no', label: 'Norsk' },
  { code: 'th', label: 'ไทย' },
];

/** Human language name sent to the model so it replies in the right language. */
export function languageName(locale: Locale): string {
  switch (locale) {
    case 'no':
      return 'Norwegian (Bokmål)';
    case 'th':
      return 'Thai';
    default:
      return 'English';
  }
}

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'no' || value === 'th';
}

type Dict = Record<string, string>;

const en: Dict = {
  nav_myPlants: 'My plants',

  // Home
  home_title: 'What plant is this?',
  home_subtitle: 'Snap a photo to identify it and get simple care tips.',
  home_tip: 'Tip: fill the frame with a single plant in good light.',
  home_identifying: 'Identifying your plant…',
  home_tryAgain: 'Try again',
  home_tryAnother: 'Try another photo',
  home_notIdentified: "I couldn't confidently identify a plant here.",
  home_couldNotIdentify: 'Could not identify the plant.',
  home_genericError: 'Something went wrong.',
  home_careSchedule: 'Care schedule',
  home_save: 'Save to my plants',
  home_retake: 'Retake',
  confidence_label: '{level} confidence',
  conf_high: 'High',
  conf_medium: 'Medium',
  conf_low: 'Low',

  // Camera
  capture_identify: 'Identify a plant',
  capture_readError: 'Sorry, that image could not be read. Try another photo.',

  // Care card
  care_title: 'Care at a glance',
  care_light: 'Light',
  care_water: 'Water',
  care_soil: 'Soil',
  care_humidity: 'Humidity',
  care_temperature: 'Temperature',
  difficulty_easy: 'Easy',
  difficulty_moderate: 'Moderate',
  difficulty_hard: 'Hard',

  // Schedule
  sched_none: 'No care tasks yet.',
  sched_done: 'Done',
  sched_every: 'every {n}d',
  due_overdue: 'Overdue',
  due_today: 'Due today',
  due_tomorrow: 'Tomorrow',
  due_inDays: 'In {n} days',
  due_short: 'Due',

  // Plant card
  plant_due: '{n} due',

  // Plants page
  plants_today: 'Today',
  plants_myPlants: 'My plants',
  plants_loading: 'Loading…',
  plants_emptyMsg: "You haven't saved any plants yet.",
  plants_identifyFirst: 'Identify your first plant',
  plants_nothingDue: '🎉 Nothing due today. Your plants are all set.',

  // Plant detail
  detail_notFound: "That plant wasn't found.",
  detail_back: 'Back to my plants',
  detail_remove: 'Remove plant',
  detail_confirmRemove: 'Remove {name}?',

  // Chat
  chat_title: 'Ask about this plant',
  chat_placeholder: 'e.g. Why are the leaves yellow?',
  chat_ask: 'Ask',
  chat_thinking: 'Thinking…',
  chat_requestFailed: 'Request failed.',

  // Language switcher
  lang_aria: 'Change language',
};

const no: Dict = {
  nav_myPlants: 'Mine planter',

  home_title: 'Hvilken plante er dette?',
  home_subtitle: 'Ta et bilde for å identifisere den og få enkle stelltips.',
  home_tip: 'Tips: fyll bildet med én enkelt plante i godt lys.',
  home_identifying: 'Identifiserer planten din …',
  home_tryAgain: 'Prøv igjen',
  home_tryAnother: 'Prøv et annet bilde',
  home_notIdentified: 'Jeg klarte ikke å identifisere en plante her med sikkerhet.',
  home_couldNotIdentify: 'Kunne ikke identifisere planten.',
  home_genericError: 'Noe gikk galt.',
  home_careSchedule: 'Stelleplan',
  home_save: 'Lagre til mine planter',
  home_retake: 'Ta på nytt',
  confidence_label: '{level} sikkerhet',
  conf_high: 'Høy',
  conf_medium: 'Middels',
  conf_low: 'Lav',

  capture_identify: 'Identifiser en plante',
  capture_readError: 'Beklager, bildet kunne ikke leses. Prøv et annet bilde.',

  care_title: 'Stell på et blikk',
  care_light: 'Lys',
  care_water: 'Vann',
  care_soil: 'Jord',
  care_humidity: 'Luftfuktighet',
  care_temperature: 'Temperatur',
  difficulty_easy: 'Lett',
  difficulty_moderate: 'Middels',
  difficulty_hard: 'Vanskelig',

  sched_none: 'Ingen stelloppgaver ennå.',
  sched_done: 'Ferdig',
  sched_every: 'hver {n}. dag',
  due_overdue: 'Forfalt',
  due_today: 'Forfaller i dag',
  due_tomorrow: 'I morgen',
  due_inDays: 'Om {n} dager',
  due_short: 'Forfaller',

  plant_due: '{n} forfaller',

  plants_today: 'I dag',
  plants_myPlants: 'Mine planter',
  plants_loading: 'Laster …',
  plants_emptyMsg: 'Du har ikke lagret noen planter ennå.',
  plants_identifyFirst: 'Identifiser din første plante',
  plants_nothingDue: '🎉 Ingenting forfaller i dag. Plantene dine er i orden.',

  detail_notFound: 'Fant ikke den planten.',
  detail_back: 'Tilbake til mine planter',
  detail_remove: 'Fjern plante',
  detail_confirmRemove: 'Fjerne {name}?',

  chat_title: 'Spør om denne planten',
  chat_placeholder: 'f.eks. Hvorfor er bladene gule?',
  chat_ask: 'Spør',
  chat_thinking: 'Tenker …',
  chat_requestFailed: 'Forespørselen mislyktes.',

  lang_aria: 'Bytt språk',
};

const th: Dict = {
  nav_myPlants: 'ต้นไม้ของฉัน',

  home_title: 'นี่คือต้นไม้อะไร?',
  home_subtitle: 'ถ่ายรูปเพื่อระบุชนิดและรับเคล็ดลับการดูแลง่าย ๆ',
  home_tip: 'เคล็ดลับ: ให้ต้นไม้ต้นเดียวเต็มเฟรมในที่แสงสว่างเพียงพอ',
  home_identifying: 'กำลังระบุชนิดต้นไม้ของคุณ…',
  home_tryAgain: 'ลองอีกครั้ง',
  home_tryAnother: 'ลองรูปอื่น',
  home_notIdentified: 'ฉันไม่สามารถระบุชนิดต้นไม้ได้อย่างมั่นใจ',
  home_couldNotIdentify: 'ไม่สามารถระบุชนิดต้นไม้ได้',
  home_genericError: 'เกิดข้อผิดพลาดบางอย่าง',
  home_careSchedule: 'ตารางการดูแล',
  home_save: 'บันทึกลงต้นไม้ของฉัน',
  home_retake: 'ถ่ายใหม่',
  confidence_label: 'ความมั่นใจ{level}',
  conf_high: 'สูง',
  conf_medium: 'ปานกลาง',
  conf_low: 'ต่ำ',

  capture_identify: 'ระบุชนิดต้นไม้',
  capture_readError: 'ขออภัย อ่านรูปนี้ไม่ได้ ลองรูปอื่น',

  care_title: 'การดูแลโดยสังเขป',
  care_light: 'แสง',
  care_water: 'น้ำ',
  care_soil: 'ดิน',
  care_humidity: 'ความชื้น',
  care_temperature: 'อุณหภูมิ',
  difficulty_easy: 'ง่าย',
  difficulty_moderate: 'ปานกลาง',
  difficulty_hard: 'ยาก',

  sched_none: 'ยังไม่มีงานดูแล',
  sched_done: 'เสร็จ',
  sched_every: 'ทุก {n} วัน',
  due_overdue: 'เลยกำหนด',
  due_today: 'ครบกำหนดวันนี้',
  due_tomorrow: 'พรุ่งนี้',
  due_inDays: 'อีก {n} วัน',
  due_short: 'ครบกำหนด',

  plant_due: 'ครบกำหนด {n}',

  plants_today: 'วันนี้',
  plants_myPlants: 'ต้นไม้ของฉัน',
  plants_loading: 'กำลังโหลด…',
  plants_emptyMsg: 'คุณยังไม่ได้บันทึกต้นไม้ใด ๆ',
  plants_identifyFirst: 'ระบุต้นไม้ต้นแรกของคุณ',
  plants_nothingDue: '🎉 ไม่มีงานครบกำหนดวันนี้ ต้นไม้ของคุณเรียบร้อยดี',

  detail_notFound: 'ไม่พบต้นไม้ต้นนั้น',
  detail_back: 'กลับไปที่ต้นไม้ของฉัน',
  detail_remove: 'ลบต้นไม้',
  detail_confirmRemove: 'ลบ {name} หรือไม่?',

  chat_title: 'ถามเกี่ยวกับต้นไม้นี้',
  chat_placeholder: 'เช่น ทำไมใบถึงเหลือง?',
  chat_ask: 'ถาม',
  chat_thinking: 'กำลังคิด…',
  chat_requestFailed: 'คำขอไม่สำเร็จ',

  lang_aria: 'เปลี่ยนภาษา',
};

export const messages: Record<Locale, Dict> = { en, no, th };

export type MessageKey = keyof typeof en;

/**
 * Look up a translation, falling back to English, then to the raw key.
 * Replaces `{name}` placeholders from `params`.
 */
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template = messages[locale]?.[key] ?? messages.en[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    name in params ? String(params[name]) : `{${name}}`,
  );
}
