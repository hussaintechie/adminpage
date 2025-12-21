export const REVENUE_DATA = [
  { name: 'Mon', sales: 4000, orders: 24 },
  { name: 'Tue', sales: 3000, orders: 18 },
  { name: 'Wed', sales: 2000, orders: 12 },
  { name: 'Thu', sales: 2780, orders: 20 },
  { name: 'Fri', sales: 1890, orders: 15 },
  { name: 'Sat', sales: 6390, orders: 45 },
  { name: 'Sun', sales: 7490, orders: 52 },
];

export const LOW_STOCK_DATA = [
  { id: 1, name: 'Amul Butter (500g)', stock: 4, category: 'Dairy' },
  { id: 2, name: 'Farm Fresh Eggs (12pcs)', stock: 2, category: 'Dairy' },
  { id: 3, name: 'Organic Tomatoes', stock: 5, category: 'Vegetables' },
  { id: 4, name: 'Whole Wheat Bread', stock: 1, category: 'Bakery' },
  { id: 5, name: 'Coca Cola (2L)', stock: 8, category: 'Beverages' },
];

export const MOCK_CUSTOMERS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', wallet: 500, status: 'Active', totalOrders: 15, lastOrder: '2023-12-01' },
  { id: 2, name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98765 12345', wallet: 120, status: 'Active', totalOrders: 8, lastOrder: '2023-11-28' },
  { id: 3, name: 'Amit Singh', email: 'amit.singh@example.com', phone: '+91 99887 77665', wallet: 0, status: 'Blocked', totalOrders: 2, lastOrder: '2023-10-15' },
  { id: 4, name: 'Sneha Gupta', email: 'sneha.g@example.com', phone: '+91 88776 66554', wallet: 2500, status: 'Active', totalOrders: 42, lastOrder: '2023-12-03' },
  { id: 5, name: 'Vikram Malhotra', email: 'vikram.m@example.com', phone: '+91 77665 55443', wallet: 50, status: 'Active', totalOrders: 5, lastOrder: '2023-11-20' },
];

export const INITIAL_ORDERS = [
  { id: '#ORD-7782', customer: 'Rahul Sharma', items: 5, amount: '₹450', status: 'Pending', orderTime: '10:45 AM', deliveryTime: 'Est: 11:15 AM', rating: 0 },
  { id: '#ORD-7781', customer: 'Priya Patel', items: 12, amount: '₹1,240', status: 'Delivered', orderTime: '10:15 AM', deliveryTime: '10:55 AM', rating: 5 },
  { id: '#ORD-7780', customer: 'Amit Singh', items: 2, amount: '₹85', status: 'Cancelled', orderTime: '09:30 AM', deliveryTime: '--', rating: 0 },
  { id: '#ORD-7779', customer: 'Sneha Gupta', items: 8, amount: '₹890', status: 'Dispatched', orderTime: '09:15 AM', deliveryTime: 'Est: 10:00 AM', rating: 0 },
  { id: '#ORD-7778', customer: 'Vikram Malhotra', items: 20, amount: '₹3,400', status: 'Delivered', orderTime: '08:00 AM', deliveryTime: '08:45 AM', rating: 4 },
];

export const MOCK_ORDER_DETAILS = {
  '#ORD-7782': {
    id: '#ORD-7782',
    status: 'Pending',
    date: 'Dec 03, 2025',
    time: '10:45 AM',
    customer: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      address: 'Flat 402, Green Valley Apts, MG Road, Indiranagar, Bangalore - 560038',
      type: 'Prime Member'
    },
    payment: {
      method: 'UPI (PhonePe)',
      transactionId: 'TXN123456789',
      status: 'Paid'
    },
    items: [
      { id: 1, name: 'Amul Butter (500g)', qty: 2, price: 240, total: 480 },
      { id: 2, name: 'Whole Wheat Bread', qty: 1, price: 45, total: 45 },
      { id: 3, name: 'Farm Fresh Eggs (6pcs)', qty: 2, price: 60, total: 120 },
    ],
    summary: {
      subtotal: 645,
      tax: 32.25,
      delivery: 40,
      discount: -50,
      total: 667.25
    }
  }
};
