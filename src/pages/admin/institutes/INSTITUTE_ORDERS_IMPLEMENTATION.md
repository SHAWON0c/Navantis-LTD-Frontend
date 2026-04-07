# Institute Orders Management - Implementation Guide

## Overview
This implementation provides complete Redux-based API management and UI pages for the Institute Orders workflow, following the order approval to print invoice flow pattern from the Depot module.

## Files Created

### 1. Redux API Service
**File:** `src/redux/features/institutes/instituteOrderApi.js`

Complete RTK Query service with the following endpoints:
- `createInstituteOrder` - POST `/instituteOrders/create`
- `getAllInstituteOrders` - GET `/instituteOrders` (with filters)
- `getPendingInstituteOrders` - GET `/instituteOrders?status=pending`
- `getInstituteOrderById` - GET `/instituteOrders/:orderId`
- `getOrdersByInstitute` - GET `/instituteOrders/institute/:customerId`
- `approveInstituteOrder` - POST `/instituteOrders/approve/:orderId`
- `assignRiderToInstituteOrder` - POST `/instituteOrders/assignRider/:orderId`
- `deliverInstituteOrder` - POST `/instituteOrders/deliver/:orderId`
- `cancelInstituteOrder` - POST `/instituteOrders/cancel/:orderId`
- `deleteInstituteOrder` - DELETE `/instituteOrders/:orderId`
- `requestInstituteReturn` - POST `/instituteReturns/request`
- `getAllInstituteReturns` - GET `/instituteReturns`
- `approveInstituteReturn` - POST `/instituteReturns/approve/:returnId`
- `rejectInstituteReturn` - POST `/instituteReturns/reject/:returnId`

### 2. Pages

#### ApprovePendingInstituteOrders.jsx
**Path:** `src/pages/admin/institutes/ApprovePendingInstituteOrders.jsx`

Displays a list of pending institute orders with the following features:
- **Table View:** Shows institute name, contact person, mobile, email, order date, payment mode, total amount, and current status
- **Order Approval:** Click "Approve" to open a modal for batch selection
- **Rider Assignment:** Assign a rider to confirmed orders
- **Invoice Printing:** Print invoice for assigned/delivered orders
- **Order Details:** View complete order details including products and batches

**Key Features:**
- Real-time order status updates
- Error handling with detailed error popups
- Order refresh functionality
- Responsive design with mobile support

#### InstituteOrderInvoiceAndPayment.jsx
**Path:** `src/pages/admin/institutes/InstituteOrderInvoiceAndPayment.jsx`

Manages invoice and payment tracking for institute orders:
- **Status Filters:** View orders by status (Confirmed, Assigned, Delivered, Paid, Outstanding)
- **Order Details Table:** Shows institute, invoice number, order date, total payable, and payment status
- **Payment Status Indicators:** Color-coded badges (Paid, Partial, Pending)
- **Quick Navigation:** Sidebar buttons for easy status switching

**Key Features:**
- Dynamic order filtering by status
- Payment status tracking
- Clean sidebar navigation
- Pagination support

### 3. Report Component

#### PrintInstituteInvoice.jsx
**Path:** `src/component/reports/PrintInstituteInvoice.jsx`

Professional invoice printing component with:
- **Header:** Company logo and branding
- **Institute Information:** Institute name, contact person, address, licenses, etc.
- **Order Details:** Invoice number, order date, payment mode, status
- **Product Table:** Detailed product listing with batches, expiry dates, quantities, and pricing
- **Calculations:** Gross price, customer discount, and net payable amounts
- **Print Functionality:** Browser print dialog with signature area
- **Deliver Order:** Mark order as delivered after printing

**Key Features:**
- Professional layout matching depot invoices
- Batch-wise product breakdown
- Automatic image loading detection
- Deliver order confirmation
- Debug mode for development
- Responsive print styling

## API Integration

All endpoints use the base API from `redux/services/baseApi` with:
- Automatic cache invalidation on mutations
- Loading states for optimal UX
- Error handling with custom messages
- RTK Query hooks for component integration

## Routes

The following routes have been added to `src/routes/index.jsx`:

```javascript
// Institute Orders Routes (MD Role Only)
<Route path="/institutes/approve-pending-orders" element={<ApprovePendingInstituteOrders />} />
<Route path="/institutes/order-invoice-payment" element={<InstituteOrderInvoiceAndPayment />} />
<Route path="/institutes/invoice-print" element={<PrintInstituteInvoice />} />
```

Routes are protected with `ProtectedRoute` component requiring MD role.

## Usage Flow

### 1. Approve Pending Orders
```
/institutes/approve-pending-orders
  ↓
  Display pending orders
  ↓
  Click "Approve" → Select batches
  ↓
  Order status changes to "confirmed"
```

### 2. Assign Rider
```
  Order status: confirmed
  ↓
  Select rider from dropdown
  ↓
  Order status changes to "assigned"
```

### 3. Print Invoice
```
  Order status: assigned
  ↓
  Click "Print Invoice"
  ↓
  /institutes/invoice-print
  ↓
  Click "🖨 Print Invoice"
  ↓
  Browser print dialog
  ↓
  Click "✅ Deliver Order"
  ↓
  Order marked as delivered
```

### 4. Track Payments
```
/institutes/order-invoice-payment
  ↓
  Filter by status (Confirmed/Assigned/Delivered/Paid/Outstanding)
  ↓
  View corresponding orders
  ↓
  Track payment status
```

## Hook Usage

### In Components

```javascript
// Query hooks
const { data, isLoading, refetch } = useGetPendingInstituteOrdersQuery();
const { data: order } = useGetInstituteOrderByIdQuery(orderId);
const { data: orders } = useGetAllInstituteOrdersQuery(params);

// Mutation hooks
const [approveOrder, { isLoading: isApproving }] = useApproveInstituteOrderMutation();
const [assignRider] = useAssignRiderToInstituteOrderMutation();
const [deliverOrder] = useDeliverInstituteOrderMutation();
```

## Error Handling

All pages include comprehensive error handling:
- Error detail display using `getErrorMessage()` utility
- SweetAlert2 for error popups with stack traces
- HTML escaping to prevent injection attacks
- User-friendly error messages

## State Management

- **RTK Query** caches order data automatically
- **keepUnusedDataFor: 0** ensures fresh data on each navigation
- **Refetch options** for manual updates
- **Cache invalidation** on mutations

## Future Enhancements

1. **Payment Integration:** Add payment processing for Quick Pay
2. **SMS/Email Notifications:** Notify institutes of order status
3. **Bulk Operations:** Approve/assign multiple orders at once
4. **Return Management:** Complete return request workflow
5. **Analytics Dashboard:** Order trends and payment analytics
6. **Mobile App:** Mobile-optimized views

## Testing

To test the implementation:

1. Ensure you're logged in as MD user
2. Navigate to `/institutes/approve-pending-orders`
3. Create orders via the backend API
4. Test approval flow with batch selection
5. Assign riders from available list
6. Generate and print invoices
7. Verify order status transitions

## API Contract Changes

If the backend API changes, update:
- `instititeOrderApi.js` - Endpoint URLs and payloads
- Page components - Assume data structure format
- Print component - Invoice display format

## Troubleshooting

**No orders appearing:**
- Check that institute status is "active"
- Verify order status is "pending"
- Clear Redux cache: `dispatch(baseAPI.util.resetApiState())`

**Print button disabled:**
- Order must have `orderStatus: "assigned"` before printing
- Ensure youclick "🖨 Print Invoice" before "✅ Deliver Order"

**Rider Assignment fails:**
- Verify riders exist in the system
- Check rider availability status
- Ensure order status is "confirmed"

## Notes

- All pages follow the Depot implementation pattern for consistency
- Uses Tailwind CSS for styling
- Includes responsive design for mobile devices
- Error handling matches existing patterns in the application
- Code is production-ready with proper validation and error management
