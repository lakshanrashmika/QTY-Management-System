import React, { useEffect, useState, useRef } from 'react';
import {
    PlusIcon,
    EyeIcon,
    PrinterIcon,
    PackageIcon,
    SearchIcon,
    XIcon,
    DownloadIcon,
    FileTextIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockOrders = [
    {
        order_id: '1',
        business_id: 'biz1',
        order_number: 'ORD-2024-001',
        customer_id: '1',
        customer_name: 'John Smith',
        order_items: [
            {
                item_id: '1',
                item_name: 'Wireless Headphones',
                price: 89.99,
                quantity: 2,
            },
        ],
        payment_status: 'paid',
        payment_method: 'bank_transfer',
        courier_id: '1',
        courier_name: 'FedEx',
        tracking_number: 'FX123456',
        delivery_fee: 15.99,
        delivery_type: 'pay',
        discount: 10,
        total_amount: 185.97,
        status: 'delivered',
        created_by: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        order_id: '2',
        business_id: 'biz1',
        order_number: 'ORD-2024-002',
        customer_id: '2',
        customer_name: 'Sarah Johnson',
        order_items: [
            {
                item_id: '2',
                item_name: 'Cotton T-Shirt',
                price: 29.99,
                quantity: 3,
            },
        ],
        payment_status: 'pending',
        payment_method: 'cod',
        courier_id: '2',
        courier_name: 'UPS',
        delivery_fee: 12.99,
        delivery_type: 'pay',
        discount: 0,
        total_amount: 102.96,
        status: 'processing',
        created_by: '1',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
    },
    {
        order_id: '3',
        business_id: 'biz1',
        order_number: 'ORD-2024-003',
        customer_id: '3',
        customer_name: 'Mike Brown',
        order_items: [
            {
                item_id: '3',
                item_name: 'Smart Watch',
                price: 249.99,
                quantity: 1,
            },
        ],
        payment_status: 'paid',
        payment_method: 'bank_transfer',
        courier_id: '1',
        courier_name: 'FedEx',
        tracking_number: 'FX789012',
        delivery_fee: 15.99,
        delivery_type: 'pay',
        discount: 25,
        total_amount: 240.98,
        status: 'shipped',
        created_by: '1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
    },
    {
        order_id: '4',
        business_id: 'biz1',
        order_number: 'ORD-2024-004',
        customer_id: '4',
        customer_name: 'Emily Davis',
        order_items: [
            {
                item_id: '5',
                item_name: 'Yoga Mat',
                price: 39.99,
                quantity: 2,
            },
        ],
        payment_status: 'pending',
        payment_method: 'cod',
        courier_id: '4',
        courier_name: 'Local Courier',
        delivery_fee: 8.99,
        delivery_type: 'pay',
        discount: 5,
        total_amount: 83.97,
        status: 'pending',
        created_by: '1',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
    },
];

const statusColors = {
    pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    delivered:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    returned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const paymentStatusColors = {
    pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const customerOptions = [
    {
        value: '1',
        label: 'John Smith',
    },
    {
        value: '2',
        label: 'Sarah Johnson',
    },
    {
        value: '3',
        label: 'Mike Brown',
    },
    {
        value: '4',
        label: 'Emily Davis',
    },
];

const courierOptions = [
    {
        value: '1',
        label: 'FedEx - $15.99',
    },
    {
        value: '2',
        label: 'UPS - $12.99',
    },
    {
        value: '3',
        label: 'DHL - $18.99',
    },
    {
        value: '4',
        label: 'Local Courier - $8.99',
    },
];

const itemOptions = [
    {
        value: '1',
        label: 'Wireless Headphones - $89.99',
    },
    {
        value: '2',
        label: 'Cotton T-Shirt - $29.99',
    },
    {
        value: '3',
        label: 'Smart Watch - $249.99',
    },
    {
        value: '5',
        label: 'Yoga Mat - $39.99',
    },
];

const OrdersPage = () => {
    const { t } = useLanguage();
    const [orders, setOrders] = useState(mockOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const printRef = useRef(null);
    const [formData, setFormData] = useState({
        customer_id: '',
        courier_id: '',
        payment_method: 'cod',
        payment_status: 'pending',
        delivery_type: 'pay',
        tracking_number: '',
        discount: '0',
        notes: '',
        items: [
            {
                item_id: '',
                quantity: '1',
            },
        ],
    });

    useEffect(() => {
        if (isModalOpen || isViewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isViewModalOpen]);

    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = () => {
        const autoTrackingNumber = `TRK-${Date.now().toString(36).toUpperCase()}`;
        setFormData({
            customer_id: '',
            courier_id: '',
            payment_method: 'cod',
            payment_status: 'pending',
            delivery_type: 'pay',
            tracking_number: autoTrackingNumber,
            discount: '0',
            notes: '',
            items: [
                {
                    item_id: '',
                    quantity: '1',
                },
            ],
        });
        setIsModalOpen(true);
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [
                ...formData.items,
                {
                    item_id: '',
                    quantity: '1',
                },
            ],
        });
    };

    const handleRemoveItem = (index) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value,
        };
        setFormData({
            ...formData,
            items: newItems,
        });
    };

    const handleSave = () => {
        const orderNumber = `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`;
        const orderItems = formData.items.map((item) => ({
            item_id: item.item_id,
            item_name:
                itemOptions
                    .find((i) => i.value === item.item_id)
                    ?.label.split(' - ')[0] || '',
            price: parseFloat(
                itemOptions
                    .find((i) => i.value === item.item_id)
                    ?.label.split('$')[1] || '0',
            ),
            quantity: parseInt(item.quantity),
        }));

        const subtotal = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );

        const deliveryFee =
            formData.delivery_type === 'free'
                ? 0
                : parseFloat(
                    courierOptions
                        .find((c) => c.value === formData.courier_id)
                        ?.label.split('$')[1] || '0',
                );

        const discount = parseFloat(formData.discount);
        const total = subtotal + deliveryFee - discount;

        const newOrder = {
            order_id: Date.now().toString(),
            business_id: 'biz1',
            order_number: orderNumber,
            customer_id: formData.customer_id,
            customer_name: customerOptions.find(
                (c) => c.value === formData.customer_id,
            )?.label,
            order_items: orderItems,
            payment_status: formData.payment_status,
            payment_method: formData.payment_method,
            courier_id: formData.courier_id,
            courier_name: courierOptions
                .find((c) => c.value === formData.courier_id)
                ?.label.split(' - ')[0],
            tracking_number: formData.tracking_number || undefined,
            delivery_fee: deliveryFee,
            delivery_type: formData.delivery_type,
            discount: discount,
            total_amount: total,
            notes: formData.notes,
            status: 'pending',
            created_by: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setOrders([...orders, newOrder]);
        setIsModalOpen(false);
    };

    const handleView = (order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    const handleUpdateStatus = (orderId, newStatus) => {
        setOrders(
            orders.map((o) =>
                o.order_id === orderId
                    ? {
                        ...o,
                        status: newStatus,
                        updatedAt: new Date(),
                    }
                    : o,
            ),
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const handlePrintPDF = (order) => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print the invoice');
            return;
        }

        const cssStyles = `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #ffffff;
            padding: 20px;
            color: #1e293b;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .invoice {
            max-width: 800px;
            width: 100%;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #f1f5f9;
        }

        /* Header with gradient */
        .invoice-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 24px 32px;
            color: white;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }

        .logo-area {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 20px;
        }

        .logo-text {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .invoice-badge {
            background: rgba(255, 255, 255, 0.1);
            padding: 8px 16px;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-stats {
            display: flex;
            gap: 40px;
        }

        .stat-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .stat-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.7;
        }

        .stat-value {
            font-size: 18px;
            font-weight: 600;
        }

        /* Status Badge */
        .status-wrapper {
            padding: 0 32px;
            margin-top: -16px;
            margin-bottom: 16px;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            border-radius: 40px;
            font-size: 13px;
            font-weight: 600;
            background: white;
            box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.1);
            border: 1px solid #f1f5f9;
        }

        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }

        .status-pending .status-dot { background: #f59e0b; }
        .status-processing .status-dot { background: #3b82f6; }
        .status-shipped .status-dot { background: #06b6d4; }
        .status-delivered .status-dot { background: #10b981; }
        .status-returned .status-dot { background: #ef4444; }

        /* Main Content */
        .invoice-content {
            padding: 24px 32px 32px;
        }

        /* Customer Info Grid - Compact */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 24px;
            background: #f8fafc;
            padding: 16px;
            border-radius: 18px;
        }

        .info-block {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .info-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .info-value {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
        }

        .info-sub {
            font-size: 12px;
            color: #64748b;
        }

        /* Table Styles - Compact */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .items-table th {
            text-align: left;
            padding: 12px 8px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            color: #64748b;
            letter-spacing: 0.3px;
            border-bottom: 2px solid #e2e8f0;
        }

        .items-table td {
            padding: 10px 8px;
            font-size: 13px;
            border-bottom: 1px solid #f1f5f9;
        }

        .items-table tr:last-child td {
            border-bottom: none;
        }

        .product-cell {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .product-bullet {
            width: 4px;
            height: 4px;
            background: #3b82f6;
            border-radius: 50%;
        }

        .product-name {
            font-weight: 500;
            color: #0f172a;
        }

        .qty-badge {
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
        }

        .amount-cell {
            text-align: right;
            font-weight: 600;
        }

        /* Totals Section - Compact */
        .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 2px dashed #e2e8f0;
        }

        .totals-box {
            width: 280px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 13px;
        }

        .total-row.subtotal {
            border-bottom: 1px solid #f1f5f9;
        }

        .total-row.grand-total {
            padding: 10px 0 0;
            margin-top: 4px;
            border-top: 2px solid #0f172a;
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
        }

        .discount-value {
            color: #ef4444;
        }

        /* Payment Summary */
        .payment-summary {
            display: flex;
            gap: 20px;
            margin: 16px 0 0;
            padding: 12px 16px;
            background: #f8fafc;
            border-radius: 14px;
            font-size: 12px;
        }

        .payment-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .payment-label {
            color: #64748b;
        }

        .payment-value {
            font-weight: 600;
            color: #0f172a;
        }

        /* Footer */
        .invoice-footer {
            padding: 20px 32px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 11px;
            color: #64748b;
        }

        .footer-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .footer-right {
            text-align: right;
        }

        .thankyou {
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 2px;
        }

        /* Compact adjustments */
        .compact-text {
            font-size: 11px;
            color: #64748b;
        }

        @media print {
            body {
                padding: 0;
                background: white;
            }
            
            .invoice {
                box-shadow: none;
                border: 1px solid #e2e8f0;
            }
            
            .invoice-header {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    `;

        const subtotal = order.order_items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);

        // Format date nicely
        const formattedDate = formatDate(order.createdAt);
        const dueDate = formatDate(new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 15)));

        const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice #${order.order_number}</title>
            <style>${cssStyles}</style>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        </head>
        <body>
            <div class="invoice">
                <!-- Header with dark gradient -->
                <div class="invoice-header">
                    <div class="header-top">
                        <div class="logo-area">
                            <div class="logo-icon">B</div>
                            <span class="logo-text">BIZMANAGER</span>
                        </div>
                        <div class="invoice-badge">
                            INVOICE #${order.order_number.slice(-6)}
                        </div>
                    </div>
                    
                    <div class="header-stats">
                        <div class="stat-item">
                            <span class="stat-label">Invoice Date</span>
                            <span class="stat-value">${formattedDate}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Due Date</span>
                            <span class="stat-value">${dueDate}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Amount</span>
                            <span class="stat-value">$${order.total_amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <!-- Status Badge (overlapping) -->
                <div class="status-wrapper">
                    <span class="status-badge status-${order.status}">
                        <span class="status-dot"></span>
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                </div>

                <!-- Main Content -->
                <div class="invoice-content">
                    <!-- Compact Customer Info Grid -->
                    <div class="info-grid">
                        <div class="info-block">
                            <span class="info-label">Bill To</span>
                            <span class="info-value">${order.customer_name}</span>
                            <span class="info-sub">ID: ${order.customer_id}</span>
                        </div>
                        
                        <div class="info-block">
                            <span class="info-label">Shipping</span>
                            <span class="info-value">${order.courier_name}</span>
                            ${order.tracking_number ?
            `<span class="info-sub">Track: ${order.tracking_number}</span>` :
            `<span class="info-sub">${order.delivery_type === 'free' ? 'Free Delivery' : 'Paid Delivery'}</span>`
        }
                        </div>
                        
                        <div class="info-block">
                            <span class="info-label">Payment</span>
                            <span class="info-value">${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</span>
                            <span class="info-sub">${order.payment_status}</span>
                        </div>
                    </div>

                    <!-- Items Table - Compact -->
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th class="amount-cell">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.order_items.map(item => `
                                <tr>
                                    <td>
                                        <div class="product-cell">
                                            <span class="product-bullet"></span>
                                            <span class="product-name">${item.item_name}</span>
                                        </div>
                                    </td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td><span class="qty-badge">${item.quantity}x</span></td>
                                    <td class="amount-cell">$${(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Totals Box - Compact -->
                    <div class="totals-section">
                        <div class="totals-box">
                            <div class="total-row subtotal">
                                <span>Subtotal (${totalItems} items)</span>
                                <span>$${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="total-row">
                                <span>Delivery Fee</span>
                                <span>$${order.delivery_fee.toFixed(2)}</span>
                            </div>
                            ${order.discount > 0 ? `
                                <div class="total-row">
                                    <span>Discount</span>
                                    <span class="discount-value">-$${order.discount.toFixed(2)}</span>
                                </div>
                            ` : ''}
                            <div class="total-row grand-total">
                                <span>Total Due</span>
                                <span>$${order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Summary -->
                    <div class="payment-summary">
                        <div class="payment-item">
                            <span class="payment-label">Payment Method:</span>
                            <span class="payment-value">${order.payment_method === 'cod' ? '💵 Cash on Delivery' : '🏦 Bank Transfer'}</span>
                        </div>
                        <div class="payment-item">
                            <span class="payment-label">Payment Status:</span>
                            <span class="payment-value" style="color: ${order.payment_status === 'paid' ? '#10b981' : '#f59e0b'}">
                                ${order.payment_status}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="invoice-footer">
                    <div class="footer-left">
                        <span>Invoice #${order.order_number}</span>
                        <span>•</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="footer-right">
                        <div class="thankyou">Thank you for your business!</div>
                        <div>support@bizmanager.com</div>
                    </div>
                </div>
            </div>

            <script>
                window.onload = function() { 
                    setTimeout(function() { window.print(); }, 300);
                }
            </script>
        </body>
        </html>
    `;

        printWindow.document.write(invoiceHTML);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-72">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('orders.search')}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-48 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t('orders.all_status')}</option>
                        <option value="pending">{t('orders.pending')}</option>
                        <option value="processing">{t('orders.processing')}</option>
                        <option value="shipped">{t('orders.shipped')}</option>
                        <option value="delivered">{t('orders.delivered')}</option>
                        <option value="returned">{t('orders.returned')}</option>
                    </select>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('orders.new_order')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('orders.no_orders')}
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.order_id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {order.order_number}
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                                    >
                                    {order.status}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div>
                                    <span className="text-slate-500 text-xs block">
                                      {t('orders.customer')}
                                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                          {order.customer_name}
                                        </span>
                                    </div>
                                    <div>
                                    <span className="text-slate-500 text-xs block">
                                      {t('orders.total')}

                                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                          ${order.total_amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div>
                                    <span className="text-slate-500 text-xs block mb-1">
                                      {t('orders.payment')}
                                    </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}
                                        >
                      {order.payment_status}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('orders.date')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {formatDate(order.createdAt)}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(order)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePrintPDF(order)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <PrinterIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('orders.order_number')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('orders.customer')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('orders.total')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('orders.payment')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('orders.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('orders.date')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('orders.no_orders')}
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr
                                    key={order.order_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                        {order.order_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {order.customer_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        ${order.total_amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status]}`}
                      >
                        {order.payment_status}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(order)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                                title="View Order"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePrintPDF(order)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                                title="Print Invoice"
                                            >
                                                <PrinterIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('orders.new_order')}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)] space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.customer')}
                                        </label>
                                        <select
                                            value={formData.customer_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    customer_id: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">{t('common.select')}</option>
                                            {customerOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.courier')}
                                        </label>
                                        <select
                                            value={formData.courier_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    courier_id: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">{t('common.select')}</option>
                                            {courierOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {t('orders.order_items')}
                                        </label>
                                        <button
                                            onClick={handleAddItem}
                                            type="button"
                                            className="inline-flex items-center px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <PlusIcon className="w-4 h-4 mr-1" />
                                            {t('orders.add_item')}
                                        </button>
                                    </div>
                                    {formData.items.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-end">
                                            <div className="flex-1">
                                                <select
                                                    value={item.item_id}
                                                    onChange={(e) =>
                                                        handleItemChange(index, 'item_id', e.target.value)
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">{t('orders.select_item')}</option>
                                                    {itemOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(index, 'quantity', e.target.value)
                                                    }
                                                    min="1"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            {formData.items.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveItem(index)}
                                                    type="button"
                                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.payment_method')}
                                        </label>
                                        <select
                                            value={formData.payment_method}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    payment_method: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="cod">{t('orders.cod')}</option>
                                            <option value="bank_transfer">
                                                {t('orders.bank_transfer')}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.payment_status')}
                                        </label>
                                        <select
                                            value={formData.payment_status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    payment_status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">{t('orders.pending')}</option>
                                            <option value="paid">{t('orders.paid')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.delivery_type')}
                                        </label>
                                        <select
                                            value={formData.delivery_type}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    delivery_type: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pay">{t('orders.paid_delivery')}</option>
                                            <option value="free">{t('orders.free_delivery')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.tracking_number')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tracking_number}
                                            disabled
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono disabled:opacity-60 disabled:cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            {t('common.auto_generated')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('orders.discount')}
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.discount}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    discount: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('common.notes')}
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                notes: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t('orders.create_order')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Order Modal */}
            {isViewModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsViewModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => setIsViewModalOpen(false)}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    Order {selectedOrder.order_number}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePrintPDF(selectedOrder)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        title="Print Invoice"
                                    >
                                        <PrinterIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setIsViewModalOpen(false)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <XIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <PackageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {selectedOrder.order_number}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatDate(selectedOrder.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}
                                    >
                    {selectedOrder.status}
                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('orders.customer')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedOrder.customer_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('orders.courier')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedOrder.courier_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('orders.payment_method')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white capitalize">
                                            {selectedOrder.payment_method.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('orders.payment_status')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[selectedOrder.payment_status]}`}
                                        >
                      {selectedOrder.payment_status}
                    </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('orders.delivery_type')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${selectedOrder.delivery_type === 'free' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}
                                        >
                      {selectedOrder.delivery_type === 'free'
                          ? t('orders.free')
                          : t('orders.paid_delivery')}
                    </span>
                                    </div>
                                    {selectedOrder.tracking_number && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-slate-500">
                                                {t('orders.tracking_number')}
                                            </p>
                                            <p className="font-medium text-slate-900 dark:text-white font-mono">
                                                {selectedOrder.tracking_number}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        {t('orders.items')}
                                    </p>
                                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
                                        {selectedOrder.order_items.map((item, index) => (
                                            <div key={index} className="flex justify-between">
                        <span className="text-slate-700 dark:text-slate-300">
                          {item.item_name} × {item.quantity}
                        </span>
                                                <span className="font-medium text-slate-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                                            </div>
                                        ))}
                                        <div className="border-t border-slate-200 dark:border-slate-600 pt-2 mt-2 space-y-1">
                                            <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          {t('orders.delivery_fee')}
                        </span>
                                                <span className="dark:text-white">${selectedOrder.delivery_fee.toFixed(2)}</span>
                                            </div>
                                            {selectedOrder.discount > 0 && (
                                                <div className="flex justify-between text-sm">
                          <span className="text-slate-500">
                            {t('orders.discount')}
                          </span>
                                                    <span className="text-red-500">
                            -${selectedOrder.discount.toFixed(2)}
                          </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-semibold text-lg pt-1">
                                                <span className="dark:text-white">{t('orders.total')}</span>
                                                <span className="dark:text-white">${selectedOrder.total_amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedOrder.status !== 'delivered' &&
                                        selectedOrder.status !== 'returned' && (
                                            <>
                                                {selectedOrder.status === 'pending' && (
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                selectedOrder.order_id,
                                                                'processing',
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        {t('orders.mark_as_processing')}
                                                    </button>
                                                )}
                                                {selectedOrder.status === 'processing' && (
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                selectedOrder.order_id,
                                                                'shipped',
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        {t('orders.mark_as_shipped')}
                                                    </button>
                                                )}
                                                {selectedOrder.status === 'shipped' && (
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateStatus(
                                                                selectedOrder.order_id,
                                                                'delivered',
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        {t('orders.mark_as_delivered')}
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    <button
                                        onClick={() => handlePrintPDF(selectedOrder)}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-2"
                                    >
                                        <FileTextIcon className="w-4 h-4" />
                                        {t('orders.print_invoice')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;