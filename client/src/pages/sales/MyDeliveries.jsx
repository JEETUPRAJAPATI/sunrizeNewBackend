import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Filter, Edit, Trash2, Eye, Truck, MapPin } from 'lucide-react';

// Dummy data
const dummyDeliveries = [
  {
    id: 'DEL001',
    orderId: 'ORD001',
    customer: 'ABC Manufacturing',
    deliveryDate: '2025-06-25',
    address: '123 Industrial Area, Mumbai, Maharashtra',
    status: 'In Transit',
    priority: 'High',
    trackingNumber: 'TRK123456789',
    driver: 'Rajesh Kumar',
    vehicle: 'MH01AB1234',
    items: 5,
    value: 125000
  },
  {
    id: 'DEL002',
    orderId: 'ORD002',
    customer: 'XYZ Industries',
    deliveryDate: '2025-06-24',
    address: '456 Tech Park, Bangalore, Karnataka',
    status: 'Delivered',
    priority: 'Medium',
    trackingNumber: 'TRK987654321',
    driver: 'Suresh Patel',
    vehicle: 'KA03CD5678',
    items: 3,
    value: 75000
  },
  {
    id: 'DEL003',
    orderId: 'ORD003',
    customer: 'Tech Solutions Ltd',
    deliveryDate: '2025-06-26',
    address: '789 Cyber City, Pune, Maharashtra',
    status: 'Scheduled',
    priority: 'Low',
    trackingNumber: 'TRK456789123',
    driver: 'Amit Singh',
    vehicle: 'MH12EF9012',
    items: 8,
    value: 200000
  }
];

export default function MyDeliveries() {
  const [deliveries, setDeliveries] = useState(dummyDeliveries);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    customer: '',
    deliveryDate: '',
    address: '',
    priority: 'Medium',
    driver: '',
    vehicle: '',
    items: '',
    value: ''
  });

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Scheduled': return 'outline';
      case 'In Transit': return 'default';
      case 'Delivered': return 'secondary';
      case 'Delayed': return 'destructive';
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
    const newDelivery = {
      id: `DEL${String(deliveries.length + 1).padStart(3, '0')}`,
      orderId: formData.orderId,
      customer: formData.customer,
      deliveryDate: formData.deliveryDate,
      address: formData.address,
      status: 'Scheduled',
      priority: formData.priority,
      trackingNumber: `TRK${Math.random().toString().substr(2, 9)}`,
      driver: formData.driver,
      vehicle: formData.vehicle,
      items: parseInt(formData.items),
      value: parseInt(formData.value)
    };
    setDeliveries([...deliveries, newDelivery]);
    setFormData({
      orderId: '', customer: '', deliveryDate: '', address: '', priority: 'Medium',
      driver: '', vehicle: '', items: '', value: ''
    });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (delivery) => {
    setSelectedDelivery(delivery);
    setFormData({
      orderId: delivery.orderId,
      customer: delivery.customer,
      deliveryDate: delivery.deliveryDate,
      address: delivery.address,
      priority: delivery.priority,
      driver: delivery.driver,
      vehicle: delivery.vehicle,
      items: delivery.items.toString(),
      value: delivery.value.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedDeliveries = deliveries.map(delivery =>
      delivery.id === selectedDelivery.id
        ? {
            ...delivery,
            orderId: formData.orderId,
            customer: formData.customer,
            deliveryDate: formData.deliveryDate,
            address: formData.address,
            priority: formData.priority,
            driver: formData.driver,
            vehicle: formData.vehicle,
            items: parseInt(formData.items),
            value: parseInt(formData.value)
          }
        : delivery
    );
    setDeliveries(updatedDeliveries);
    setIsEditModalOpen(false);
    setSelectedDelivery(null);
  };

  const handleDelete = (id) => {
    setDeliveries(deliveries.filter(delivery => delivery.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Deliveries</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Delivery</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  placeholder="Enter order ID"
                />
              </div>
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
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
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
              <div className="col-span-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete delivery address"
                />
              </div>
              <div>
                <Label htmlFor="driver">Driver</Label>
                <Input
                  id="driver"
                  value={formData.driver}
                  onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                  placeholder="Enter driver name"
                />
              </div>
              <div>
                <Label htmlFor="vehicle">Vehicle Number</Label>
                <Input
                  id="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  placeholder="Enter vehicle number"
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
                <Label htmlFor="value">Total Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter total value"
                />
              </div>
              <div className="col-span-2">
                <Button onClick={handleCreate} className="w-full">Schedule Delivery</Button>
              </div>
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
                  placeholder="Search deliveries..."
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
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Deliveries List */}
      <div className="grid gap-4">
        {filteredDeliveries.map((delivery) => (
          <Card key={delivery.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{delivery.id}</h3>
                    <Badge variant={getStatusBadgeVariant(delivery.status)}>{delivery.status}</Badge>
                    <Badge variant={getPriorityBadgeVariant(delivery.priority)}>{delivery.priority}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{delivery.orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{delivery.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Date</p>
                      <p className="font-medium">{delivery.deliveryDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tracking</p>
                      <p className="font-medium">{delivery.trackingNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <p className="text-sm text-gray-600">{delivery.address}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{delivery.driver} - {delivery.vehicle}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Items: {delivery.items} | Value: ₹{delivery.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(delivery)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(delivery.id)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Delivery</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-orderId">Order ID</Label>
              <Input
                id="edit-orderId"
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-customer">Customer</Label>
              <Input
                id="edit-customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-deliveryDate">Delivery Date</Label>
              <Input
                id="edit-deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
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
            <div className="col-span-2">
              <Label htmlFor="edit-address">Delivery Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-driver">Driver</Label>
              <Input
                id="edit-driver"
                value={formData.driver}
                onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-vehicle">Vehicle Number</Label>
              <Input
                id="edit-vehicle"
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
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
              <Label htmlFor="edit-value">Total Value</Label>
              <Input
                id="edit-value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Button onClick={handleUpdate} className="w-full">Update Delivery</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">No deliveries found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default MyDeliveries;