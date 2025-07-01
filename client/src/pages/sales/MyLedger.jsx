import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

// Dummy data
const dummyLedgerEntries = [
  {
    id: 'TXN001',
    date: '2025-06-20',
    particular: 'Invoice INV/2025/001 - ABC Manufacturing',
    type: 'Sale',
    debit: 147500,
    credit: 0,
    balance: 147500,
    reference: 'INV001'
  },
  {
    id: 'TXN002',
    date: '2025-06-20',
    particular: 'Payment Received - ABC Manufacturing',
    type: 'Receipt',
    debit: 0,
    credit: 147500,
    balance: 0,
    reference: 'PAY001'
  },
  {
    id: 'TXN003',
    date: '2025-06-18',
    particular: 'Invoice INV/2025/002 - XYZ Industries',
    type: 'Sale',
    debit: 88500,
    credit: 0,
    balance: 88500,
    reference: 'INV002'
  },
  {
    id: 'TXN004',
    date: '2025-06-15',
    particular: 'Invoice INV/2025/003 - Tech Solutions Ltd',
    type: 'Sale',
    debit: 236000,
    credit: 0,
    balance: 324500,
    reference: 'INV003'
  },
  {
    id: 'TXN005',
    date: '2025-06-14',
    particular: 'Sales Return - Tech Solutions Ltd',
    type: 'Return',
    debit: 0,
    credit: 24000,
    balance: 300500,
    reference: 'RET001'
  },
  {
    id: 'TXN006',
    date: '2025-06-12',
    particular: 'Commission Expense',
    type: 'Expense',
    debit: 0,
    credit: 15000,
    balance: 285500,
    reference: 'EXP001'
  }
];

const dummyCustomerLedgers = [
  {
    customer: 'ABC Manufacturing',
    totalSales: 147500,
    totalReceived: 147500,
    balance: 0,
    lastTransaction: '2025-06-20'
  },
  {
    customer: 'XYZ Industries',
    totalSales: 88500,
    totalReceived: 0,
    balance: 88500,
    lastTransaction: '2025-06-18'
  },
  {
    customer: 'Tech Solutions Ltd',
    totalSales: 236000,
    totalReceived: 0,
    balance: 212000,
    lastTransaction: '2025-06-15'
  }
];

export default function MyLedger() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState(dummyLedgerEntries);
  const [customerLedgers, setCustomerLedgers] = useState(dummyCustomerLedgers);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.particular.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesDateFrom = !dateFrom || transaction.date >= dateFrom;
    const matchesDateTo = !dateTo || transaction.date <= dateTo;
    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const filteredCustomers = customerLedgers.filter(customer =>
    customer.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case 'Sale': return 'default';
      case 'Receipt': return 'secondary';
      case 'Return': return 'destructive';
      case 'Expense': return 'outline';
      default: return 'outline';
    }
  };

  const totalSales = transactions
    .filter(t => t.type === 'Sale')
    .reduce((sum, t) => sum + t.debit, 0);

  const totalReceipts = transactions
    .filter(t => t.type === 'Receipt')
    .reduce((sum, t) => sum + t.credit, 0);

  const outstandingBalance = customerLedgers.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Ledger</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">₹{totalSales.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">₹{totalReceipts.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Receipts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">₹{outstandingBalance.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Outstanding Balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{customerLedgers.length}</div>
            <p className="text-sm text-gray-600">Active Customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'transactions' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('transactions')}
        >
          Transaction Ledger
        </Button>
        <Button
          variant={activeTab === 'customers' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('customers')}
        >
          Customer Ledger
        </Button>
      </div>

      {activeTab === 'transactions' && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Receipt">Receipt</SelectItem>
                      <SelectItem value="Return">Return</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="From Date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    type="date"
                    placeholder="To Date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Particulars</th>
                      <th className="text-center p-3">Type</th>
                      <th className="text-right p-3">Debit</th>
                      <th className="text-right p-3">Credit</th>
                      <th className="text-right p-3">Balance</th>
                      <th className="text-center p-3">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{transaction.date}</td>
                        <td className="p-3">{transaction.particular}</td>
                        <td className="p-3 text-center">
                          <Badge variant={getTypeBadgeVariant(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-medium">
                          {transaction.debit > 0 ? `₹${transaction.debit.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 text-right font-medium">
                          {transaction.credit > 0 ? `₹${transaction.credit.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3 text-right font-bold">
                          ₹{transaction.balance.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">{transaction.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'customers' && (
        <>
          {/* Customer Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Ledger Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCustomers.map((customer, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{customer.customer}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="font-semibold text-green-600">₹{customer.totalSales.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Received</p>
                        <p className="font-semibold text-blue-600">₹{customer.totalReceived.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Outstanding Balance</p>
                      <p className={`text-lg font-bold ${customer.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        ₹{customer.balance.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Transaction</p>
                      <p className="text-sm">{customer.lastTransaction}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {((activeTab === 'transactions' && filteredTransactions.length === 0) ||
        (activeTab === 'customers' && filteredCustomers.length === 0)) && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No records found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyLedger;