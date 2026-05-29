export type UserRole = 'owner' | 'collaborator' | 'legal-collaborator' | 'viewer';
export type PresenceStatus = 'available' | 'focused' | 'in-session' | 'away';
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'review';
export type LibraryItemType = 'contract' | 'letter' | 'request' | 'declaration' | 'checklist' | 'agreement' | 'notice' | 'sop' | 'form' | 'playbook';
export type RepairSeverity = 'low' | 'medium' | 'high' | 'urgent';
export type HouseMode = 'council' | 'library' | 'vault' | 'repairs';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: any;
}

export interface House {
  id: string;
  name: string;
  description: string;
  mantra: string;
  intention: string;
  order: number;
  label: string;
  status: 'clear' | 'active' | 'attention' | 'critical';
}

export interface CouncilMember {
  id: string;
  houseId: string;
  name: string;
  role: string;
  contactInfo: string;
  notes?: string;
  status: 'active' | 'inactive';
}

export interface LibraryItem {
  id: string;
  houseId: string;
  title: string;
  type: LibraryItemType;
  description: string;
  status: 'draft' | 'approved' | 'archived';
}

export interface VaultDocument {
  id: string;
  houseId: string;
  fileName: string;
  fileUrl: string;
  uploadDate: any;
  docDate?: string;
  source?: string;
  aiSummary?: string;
  userSummary?: string;
  tags: string[];
  confidentiality: 'public' | 'private' | 'restricted';
}

export interface Repair {
  id: string;
  houseId: string;
  title: string;
  category: string;
  severity: RepairSeverity;
  description: string;
  status: 'open' | 'resolved' | 'blocked';
  deadline?: any;
}

export interface RoadmapTask {
  id: string;
  userId: string;
  houseId: string;
  title: string;
  status: TaskStatus;
  order: number;
  createdAt: any;
}

export interface Presence {
  userId: string;
  houseId: string;
  status: PresenceStatus;
  lastSeen: any;
  displayName?: string;
}
