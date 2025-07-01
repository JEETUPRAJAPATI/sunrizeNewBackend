import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Package, 
  Tag, 
  DollarSign, 
  Warehouse,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  showSmartToast, 
  showSuccessToast, 
  showValidationToast 
} from '@/lib/toast-utils';
import QuickAddCategory from './QuickAddCategory';

// Comprehensive validation schema
const inventorySchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters').max(100, 'Name too long'),
  code: z.string().optional(),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  customerCategory: z.string().optional().default('Retail'),
  type: z.string().min(1, 'Item type is required'),
  importance: z.string().min(1, 'Importance level is required'),
  unit: z.string().min(1, 'Unit is required'),
  qty: z.number().min(0, 'Quantity cannot be negative').default(0),
  minStock: z.number().min(0, 'Minimum stock cannot be negative').default(0),
  stdCost: z.number().min(0, 'Standard cost cannot be negative').default(0),
  purchaseCost: z.number().min(0, 'Purchase cost cannot be negative').default(0),
  salePrice: z.number().min(0, 'Sale price cannot be negative').default(0),
  mrp: z.number().min(0, 'MRP cannot be negative').default(0),
  gst: z.number().min(0, 'GST cannot be negative').max(100, 'GST cannot exceed 100%').default(0),
  hsn: z.string().optional(),
  batch: z.string().optional(),
  store: z.string().optional(),
  leadTime: z.number().min(0, 'Lead time cannot be negative').default(0),
  internalManufacturing: z.boolean().default(false),
  purchase: z.boolean().default(true),
  internalNotes: z.string().optional(),
});

const ITEM_TYPES = ['Product', 'Material', 'Spares', 'Assemblies'];
const IMPORTANCE_LEVELS = ['Low', 'Normal', 'High', 'Critical'];
const UNITS = ['pieces', 'kg', 'liters', 'meters', 'sheets', 'boxes', 'units', 'tons', 'cartons'];

export default function ModernInventoryForm({ 
  isOpen, 
  onClose, 
  item = null, 
  categories = [], 
  customerCategories = [],
  onSubmit, 
  isLoading = false 
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  // Get available subcategories based on selected category
  const availableSubCategories = React.useMemo(() => {
    if (!selectedCategory) return [];
    
    const selectedCat = categories.find(cat => cat.name === selectedCategory);
    console.log('DEBUG: Selected category:', selectedCategory);
    console.log('DEBUG: Found category object:', selectedCat);
    console.log('DEBUG: Available subcategories:', selectedCat?.subcategories);
    console.log('DEBUG: All categories:', categories);
    
    return selectedCat?.subcategories || [];
  }, [selectedCategory, categories]);
  const [serverErrors, setServerErrors] = useState({});

  const form = useForm({
    resolver: zodResolver(inventorySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      description: '',
      category: '',
      subCategory: '',
      customerCategory: 'Retail',
      type: 'Product',
      importance: 'Normal',
      unit: 'pieces',
      qty: 0,
      minStock: 0,
      stdCost: 0,
      purchaseCost: 0,
      salePrice: 0,
      mrp: 0,
      gst: 0,
      hsn: '',
      batch: '',
      store: '',
      leadTime: 0,
      internalManufacturing: false,
      purchase: true,
      internalNotes: '',
    }
  });

  // Reset form when modal opens/closes or item changes
  useEffect(() => {
    if (isOpen && item) {
      // Editing mode
      const itemData = {
        name: item.name || '',
        code: item.code || '',
        description: item.description || '',
        category: item.category || '',
        subCategory: item.subCategory || '',
        customerCategory: item.customerCategory || 'Retail',
        type: item.type || 'Product',
        importance: item.importance || 'Normal',
        unit: item.unit || 'pieces',
        qty: Number(item.qty) || 0,
        minStock: Number(item.minStock) || 0,
        stdCost: Number(item.stdCost) || 0,
        purchaseCost: Number(item.purchaseCost) || 0,
        salePrice: Number(item.salePrice) || 0,
        mrp: Number(item.mrp) || 0,
        gst: Number(item.gst) || 0,
        hsn: item.hsn || '',
        batch: item.batch || '',
        store: item.store || '',
        leadTime: Number(item.leadTime) || 0,
        internalManufacturing: Boolean(item.internalManufacturing),
        purchase: Boolean(item.purchase !== false),
        internalNotes: item.internalNotes || '',
      };
      
      form.reset(itemData);
      setSelectedCategory(item.category || '');
      setServerErrors({});
    } else if (isOpen && !item) {
      // Adding mode
      form.reset({
        name: '',
        code: '',
        description: '',
        category: '',
        subCategory: '',
        customerCategory: '',
        type: 'Product',
        importance: 'Normal',
        unit: 'pieces',
        qty: 0,
        minStock: 0,
        stdCost: 0,
        purchaseCost: 0,
        salePrice: 0,
        mrp: 0,
        gst: 0,
        hsn: '',
        batch: '',
        store: '',
        leadTime: 0,
        internalManufacturing: false,
        purchase: true,
        internalNotes: '',
      });
      setSelectedCategory('');
      setServerErrors({});
    }
  }, [isOpen, item, form]);



  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setServerErrors({});
    
    try {
      console.log('Form data received in handleSubmit:', data);
      console.log('Form values from form.getValues():', form.getValues());
      
      // Ensure all required fields are present
      const formData = {
        name: data.name || '',
        code: data.code || '',
        description: data.description || '',
        category: data.category || '',
        subCategory: data.subCategory || '',
        customerCategory: data.customerCategory || '',
        type: data.type || 'Product',
        importance: data.importance || 'Normal',
        unit: data.unit || 'pieces',
        qty: Number(data.qty) || 0,
        minStock: Number(data.minStock) || 0,
        stdCost: Number(data.stdCost) || 0,
        purchaseCost: Number(data.purchaseCost) || 0,
        salePrice: Number(data.salePrice) || 0,
        mrp: Number(data.mrp) || 0,
        gst: Number(data.gst) || 0,
        hsn: data.hsn || '',
        batch: data.batch || '',
        store: data.store || '',
        leadTime: Number(data.leadTime) || 0,
        internalManufacturing: Boolean(data.internalManufacturing),
        purchase: Boolean(data.purchase !== false),
        internalNotes: data.internalNotes || '',
        tags: data.tags || [],
        customerPrices: data.customerPrices || []
      };
      
      console.log('Processed form data for submission:', formData);
      
      await onSubmit(formData);
      
      // Success - close modal and reset form
      form.reset();
      setSelectedCategory('');
      setServerErrors({});
      onClose();
      
      showSuccessToast(
        `Item ${item ? 'Updated' : 'Created'}`,
        `Item "${data.name}" has been ${item ? 'updated' : 'created'} successfully`,
        { duration: 3000 }
      );
      
    } catch (error) {
      console.error('Form submission error:', error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        setServerErrors(errors);
        
        // Set form errors for individual fields
        Object.keys(errors).forEach(field => {
          form.setError(field, {
            type: 'server',
            message: errors[field]
          });
        });
        
        // Show smart validation toast
        showValidationToast(errors, `${item ? 'Edit' : 'Add'} Item Form`);
        
        // Scroll to first error field
        setTimeout(() => {
          const firstErrorField = Object.keys(errors)[0];
          const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            errorElement.focus();
          }
        }, 100);
      } else {
        // Use smart error categorization
        showSmartToast(error, `${item ? 'Update' : 'Create'} Item`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasErrors = Object.keys(form.formState.errors).length > 0 || Object.keys(serverErrors).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {item ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogDescription>
            {item ? 'Update item details and save changes' : 'Enter item information to add to inventory'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Item Information Section */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Item Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Enter basic details and identification information for your inventory item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-500">Item Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter item name" 
                            {...field}
                            className={form.formState.errors.name || serverErrors.name ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Auto-generated if empty" 
                            {...field}
                            className={form.formState.errors.code || serverErrors.code ? 'border-red-500' : ''}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter item description"
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-500">Item Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={form.formState.errors.type || serverErrors.type ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ITEM_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="importance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-500">Importance *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={form.formState.errors.importance || serverErrors.importance ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select importance" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {IMPORTANCE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                <Badge variant={level === 'Critical' ? 'destructive' : level === 'High' ? 'secondary' : 'outline'}>
                                  {level}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category Information Section */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-transparent dark:from-green-950/20">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Tag className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  Category Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Organize your item with appropriate categories and subcategories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between mb-2">
                          <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Product Category *
                          </FormLabel>
                          <QuickAddCategory 
                            type="category" 
                            onCategoryAdded={(newCategory) => {
                              field.onChange(newCategory.name);
                              setSelectedCategory(newCategory.name);
                              form.setValue('subCategory', '');
                            }}
                          >
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </QuickAddCategory>
                        </div>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                          // Clear subcategory when category changes
                          form.setValue('subCategory', '');
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={form.formState.errors.category || serverErrors.category ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category._id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sub-category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableSubCategories.length > 0 ? (
                              availableSubCategories.map((subCat, index) => (
                                <SelectItem key={`${subCat}-${index}`} value={subCat}>
                                  {subCat}
                                </SelectItem>
                              ))
                            ) : selectedCategory ? (
                              <SelectItem value="no-subcategories" disabled>
                                No subcategories available for {selectedCategory}
                              </SelectItem>
                            ) : (
                              <SelectItem value="no-category" disabled>
                                Select a category first
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="customerCategory"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Customer Category *
                        </FormLabel>
                        <QuickAddCategory 
                          type="customer-category" 
                          onCategoryAdded={(newCategory) => {
                            field.onChange(newCategory.name);
                          }}
                        >
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </QuickAddCategory>
                      </div>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className={form.formState.errors.customerCategory || serverErrors.customerCategory ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select customer category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customerCategories.map((category) => (
                            <SelectItem key={category._id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Pricing Information Section */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-950/20">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Pricing Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Configure cost structure and pricing details for the item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="stdCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Standard Cost</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="purchaseCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Cost</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>MRP</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0" 
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hsn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HSN Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="HSN code" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stock Information Section */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20">
                <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-gray-200">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Warehouse className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Stock Information
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                  Set inventory levels, storage locations, and stock management details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="qty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-500">Unit *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className={form.formState.errors.unit || serverErrors.unit ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {UNITS.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minStock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Stock</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leadTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Time (days)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="store"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Storage location" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Batch number" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-6">
                    <FormField
                      control={form.control}
                      name="internalManufacturing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Internal Manufacturing</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="purchase"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Allow Purchase</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="internalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Internal notes and comments"
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-2">
                {hasErrors && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">Please fix the highlighted errors</span>
                  </div>
                )}
                {!hasErrors && form.formState.isValid && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Form is ready to submit</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isSubmitting || hasErrors}
                  className="min-w-[120px]"
                >
                  {(isLoading || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {item ? 'Update Item' : 'Create Item'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}