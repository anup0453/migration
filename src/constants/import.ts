export enum ImportDocumentType {
  website = 'website',
  file = 'file',
}

export enum ImportDocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  TRAINING = 'training',
  TRAINED = 'trained',
  REMOVED = 'removed',
  UNTRAINING = 'untraining',
  UNTRAINED = 'untrained',
  FAILED = 'failed',
}

export enum UpdateFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum UploadDocumentType {
  MANUAL = 'manual',
  PIPELINE = 'pipeline',
  CRAWLER = 'crawler',
}
