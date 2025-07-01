import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const createSeedUsers = async () => {
  try {
    console.log('Creating seed users...');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    const users = [
      {
        username: 'admin',
        email: 'admin@company.com',
        password: await bcrypt.hash('admin123', 12),
        fullName: 'Admin User',
        role: 'Super User',
        isActive: true,
        permissions: {
          role: 'super_user',
          canAccessAllUnits: true,
          modules: [
            {
              name: 'dashboard',
              dashboard: true,
              features: [
                { key: 'overview', view: true, add: false, edit: false, delete: false, alter: false },
                { key: 'analytics', view: true, add: false, edit: false, delete: false, alter: true }
              ]
            },
            {
              name: 'orders',
              dashboard: true,
              features: [
                { key: 'allOrders', view: true, add: true, edit: true, delete: true, alter: true },
                { key: 'orderReport', view: true, add: false, edit: false, delete: false, alter: true }
              ]
            },
            {
              name: 'sales',
              dashboard: true,
              features: [
                { key: 'allIndents', view: true, add: true, edit: true, delete: true, alter: false },
                { key: 'allCustomers', view: true, add: true, edit: true, delete: true, alter: false },
                { key: 'allDeliveries', view: true, add: true, edit: true, delete: true, alter: false },
                { key: 'allInvoices', view: true, add: true, edit: true, delete: true, alter: false },
                { key: 'allLedger', view: true, add: true, edit: true, delete: true, alter: false }
              ]
            },
            {
              name: 'dispatches',
              dashboard: true,
              features: [
                { key: 'dispatchNotes', view: true, add: true, edit: true, delete: true, alter: true },
                { key: 'proofOfDelivery', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            },
            {
              name: 'accounts',
              dashboard: true,
              features: [
                { key: 'paymentRegister', view: true, add: true, edit: true, delete: true, alter: true },
                { key: 'creditNotes', view: true, add: true, edit: true, delete: true, alter: true },
                { key: 'ledgerReport', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            },
            {
              name: 'inventory',
              dashboard: true,
              features: [
                { key: 'items', view: true, add: true, edit: true, delete: true, alter: true },
                { key: 'categories', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            },
            {
              name: 'customers',
              dashboard: true,
              features: [
                { key: 'addEditView', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            },
            {
              name: 'suppliers',
              dashboard: true,
              features: [
                { key: 'addEditView', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            },
            {
              name: 'purchases',
              dashboard: true,
              features: [
                { key: 'allPurchases', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            },
            {
              name: 'manufacturing',
              dashboard: true,
              features: [
                { key: 'allJobs', view: true, add: true, edit: true, delete: true, alter: true }
              ]
            }
          ]
        }
      },
      {
        username: 'unithead',
        email: 'unithead@company.com',
        password: await bcrypt.hash('unit123', 12),
        fullName: 'Unit Head',
        role: 'Unit Head',
        isActive: true,
        permissions: {
          role: 'unit_head',
          canAccessAllUnits: false,
          modules: [
            {
              name: 'dashboard',
              dashboard: true,
              features: [
                { key: 'overview', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'orders',
              dashboard: true,
              features: [
                { key: 'allOrders', view: true, add: true, edit: true, delete: false, alter: false }
              ]
            },
            {
              name: 'sales',
              dashboard: true,
              features: [
                { key: 'myCustomers', view: true, add: true, edit: false, delete: false, alter: false },
                { key: 'invoices', view: true, add: false, edit: false, delete: false, alter: false },
                { key: 'ledger', view: false, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'inventory',
              dashboard: true,
              features: [
                { key: 'stockIn', view: true, add: false, edit: true, delete: false, alter: false },
                { key: 'stockOut', view: false, add: false, edit: false, delete: false, alter: false }
              ]
            }
          ]
        }
      },
      {
        username: 'production',
        email: 'production@company.com',
        password: await bcrypt.hash('prod123', 12),
        fullName: 'Production Manager',
        role: 'Production',
        isActive: true,
        permissions: {
          role: 'production',
          canAccessAllUnits: false,
          modules: [
            {
              name: 'dashboard',
              dashboard: true,
              features: [
                { key: 'overview', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'manufacturing',
              dashboard: true,
              features: [
                { key: 'allJobs', view: true, add: true, edit: true, delete: false, alter: true }
              ]
            },
            {
              name: 'inventory',
              dashboard: true,
              features: [
                { key: 'items', view: true, add: false, edit: true, delete: false, alter: false }
              ]
            }
          ]
        }
      },
      {
        username: 'packing',
        email: 'packing@company.com',
        password: await bcrypt.hash('pack123', 12),
        fullName: 'Packing Supervisor',
        role: 'Packing',

        isActive: true,
        permissions: {
          role: 'packing',
          canAccessAllUnits: false,
          modules: [
            {
              name: 'dashboard',
              dashboard: true,
              features: [
                { key: 'overview', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'dispatches',
              dashboard: true,
              features: [
                { key: 'dispatchNotes', view: true, add: false, edit: true, delete: false, alter: false }
              ]
            }
          ]
        }
      },
      {
        username: 'dispatch',
        email: 'dispatch@company.com',
        password: await bcrypt.hash('disp123', 12),
        fullName: 'Dispatch Manager',
        role: 'Dispatch',

        isActive: true,
        permissions: {
          role: 'dispatch',
          canAccessAllUnits: false,
          modules: [
            {
              name: 'dashboard',
              dashboard: true,
              features: [
                { key: 'overview', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'dispatches',
              dashboard: true,
              features: [
                { key: 'dispatchNotes', view: true, add: true, edit: true, delete: false, alter: true },
                { key: 'proofOfDelivery', view: true, add: true, edit: true, delete: false, alter: false }
              ]
            }
          ]
        }
      },
      {
        username: 'sales',
        email: 'sales@company.com',
        password: await bcrypt.hash('sales123', 12),
        fullName: 'Sales Manager',
        role: 'Sales',
        isActive: true,
        permissions: {
          role: 'sales',
          canAccessAllUnits: false,
          modules: [
            {
              name: 'sales',
              dashboard: true,
              features: [
                { key: 'myIndent', view: true, add: true, edit: false, delete: false, alter: false },
                { key: 'myCustomers', view: true, add: true, edit: false, delete: false, alter: false },
                { key: 'myDeliveries', view: true, add: false, edit: false, delete: false, alter: false },
                { key: 'myInvoices', view: true, add: false, edit: false, delete: false, alter: false },
                { key: 'myLedger', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'orders',
              dashboard: true,
              features: [
                { key: 'indent', view: true, add: false, edit: true, delete: false, alter: false },
                { key: 'orderReport', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            }
          ]
        }
      },
      {
        username: 'accounts',
        email: 'accounts@company.com',
        password: await bcrypt.hash('acc123', 12),
        fullName: 'Accounts Manager',
        role: 'Accounts',
        isActive: true,
        permissions: {
          role: 'accounts',
          canAccessAllUnits: false,
          modules: [
            {
              name: 'dashboard',
              dashboard: true,
              features: [
                { key: 'overview', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'accounts',
              dashboard: true,
              features: [
                { key: 'paymentRegister', view: true, add: true, edit: true, delete: false, alter: true },
                { key: 'creditNotes', view: true, add: true, edit: true, delete: false, alter: false },
                { key: 'ledgerReport', view: true, add: false, edit: false, delete: false, alter: false }
              ]
            },
            {
              name: 'sales',
              dashboard: true,
              features: [
                { key: 'myInvoices', view: true, add: false, edit: false, delete: false, alter: false },
                { key: 'myLedger', view: true, add: false, edit: false, delete: false, alter: true }
              ]
            }
          ]
        }
      }
    ];

    await User.insertMany(users);
    console.log(`Created ${users.length} seed users successfully!`);
    console.log('Login credentials:');
    console.log('Super User: admin / admin123');
    console.log('Unit Head: unithead / unit123');
    console.log('Production: production / prod123');
    console.log('Packing: packing / pack123');
    console.log('Dispatch: dispatch / disp123');
    console.log('Sales: sales / sales123');
    console.log('Accounts: accounts / acc123');
  } catch (error) {
    console.error('Error creating seed users:', error);
  }
};

export default createSeedUsers;