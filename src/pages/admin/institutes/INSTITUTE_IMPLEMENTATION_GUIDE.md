# Institute Management System - Complete Implementation Guide

This document covers the complete Institute API implementation with frontend pages and backend routes.

---

## 📁 Project Structure

```
src/
├── redux/
│   └── features/
│       └── institutes/
│           └── instituteApi.js          # RTK Query API service
├── pages/
│   └── admin/
│       └── institutes/
│           ├── CreateInstitute.jsx      # Create new institute
│           ├── InstituteList.jsx        # List institutes with filters
│           ├── InstitutePendingApproval.jsx  # MD approval page
│           ├── InstituteDetails.jsx     # View & edit details
│           └── index.js                  # Barrel export
```

---

## 🔗 RTK Query API Service (`instituteApi.js`)

### Available Hooks

```javascript
import {
  useCreateInstituteMutation,
  useGetAllInstitutesQuery,
  useGetInstitutesByStatusQuery,
  useGetPendingInstitutesQuery,
  useGetInstituteByIdQuery,
  useApproveInstituteMutation,
  useActivateInstituteMutation,
  useUpdateInstituteMutation,
} from "@redux/features/institutes/instituteApi";
```

### 1. Create Institute
```javascript
const [createInstitute] = useCreateInstituteMutation();

await createInstitute({
  instituteName: "National Medical Institute",
  tradeLicense: "TL-2024-001",
  drugLicense: "DL-2024-001",
  address: "123 Health Street, Medical City",
  mobile: "+92-300-1234567",
  email: "nmi@institute.com",
  contactPerson: "Dr. Ahmad Khan",
  discount: 5,
  payMode: ["cash", "credit"],
  creditLimit: 50000,
  dayLimit: 10000
}).unwrap();
```

### 2. Get All Institutes
```javascript
const { data, isLoading, isError } = useGetAllInstitutesQuery();
const institutes = data?.data || [];
```

### 3. Get Institutes by Status
```javascript
const { data, isLoading } = useGetInstitutesByStatusQuery("active");
// Status options: "active", "approved", "pending"
```

### 4. Get Pending Institutes (for MD)
```javascript
const { data, isLoading } = useGetPendingInstitutesQuery("pending");
```

### 5. Get Institute by ID
```javascript
const { data, isLoading } = useGetInstituteByIdQuery(instituteId);
const institute = data?.data;
```

### 6. Approve Institute (MD only)
```javascript
const [approveInstitute] = useApproveInstituteMutation();

await approveInstitute(instituteId).unwrap();
```

### 7. Activate Institute
```javascript
const [activateInstitute] = useActivateInstituteMutation();

await activateInstitute(instituteId).unwrap();
```

### 8. Update Institute
```javascript
const [updateInstitute] = useUpdateInstituteMutation();

await updateInstitute({
  id: instituteId,
  payload: {
    instituteName: "New Name",
    address: "New Address",
    discount: 8,
    creditLimit: 75000,
  }
}).unwrap();
```

---

## 📄 Frontend Pages

### 1. **CreateInstitute.jsx**
**Purpose:** Create a new institute (Admin/SuperAdmin only)

**Features:**
- Form validation
- Conditional Credit/Day limit fields based on pay mode selection
- Real-time JSON preview
- Success/error notifications
- Mobile and email normalization

**Flow:**
```
User fills form → Validation → Submit → MD Approval Queue → Status: Pending
```

**Pay Mode Logic:**
- **Cash:** No credit/day limits required
- **Credit:** Both credit and day limits required
- **STC:** Only credit limit required
- **SPIC:** Both credit and day limits required

---

### 2. **InstituteList.jsx**
**Purpose:** List all institutes with filtering and actions

**Features:**
- Status filters (Active, Approved, Pending)
- Search by name, ID, mobile, email, contact person
- Pagination (5, 10, 15, 20 per page)
- View details button
- Edit button
- Activate button (for approved institutes only)
- Institute ID displayed as "INS-{id}"

**Status Colors:**
- 🟢 **Active:** Green
- 🔵 **Approved:** Blue
- 🟡 **Pending:** Yellow

---

### 3. **InstitutePendingApproval.jsx**
**Purpose:** MD approval interface

**Features:**
- Display all institutes pending MD approval
- Search functionality
- View created by information
- Creation date display
- Approve button with confirmation
- Pagination support

**Who can access:** Managing Director only

---

### 4. **InstituteDetails.jsx**
**Purpose:** View and edit institute information

**Features:**
- View mode with color-coded sections
- Edit mode with form fields
- Prevent editing of Trade/Drug licenses
- Inline validation
- Status badge
- Created by information
- Creation timestamp

**Edit Restrictions:**
- Cannot modify: Trade License, Drug License
- Can modify: All other fields

---

## 🔐 Authorization & Routing

### Route Setup (add to your `routes/index.jsx`)

```javascript
// Admin Routes
const adminRoutes = [
  {
    path: "institutes",
    element: <InstituteList />,
    requiredRole: ["admin", "superadmin", "md"]
  },
  {
    path: "institutes/create",
    element: <CreateInstitute />,
    requiredRole: ["admin", "superadmin"]
  },
  {
    path: "institutes/pending-approval",
    element: <InstitutePendingApproval />,
    requiredRole: ["md"]
  },
  {
    path: "institutes/:id",
    element: <InstituteDetails />,
    requiredRole: ["admin", "superadmin", "md"]
  },
  {
    path: "institutes/edit/:id",
    element: <InstituteDetails />,
    requiredRole: ["admin", "superadmin"]
  }
];
```

### Permission Matrix

| Endpoint | superadmin | admin | MD | User |
|----------|:----------:|:-----:|:--:|:----:|
| Create | ✅ | ✅ | ❌ | ❌ |
| View List | ✅ | ✅ | ✅ | ❌ |
| View Details | ✅ | ✅ | ✅ | ❌ |
| Edit | ✅ | ✅ | ❌ | ❌ |
| Approve | ❌ | ❌ | ✅ | ❌ |
| Activate | ✅ | ✅ | ✅ | ❌ |

---

## 🔄 Institute Status Flow

```
┌─────────────────┐
│ CREATE INSTITUTE│ (Admin/SuperAdmin)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ STATUS: PENDING                     │
│ instituteId: NULL                   │
│ Awaiting MD Approval                │
└────────┬────────────────────────────┘
         │
         ▼ (MD Reviews & Approves)
┌─────────────────────────────────────┐
│ STATUS: APPROVED                    │
│ instituteId: Assigned (INS-1, etc)  │
│ Ready for Activation                │
└────────┬────────────────────────────┘
         │
         ▼ (Admin/SuperAdmin Activates)
┌─────────────────────────────────────┐
│ STATUS: ACTIVE                      │
│ Ready for all operations            │
└─────────────────────────────────────┘
```

### Timeline Example:
```
10:30:15 - Institute created (status: pending)
11:00:45 - MD approves (status: approved, instituteId: 1)
11:30:20 - Admin activates (status: active)
```

---

## 📊 Data Model

### Complete Institute Object

```json
{
  "_id": "6606e8f5b5c3a2d8e1f4a1c2",
  "instituteId": 1,
  "instituteName": "National Medical Institute",
  "tradeLicense": "TL-2024-001",
  "drugLicense": "DL-2024-001",
  "address": "123 Health Street, Medical City",
  "mobile": "+92-300-1234567",
  "mobileNormalized": "923001234567",
  "email": "nmi@institute.com",
  "emailNormalized": "nmi@institute.com",
  "contactPerson": "Dr. Ahmad Khan",
  "discount": 5,
  "payMode": ["cash", "credit"],
  "creditLimit": 50000,
  "dayLimit": 10000,
  "addedBy": {
    "_id": "6606e8f5b5c3a2d8e1f4a1d0",
    "name": "Admin User",
    "email": "admin@example.com"
  },
  "status": "active",
  "approvalFlow": {
    "managingDirector": "6606e8f5b5c3a2d8e1f4a1e1"
  },
  "approvalStatus": {
    "currentLevel": "approved",
    "approvedBy": [
      {
        "user": "6606e8f5b5c3a2d8e1f4a1e1",
        "role": "managingDirector",
        "approvedAt": "2026-04-06T11:00:45.123Z"
      }
    ]
  },
  "createdAt": "2026-04-06T10:30:15.432Z",
  "updatedAt": "2026-04-06T11:30:20.456Z",
  "__v": 0
}
```

### Virtual Fields

**instituteCode:** `INS-{instituteId}`
```javascript
institute.instituteId === 1
// displays as: INS-1
```

---

## 🧪 Testing Checklist

- [ ] Create institute with valid data
- [ ] Verify status is "pending" after creation
- [ ] Verify instituteId is NULL before approval
- [ ] MD can view pending institutes
- [ ] MD approves institute successfully
- [ ] Verify status changed to "approved"
- [ ] Verify instituteId assigned
- [ ] Admin can view and modify institute list
- [ ] Admin can activate approved institute
- [ ] Verify status changed to "active"
- [ ] Try duplicate mobile - should fail
- [ ] Try duplicate trade license - should fail
- [ ] Try to activate pending institute - should fail
- [ ] Update institute details successfully
- [ ] Filter by status works correctly
- [ ] Search functionality works
- [ ] Pagination works correctly
- [ ] Unauthorized access returns 401

---

## ⚠️ Error Handling

### Common Errors

**400 Bad Request - Duplicate Mobile**
```json
{
  "success": false,
  "message": "Phone number already exists."
}
```

**400 Bad Request - Duplicate License**
```json
{
  "success": false,
  "message": "Trade license already exists."
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

**403 Forbidden - Not MD**
```json
{
  "success": false,
  "message": "Not authorized to approve this institute"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Institute not found"
}
```

---

## 📝 Form Validation Rules

### Required Fields (Always)
- Institute Name
- Trade License
- Drug License
- Address
- Mobile
- Email
- Contact Person
- Pay Mode (at least one)

### Conditional Fields
- **Credit Limit:** Required if payMode includes "credit", "stc", or "spic"
- **Day Limit:** Required if payMode includes "credit" or "spic" (NOT for "stc")

---

## 🎯 Usage Examples

### Example 1: Create and Approve Institute

```javascript
// 1. Admin creates institute
const [createInstitute] = useCreateInstituteMutation();
const response = await createInstitute(instituteData).unwrap();
const instituteId = response.data._id; // Get _id, not instituteId

// 2. MD approves
const [approveInstitute] = useApproveInstituteMutation();
await approveInstitute(instituteId).unwrap();

// 3. Admin activates
const [activateInstitute] = useActivateInstituteMutation();
await activateInstitute(instituteId).unwrap();
```

### Example 2: Update Institute Details

```javascript
const [updateInstitute] = useUpdateInstituteMutation();

await updateInstitute({
  id: instituteId,
  payload: {
    instituteName: "Updated Name",
    contactPerson: "Dr. New Person",
    creditLimit: 100000
  }
}).unwrap();
```

### Example 3: Filter Institutes by Status

```javascript
const { data } = useGetInstitutesByStatusQuery("active");
const activeInstitutes = data?.data || [];

const activeCount = activeInstitutes.length;
const totalCreditLimit = activeInstitutes.reduce(
  (sum, i) => sum + (i.creditLimit || 0),
  0
);
```

---

## 🔗 Backend API Endpoints

### Institute Routes (`/institutes`)

```
POST   /institutes                           # Create institute
GET    /institutes                           # Get all institutes
GET    /institutes/status/:status            # Get by status
GET    /institutes/pending/list              # Get pending (MD only)
GET    /institutes/:id                       # Get by ID
PUT    /institutes/approve/:instituteId      # Approve (MD only)
PUT    /institutes/activate/:instituteId     # Activate
PATCH  /institutes/:id                       # Update institute
```

---

## 📞 Support & Troubleshooting

### Institutes not loading?
1. Check authentication token validity
2. Verify user role permissions
3. Check browser console for API errors
4. Verify RTK Query cache is working

### Cannot approve institute?
1. Confirm you're logged in as MD
2. Verify institute is in "pending" status
3. Check if institute is assigned to your approval flow

### Duplicate error when creating?
1. Check mobile number format
2. Verify trade/drug license is unique
3. Try with different values if testing

### Form not submitting?
1. Check all required fields are filled
2. Verify validation messages
3. Check browser network tab for API response

---

## 📚 Additional Notes

- All phone numbers are normalized (digits only)
- All emails are converted to lowercase
- `instituteId` is auto-generated and assigned only after MD approval
- Status progression is: pending → approved → active
- Institutes cannot skip approval steps
- Only approved institutes can be activated

---

**Last Updated:** April 6, 2026
**Version:** 1.0.0
