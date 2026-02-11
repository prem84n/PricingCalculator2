
export enum Persona {
  PUBLIC = 'PUBLIC',
  PRESALES = 'PRESALES',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_ADMIN = 'SALES_ADMIN'
}

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  FINAL = 'FINAL',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Persona;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  internalOnly?: boolean;
  configurations: ConfigOption[];
  addons: Addon[];
}

export interface ConfigOption {
  name: string;
  type: 'select' | 'slider' | 'number';
  options?: { label: string; value: string; priceMultiplier: number }[];
  min?: number;
  max?: number;
  unit?: string;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  selectedConfigs: Record<string, string | number>;
  selectedAddons: string[];
  unitPrice: number;
  totalPrice: number;
  discount?: number; 
}

export interface ContactDetails {
  fullName: string;
  organization: string;
  mobile: string;
  email: string;
}

export interface Quote {
  id: string;
  customer: ContactDetails;
  items: CartItem[];
  totalEstimate: number;
  status: QuoteStatus;
  createdAt: string;
  createdBy: Persona;
  assignedTo?: string;
  discountValue?: number;
}

export interface WorkflowRule {
  id: string;
  name: string;
  condition: 'item_value' | 'total_value' | 'discount_pct';
  threshold: number;
  approver: Persona;
}

export interface ConfigRule {
  id: string;
  name: string;
  productId: string;
  triggerConfig: string;
  triggerValue: string;
  restrictedConfig: string;
  action: 'REQUIRE' | 'DISABLE' | 'SET_VALUE';
}
