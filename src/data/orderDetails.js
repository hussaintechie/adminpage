export const INITIAL_ORDERS = [
  { id: '#ORD-7782', customer: 'Rahul Sharma', items: 5, amount: '₹450', status: 'Pending', date: '2023-12-03', orderTime: '10:45 AM', deliveryTime: 'Est: 11:15 AM', rating: 0 },
  { id: '#ORD-7781', customer: 'Priya Patel', items: 12, amount: '₹1,240', status: 'Delivered', date: '2023-12-03', orderTime: '10:15 AM', deliveryTime: '10:55 AM', rating: 5 },
  { id: '#ORD-7780', customer: 'Amit Singh', items: 2, amount: '₹85', status: 'Cancelled', date: '2023-12-03', orderTime: '09:30 AM', deliveryTime: '--', rating: 0 },
  { id: '#ORD-7779', customer: 'Sneha Gupta', items: 8, amount: '₹890', status: 'Dispatched', date: '2023-12-03', orderTime: '09:15 AM', deliveryTime: 'Est: 10:00 AM', rating: 0 },
  { id: '#ORD-7778', customer: 'Vikram Malhotra', items: 20, amount: '₹3,400', status: 'Delivered', date: '2023-12-03', orderTime: '08:00 AM', deliveryTime: '08:45 AM', rating: 4 },
  
  // --- NEW ORDERS FOR PAGINATION ---
  { id: '#ORD-7777', customer: 'Anjali Rao', items: 4, amount: '₹320', status: 'Delivered', date: '2023-12-02', orderTime: '06:30 PM', deliveryTime: '07:15 PM', rating: 5 },
  { id: '#ORD-7776', customer: 'Rohan Das', items: 15, amount: '₹2,100', status: 'Processing', date: '2023-12-02', orderTime: '05:45 PM', deliveryTime: 'Est: 06:30 PM', rating: 0 },
  { id: '#ORD-7775', customer: 'Meera Kapoor', items: 1, amount: '₹45', status: 'Delivered', date: '2023-12-02', orderTime: '02:15 PM', deliveryTime: '02:40 PM', rating: 3 },
  { id: '#ORD-7774', customer: 'Arjun Verma', items: 6, amount: '₹650', status: 'Cancelled', date: '2023-12-02', orderTime: '01:00 PM', deliveryTime: '--', rating: 0 },
  { id: '#ORD-7773', customer: 'Kavita Singh', items: 9, amount: '₹980', status: 'Pending', date: '2023-12-02', orderTime: '12:30 PM', deliveryTime: 'Est: 01:15 PM', rating: 0 },
  { id: '#ORD-7772', customer: 'Deepak Mehta', items: 3, amount: '₹210', status: 'Dispatched', date: '2023-12-02', orderTime: '11:00 AM', deliveryTime: 'Est: 11:45 AM', rating: 0 },
  { id: '#ORD-7771', customer: 'Sara Ali', items: 18, amount: '₹2,800', status: 'Delivered', date: '2023-12-01', orderTime: '08:15 PM', deliveryTime: '09:00 PM', rating: 5 },
  { id: '#ORD-7770', customer: 'John Doe', items: 7, amount: '₹750', status: 'Delivered', date: '2023-12-01', orderTime: '04:30 PM', deliveryTime: '05:10 PM', rating: 4 },
  { id: '#ORD-7769', customer: 'Jane Smith', items: 10, amount: '₹1,500', status: 'Processing', date: '2023-12-01', orderTime: '02:00 PM', deliveryTime: 'Est: 03:00 PM', rating: 0 },
  { id: '#ORD-7768', customer: 'Bob Brown', items: 2, amount: '₹150', status: 'Delivered', date: '2023-12-01', orderTime: '10:00 AM', deliveryTime: '10:30 AM', rating: 5 },
];

export const MOCK_ORDER_DETAILS = {
  // Existing...
  '#ORD-7782': {
    id: '#ORD-7782',
    status: 'Pending',
    date: 'Dec 03, 2023',
    time: '10:45 AM',
    customer: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      address: 'Flat 402, Green Valley Apts, MG Road, Indiranagar, Bangalore - 560038',
      type: 'Prime Member'
    },
    payment: { method: 'UPI (PhonePe)', transactionId: 'TXN123456789', status: 'Paid' },
    items: [
      { id: 1, name: 'Amul Butter (500g)', qty: 2, price: 240, total: 480 },
      { id: 2, name: 'Whole Wheat Bread', qty: 1, price: 45, total: 45 },
      { id: 3, name: 'Farm Fresh Eggs (6pcs)', qty: 2, price: 60, total: 120 },
    ],
    summary: { subtotal: 645, tax: 32.25, delivery: 40, discount: -50, total: 667.25 }
  },
  '#ORD-7781': {
    id: '#ORD-7781',
    status: 'Delivered',
    date: 'Dec 03, 2023',
    time: '10:15 AM',
    customer: { name: 'Priya Patel', phone: '+91 98765 12345', email: 'priya.p@example.com', address: '12, Sunrise Villas, Juhu, Mumbai', type: 'Regular' },
    payment: { method: 'Credit Card', transactionId: 'CC987654321', status: 'Paid' },
    items: [
        { id: 1, name: 'Fortune Oil (5L)', qty: 1, price: 850, total: 850 },
        { id: 2, name: 'Basmati Rice (5kg)', qty: 1, price: 390, total: 390 },
    ],
    summary: { subtotal: 1240, tax: 60, delivery: 0, discount: 0, total: 1300 }
  },
  '#ORD-7780': {
    id: '#ORD-7780',
    status: 'Cancelled',
    date: 'Dec 03, 2023',
    time: '09:30 AM',
    customer: { name: 'Amit Singh', phone: '+91 99887 76655', email: 'amit.s@example.com', address: 'Block C, Noida Sector 18, UP', type: 'New' },
    payment: { method: 'Cash on Delivery', transactionId: '-', status: 'Unpaid' },
    items: [{ id: 1, name: 'Toned Milk (500ml)', qty: 2, price: 42.5, total: 85 }],
    summary: { subtotal: 85, tax: 0, delivery: 0, discount: 0, total: 85 }
  },
  '#ORD-7779': {
    id: '#ORD-7779',
    status: 'Dispatched',
    date: 'Dec 03, 2023',
    time: '09:15 AM',
    customer: { name: 'Sneha Gupta', phone: '+91 88776 65544', email: 'sneha.g@example.com', address: 'H.No 55, Civil Lines, Jaipur', type: 'Prime' },
    payment: { method: 'Net Banking', transactionId: 'NB55443322', status: 'Paid' },
    items: [{ id: 1, name: 'Aashirvaad Atta (10kg)', qty: 1, price: 450, total: 450 }, { id: 2, name: 'Sugar (5kg)', qty: 1, price: 220, total: 220 }],
    summary: { subtotal: 670, tax: 30, delivery: 40, discount: -50, total: 690 }
  },
  '#ORD-7778': {
    id: '#ORD-7778',
    status: 'Delivered',
    date: 'Dec 03, 2023',
    time: '08:00 AM',
    customer: { name: 'Vikram Malhotra', phone: '+91 77665 54433', email: 'vikram.m@example.com', address: 'Penthouse, Park Street, Kolkata', type: 'Prime' },
    payment: { method: 'UPI', transactionId: 'UPI998877', status: 'Paid' },
    items: [{ id: 1, name: 'Bulk Ration Kit', qty: 1, price: 3400, total: 3400 }],
    summary: { subtotal: 3400, tax: 150, delivery: 0, discount: -200, total: 3350 }
  },

  // --- NEW DETAILS ---
  '#ORD-7777': {
    id: '#ORD-7777',
    status: 'Delivered',
    date: 'Dec 02, 2023',
    time: '06:30 PM',
    customer: { name: 'Anjali Rao', phone: '+91 91234 56789', email: 'anjali.r@example.com', address: 'Plot 4, Banjara Hills, Hyderabad', type: 'Regular' },
    payment: { method: 'Cash on Delivery', transactionId: '-', status: 'Paid' },
    items: [
        { id: 1, name: 'Dark Chocolate', qty: 2, price: 100, total: 200 },
        { id: 2, name: 'Ice Cream Tub', qty: 1, price: 120, total: 120 }
    ],
    summary: { subtotal: 320, tax: 18, delivery: 20, discount: 0, total: 358 }
  },
  '#ORD-7776': {
    id: '#ORD-7776',
    status: 'Processing',
    date: 'Dec 02, 2023',
    time: '05:45 PM',
    customer: { name: 'Rohan Das', phone: '+91 90000 11111', email: 'rohan.d@example.com', address: 'Sector 4, Salt Lake, Kolkata', type: 'Prime' },
    payment: { method: 'Credit Card', transactionId: 'CC11223344', status: 'Paid' },
    items: [
        { id: 1, name: 'Almonds (1kg)', qty: 1, price: 900, total: 900 },
        { id: 2, name: 'Cashews (1kg)', qty: 1, price: 1200, total: 1200 }
    ],
    summary: { subtotal: 2100, tax: 105, delivery: 0, discount: -100, total: 2105 }
  },
  '#ORD-7775': {
    id: '#ORD-7775',
    status: 'Delivered',
    date: 'Dec 02, 2023',
    time: '02:15 PM',
    customer: { name: 'Meera Kapoor', phone: '+91 88888 22222', email: 'meera.k@example.com', address: 'GK-1, New Delhi', type: 'Regular' },
    payment: { method: 'UPI', transactionId: 'UPI223344', status: 'Paid' },
    items: [{ id: 1, name: 'Curd (200g)', qty: 1, price: 45, total: 45 }],
    summary: { subtotal: 45, tax: 2, delivery: 20, discount: 0, total: 67 }
  },
  '#ORD-7774': {
    id: '#ORD-7774',
    status: 'Cancelled',
    date: 'Dec 02, 2023',
    time: '01:00 PM',
    customer: { name: 'Arjun Verma', phone: '+91 77777 33333', email: 'arjun.v@example.com', address: 'Koramangala, Bangalore', type: 'New' },
    payment: { method: 'Cash on Delivery', transactionId: '-', status: 'Cancelled' },
    items: [{ id: 1, name: 'Mixed Fruit Basket', qty: 1, price: 650, total: 650 }],
    summary: { subtotal: 650, tax: 0, delivery: 0, discount: 0, total: 650 }
  },
  '#ORD-7773': {
    id: '#ORD-7773',
    status: 'Pending',
    date: 'Dec 02, 2023',
    time: '12:30 PM',
    customer: { name: 'Kavita Singh', phone: '+91 66666 44444', email: 'kavita.s@example.com', address: 'Andheri East, Mumbai', type: 'Regular' },
    payment: { method: 'UPI', transactionId: 'UPI556677', status: 'Paid' },
    items: [
        { id: 1, name: 'Paneer (1kg)', qty: 1, price: 400, total: 400 },
        { id: 2, name: 'Green Peas (1kg)', qty: 1, price: 180, total: 180 },
        { id: 3, name: 'Spices Combo', qty: 1, price: 400, total: 400 }
    ],
    summary: { subtotal: 980, tax: 49, delivery: 40, discount: -20, total: 1049 }
  },
  '#ORD-7772': {
    id: '#ORD-7772',
    status: 'Dispatched',
    date: 'Dec 02, 2023',
    time: '11:00 AM',
    customer: { name: 'Deepak Mehta', phone: '+91 55555 11111', email: 'deepak.m@example.com', address: 'Vastrapur, Ahmedabad', type: 'Prime' },
    payment: { method: 'Wallet', transactionId: 'WL998877', status: 'Paid' },
    items: [{ id: 1, name: 'Cold Drink (2L)', qty: 2, price: 105, total: 210 }],
    summary: { subtotal: 210, tax: 10, delivery: 0, discount: 0, total: 220 }
  },
  '#ORD-7771': {
    id: '#ORD-7771',
    status: 'Delivered',
    date: 'Dec 01, 2023',
    time: '08:15 PM',
    customer: { name: 'Sara Ali', phone: '+91 44444 22222', email: 'sara.a@example.com', address: 'Bandra West, Mumbai', type: 'Prime' },
    payment: { method: 'Credit Card', transactionId: 'CC778899', status: 'Paid' },
    items: [{ id: 1, name: 'Imported Cheese Wheel', qty: 1, price: 2800, total: 2800 }],
    summary: { subtotal: 2800, tax: 140, delivery: 0, discount: -100, total: 2840 }
  },
  '#ORD-7770': {
    id: '#ORD-7770',
    status: 'Delivered',
    date: 'Dec 01, 2023',
    time: '04:30 PM',
    customer: { name: 'John Doe', phone: '+91 33333 55555', email: 'john.d@example.com', address: 'Whitefield, Bangalore', type: 'Regular' },
    payment: { method: 'Cash on Delivery', transactionId: '-', status: 'Paid' },
    items: [
        { id: 1, name: 'Chicken Breast (1kg)', qty: 1, price: 350, total: 350 },
        { id: 2, name: 'Fish Fillet', qty: 1, price: 400, total: 400 }
    ],
    summary: { subtotal: 750, tax: 35, delivery: 40, discount: 0, total: 825 }
  },
  '#ORD-7769': {
    id: '#ORD-7769',
    status: 'Processing',
    date: 'Dec 01, 2023',
    time: '02:00 PM',
    customer: { name: 'Jane Smith', phone: '+91 22222 66666', email: 'jane.s@example.com', address: 'Connaught Place, Delhi', type: 'New' },
    payment: { method: 'UPI', transactionId: 'UPI112233', status: 'Paid' },
    items: [
        { id: 1, name: 'Olive Oil (1L)', qty: 1, price: 900, total: 900 },
        { id: 2, name: 'Pasta Packet', qty: 3, price: 200, total: 600 }
    ],
    summary: { subtotal: 1500, tax: 75, delivery: 40, discount: -50, total: 1565 }
  },
  '#ORD-7768': {
    id: '#ORD-7768',
    status: 'Delivered',
    date: 'Dec 01, 2023',
    time: '10:00 AM',
    customer: { name: 'Bob Brown', phone: '+91 11111 77777', email: 'bob.b@example.com', address: 'Anna Nagar, Chennai', type: 'Regular' },
    payment: { method: 'Wallet', transactionId: 'WL445566', status: 'Paid' },
    items: [{ id: 1, name: 'Coffee Powder', qty: 1, price: 150, total: 150 }],
    summary: { subtotal: 150, tax: 8, delivery: 20, discount: 0, total: 178 }
  }
};