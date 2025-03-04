export enum Role {
  BAN = 'blocked',
  USER = 'user',
  ADMIN = 'admin',
}

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE_ARTICLE = 'like_article',
  LIKE_REEL = 'like_reel',
}

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
