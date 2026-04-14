export type QuoteVisibility = 'public' | 'internal' | 'redacted';

export interface GroupProfile {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  mission: string;
  locationHint: string;
  updateCadence: string;
  startedAt: string;
  curator: string;
  ownerName: string;
  ownerRole: string;
  ownerBio: string;
  ownerAvatar: string;
  principles: string[];
  trustStatement: string;
}

export interface TimelineStage {
  id: string;
  label: string;
  period: string;
  summary: string;
  tone: string;
  color: 'blue' | 'cyan' | 'indigo' | 'pink' | 'green';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  summary: string;
  stageId: string;
  tags: string[];
  quote?: string;
  quoteVisibility: QuoteVisibility;
  sourceIds: string[];
}

export interface Milestone {
  id: string;
  title: string;
  label: string;
  summary: string;
  metric: string;
  date: string;
  color: 'blue' | 'cyan' | 'indigo' | 'pink' | 'green';
}

export interface CorePerson {
  id: string;
  name: string;
  role: string;
  bio: string;
  contribution: string;
  keywords: string[];
  avatar?: string;
}

export interface GroupInsight {
  id: string;
  title: string;
  body: string;
  accent: 'blue' | 'cyan' | 'indigo' | 'pink' | 'green';
}

export type ReleaseType = "daily" | "weekly" | "monthly" | "rebuild";

export interface ReleaseMetric {
  label: string;
  value: string;
}

export interface DailyDigestItem {
  id: string;
  title: string;
  detail: string;
}

export interface ReleaseSummary {
  id: string;
  type: ReleaseType;
  label: string;
  publishedAt: string;
  periodStart: string;
  periodEnd: string;
  summary: string;
  editorNote?: string;
  highlights: string[];
  metrics: ReleaseMetric[];
  dailyDigest: DailyDigestItem[];
}

export interface ReleaseHistoryItem {
  id: string;
  type: ReleaseType;
  label: string;
  publishedAt: string;
  periodStart: string;
  periodEnd: string;
  summary: string;
}

export interface PublishedChronicle {
  generatedAt: string;
  release: ReleaseSummary;
  releaseHistory: ReleaseHistoryItem[];
  group: GroupProfile;
  stages: TimelineStage[];
  milestones: Milestone[];
  events: TimelineEvent[];
  corePeople: CorePerson[];
  insights: GroupInsight[];
}

export interface RawImportBatch {
  id: string;
  groupId: string;
  sourceLabel: string;
  sourceType: 'wechat-text' | 'manual-copy' | 'prepared-json' | 'wechat-backup-package';
  importedAt: string;
  coverageStart?: string;
  coverageEnd?: string;
  fileNames: string[];
  notes?: string;
}

export interface NormalizedMessage {
  id: string;
  batchId: string;
  groupId: string;
  timestamp: string;
  sender: string;
  content: string;
  contentType: 'text' | 'system' | 'media-placeholder';
  duplicateKey: string;
  redactionFlags: string[];
}

export interface DraftPackage {
  batch: RawImportBatch;
  messages: NormalizedMessage[];
  candidateEvents: TimelineEvent[];
  draftSummary: string;
  requiresReview: boolean;
}
