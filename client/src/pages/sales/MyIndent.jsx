import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';

// Dummy data
const dummyIndents = [
  {
    id: 'IND001',
    date: '2025-06-20',
    customer: 'ABC Manufacturing',
    items: 5,
    totalAmount: 125000,
    status: 'Pending',
    priority: 'High',
    description: 'Manufacturing equipment order'
  },
  {
    id: 'IND002',
    date: '2025-06-18',
    customer: 'XYZ Industries',
    items: 3,
    totalAmount: 75000,
    status: 'Approved',
    priority: 'Medium',
    description: 'Spare parts requirement'
  },
  {
    id: 'IND003',
    date: '2025-06-15',
    customer: 'Tech Solutions Ltd',
    items: 8,
    totalAmount: 200000,
    status: 'In Progress',
    priority: 'Low',
    description: 'Software integration hardware'
  }
];

export default function MyIndent() {
  const [indents, setIndents] = useState(dummyIndents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState(null);
  const [formData, setFormData] = useState({
    customer: '',
    items: '',
    totalAmount: '',
    priority: 'Medium',
    description: ''
  });

  const filteredIndents = indents.filter(indent => {
    const matchesSearch = indent.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || indent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending': return 'destructive';
      case 'Approved': return 'default';
      case 'In Progress': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'outline';
    }
  };

  const handleCreate = () => {
    const newIndent = {
      id: `IND${String(indents.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: formData.customer,
      items: parseInt(formData.items),
      totalAmount: parseInt(formData.totalAmount),
      status: 'Pending',
      priority: formData.priority,
      description: formData.description
    };
    setIndents([...indents, newIndent]);
    setFormData({ customer: '', items: '', totalAmount: '', priority: 'Medium', description: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (indent) => {
    setSelectedIndent(indent);
    setFormData({
      customer: indent.customer,
      items: indent.items.toString(),
      totalAmount: indent.totalAmount.toString(),
      priority: indent.priority,
      description: indent.description
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedIndents = indents.map(indent =>
      indent.id === selectedIndent.id
        ? {
            ...indent,
            customer: formData.customer,
            items: parseInt(formData.items),
            totalAmount: parseInt(formData.totalAmount),
            priority: formData.priority,
            description: formData.description
          }
        : indent
    );
    setIndents(updatedIndents);
    setIsEditModalOpen(false);
    setSelectedIndent(null);
  };

  const handleDelete = (id) => {
    setIndents(indents.filter(indent => indent.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Indent</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Indent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Indent</DialogTitle>
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
                <Label htmlFor="items">Number of Items</Label>
                <Input
                  id="items"
                  type="number"
                  value={formData.items}
                  onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  placeholder="Enter number of items"
                />
              </div>
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="Enter total amount"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Indent</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search indents..."
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
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Indents List */}
      <div className="grid gap-4">
        {filteredIndents.map((indent) => (
          <Card key={indent.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{indent.id}</h3>
                    <Badge variant={getStatusBadgeVariant(indent.status)}>{indent.status}</Badge>
                    <Badge variant={getPriorityBadgeVariant(indent.priority)}>{indent.priority}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">Customer: {indent.customer}</p>
                  <p className="text-sm text-gray-600">Date: {indent.date}</p>
                  <p className="text-sm text-gray-600">Items: {indent.items} | Amount: ₹{indent.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{indent.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(indent)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(indent.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Indent</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-customer">Customer</Label>
              <Input
                id="edit-customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-items">Number of Items</Label>
              <Input
                id="edit-items"
                type="number"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-totalAmount">Total Amount</Label>
              <Input
                id="edit-totalAmount"
                type="number"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <Button onClick={handleUpdate} className="w-full">Update Indent</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filteredIndents.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No indents found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyIndent;