
import { Product, Persona, WorkflowRule } from './types';

export const CATEGORIES = [
  'Compute', 'Networking', 'Storage', 'Web', 'Mobile', 
  'Containers', 'Databases', 'Analytics', 'AI + Machine Learning'
];

export const PRODUCTS: Product[] = [
  {
    id: 'vm-basic',
    name: 'Virtual Machines',
    category: 'Compute',
    description: 'Provision Windows and Linux virtual machines in seconds',
    basePrice: 50,
    configurations: [
      {
        name: 'Operating System',
        type: 'select',
        options: [
          { label: 'Linux', value: 'linux', priceMultiplier: 1 },
          { label: 'Windows', value: 'windows', priceMultiplier: 1.5 }
        ]
      },
      {
        name: 'Instance Configuration',
        type: 'select',
        options: [
          { label: '2 vCPU, 4 GB RAM', value: 'small', priceMultiplier: 1 },
          { label: '4 vCPU, 8 GB RAM', value: 'medium', priceMultiplier: 2 },
          { label: '8 vCPU, 16 GB RAM', value: 'large', priceMultiplier: 4 }
        ]
      }
    ],
    addons: [
      { id: 'backup', name: 'Daily Backup', price: 10, description: 'Automated snapshots' },
      { id: 'monitoring', name: 'Advanced Monitoring', price: 15, description: 'Detailed health checks' }
    ]
  },
  {
    id: 'db-postgres',
    name: 'PostgreSQL Database',
    category: 'Databases',
    description: 'Managed PostgreSQL database instance with high availability',
    basePrice: 80,
    configurations: [
      {
        name: 'Tier',
        type: 'select',
        options: [
          { label: 'General Purpose', value: 'gp', priceMultiplier: 1 },
          { label: 'Memory Optimized', value: 'mo', priceMultiplier: 1.8 }
        ]
      }
    ],
    addons: [
      { id: 'ha', name: 'High Availability', price: 50, description: 'Multi-region failover' }
    ]
  },
  {
    id: 'storage-blob',
    name: 'Blob Storage',
    category: 'Storage',
    description: 'Massively scalable object storage',
    basePrice: 0.02,
    configurations: [
      { name: 'Capacity (GB)', type: 'number', min: 1, max: 10000 }
    ],
    addons: []
  },
  {
    id: 'adv-gpu',
    name: 'H100 GPU Cluster',
    category: 'AI + Machine Learning',
    description: 'High performance GPU computing for training LLMs',
    basePrice: 5000,
    internalOnly: true,
    configurations: [
      { name: 'Nodes', type: 'number', min: 1, max: 64 }
    ],
    addons: [
      { id: 'interconnect', name: 'InfiniBand Interconnect', price: 1000, description: 'Ultra-low latency networking' }
    ]
  }
];

export const WORKFLOW_RULES: WorkflowRule[] = [
  { id: 'r1', name: 'High Value Cart Approval', condition: 'total_value', threshold: 10000, approver: Persona.SALES_MANAGER },
  { id: 'r2', name: 'Large Discount Approval', condition: 'discount_pct', threshold: 20, approver: Persona.SALES_ADMIN }
];
