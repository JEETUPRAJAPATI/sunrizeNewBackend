import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, Edit, Trash2, Eye, Download, Send } from 'lucide-react';

// Dummy data
const dummyInvoices = [
  {
    id: 'INV001',
    invoiceNumber: 'INV/2025/001',
    customer: 'ABC Manufacturing',
    date: '2025-06-20',
    dueDate: '2025-07-20',
    amount: 125000,
    taxAmount: 22500,
    totalAmount: 147500,
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    items: [
      { name: 'Product A', quantity: 2, rate: 50000, amount: 100000 },
      { name: 'Product B', quantity: 1, rate: 25000, amount: 25000 }
    ]
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV/2025/002',
    customer: 'XYZ Industries',
    date: '2025-06-18',
    dueDate: '2025-07-18',
    amount: 75000,
    taxAmount: 13500,
    totalAmount: 88500,
    status: 'Pending',
    paymentMethod: null,
    items: [
      { name: 'Product C', quantity: 3, rate: 25000, amount: 75000 }
    ]
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV/2025/003',
    customer: 'Tech Solutions Ltd',
    date: '2025-06-15',
    dueDate: '2025-07-15',
    amount: 200000,
    taxAmount: 36000,
    totalAmount: 236000,
    status: 'Overdue',
    paymentMethod: null,
    items: [
      { name: 'Product D', quantity: 4, rate: 30000, amount: 120000 },
      { name: 'Product E', quantity: 2, rate: 40000, amount: 80000 }
    ]
  }
];

export default function MyInvoices() {
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    taxAmount: '',
    dueDate: ''
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Pending': return 'secondary';
      case 'Overdue': return 'destructive';
      case 'Draft': return 'outline';
      default: return 'outline';
    }
  };

  const handleCreate = () => {
    const newInvoice = {
      id: `INV${String(invoices.length + 1).padStart(3, '0')}`,
      invoiceNumber: `INV/2025/${String(invoices.length + 1).padStart(3, '0')}`,
      customer: formData.customer,
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      amount: parseInt(formData.amount),
      taxAmount: parseInt(formData.taxAmount),
      totalAmount: parseInt(formData.amount) + parseInt(formData.taxAmount),
      status: 'Draft',
      paymentMethod: null,
      items: []
    };
    setInvoices([...invoices, newInvoice]);
    setFormData({ customer: '', amount: '', taxAmount: '', dueDate: '' });
    setIsCreateModalOpen(false);
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };

  const markAsPaid = (id) => {
    setInvoices(invoices.map(invoice =>
      invoice.id === id ? { ...invoice, status: 'Paid', paymentMethod: 'Bank Transfer' } : invoice
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Invoices</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Input
                  id="customer"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (Before Tax)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <Label htmlFor="taxAmount">Tax Amount</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  value={formData.taxAmount}
                  onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                  placeholder="Enter tax amount"
                />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Invoice</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">₹{invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}</div>
            <p className="text-sm text-gray-600">Total Invoice Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              ₹{invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Paid Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              ₹{invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Pending Amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              ₹{invoices.filter(inv => inv.status === 'Overdue').reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Overdue Amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Invoice #</th>
                  <th className="text-left p-2">Customer</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Due Date</th>
                  <th className="text-right p-2">Amount</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{invoice.invoiceNumber}</td>
                    <td className="p-2">{invoice.customer}</td>
                    <td className="p-2">{invoice.date}</td>
                    <td className="p-2">{invoice.dueDate}</td>
                    <td className="p-2 text-right font-medium">₹{invoice.totalAmount.toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleView(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'Paid' && (
                          <Button variant="outline" size="sm" onClick={() => markAsPaid(invoice.id)}>
                            Pay
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleDelete(invoice.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Invoice Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{selectedInvoice.invoiceNumber}</h3>
                  <p className="text-gray-600">Date: {selectedInvoice.date}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(selectedInvoice.status)} className="text-lg px-3 py-1">
                  {selectedInvoice.status}
                </Badge>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700">Bill To:</h4>
                  <p className="text-lg font-medium">{selectedInvoice.customer}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Payment Due:</h4>
                  <p className="text-lg">{selectedInvoice.dueDate}</p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Items:</h4>
                <table className="w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 border">Item</th>
                      <th className="text-center p-3 border">Qty</th>
                      <th className="text-right p-3 border">Rate</th>
                      <th className="text-right p-3 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="p-3 border">{item.name}</td>
                        <td className="p-3 border text-center">{item.quantity}</td>
                        <td className="p-3 border text-right">₹{item.rate.toLocaleString()}</td>
                        <td className="p-3 border text-right">₹{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {selectedInvoice.paymentMethod && (
                <div className="text-green-600">
                  <span className="font-medium">Payment Method: </span>
                  {selectedInvoice.paymentMethod}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredInvoices.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No invoices found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyInvoices;