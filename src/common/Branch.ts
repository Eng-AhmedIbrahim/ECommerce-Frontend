export interface BranchToReturnDto {
  id: number;
  name: string;
  phoneNumber?: string | null;
  email?: string | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  location: string;
  isActive: boolean;
  createdOn?: string | null;
  companyId: number;
}
