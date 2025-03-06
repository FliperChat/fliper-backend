//User Enums
export enum Role {
  USER = 'user', // Обычный пользователь
  SUPPORT = 'support', // Поддержка пользователей
  EDITOR = 'editor', // Редактор контента
  INFLUENCER = 'influencer', // Известные личности
  DEVELOPER = 'developer', // Разработчик
  PARTNER = 'partner', // Бренды, компании, рекламодатели
  MODERATOR = 'moderator', // Модератор
  ADMIN = 'admin', // Администратор
}

// Notification Enums
export enum NotificationType {
  FOLLOW = 'follow',
  LIKE_ARTICLE = 'like_article',
  LIKE_REEL = 'like_reel',
}

// Report Enums
export enum ReportReasonType {
  SPAM = 'spam',
  ABUSE = 'abuse',
  HateSpeech = 'hate_speech',
  CopyrightViolation = 'CopyrightViolation',
  OTHER = 'other',
}
export enum ReportTargetType {
  SPAM = 'Article',
  USER = 'User',
  REEL = 'Reel',
}

// Support Enums
export enum SupportCategory {
  BUG = 'bug',
  PAYMENT = 'payment',
  ACCOUNT = 'account',
  OTHER = 'other',
}
export enum SupportStatus {
  OPEN = 'open',
  PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}
export enum SupportSender {
  USER = 'user',
  SUPPORT = 'support',
}

// Error Enums
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}
export enum ErrorStatus {
  OPEN = 'open',
  PROGRESS = 'in_progress',
  PAUSE = 'pause',
  CLOSED = 'closed',
}
