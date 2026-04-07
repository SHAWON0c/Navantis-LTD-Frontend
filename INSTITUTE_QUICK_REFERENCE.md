# Institute API - Quick Reference Card

## 📋 File Locations

```
RTK Query Service:
└─ src/redux/features/institutes/instituteApi.js

Frontend Pages:
├─ src/pages/admin/institutes/CreateInstitute.jsx
├─ src/pages/admin/institutes/InstituteList.jsx
├─ src/pages/admin/institutes/InstitutePendingApproval.jsx
├─ src/pages/admin/institutes/InstituteDetails.jsx
└─ src/pages/admin/institutes/index.js

Documentation:
├─ INSTITUTE_IMPLEMENTATION_SUMMARY.md
├─ INSTITUTE_ROUTES_INTEGRATION.md
├─ INSTITUTE_SIDEBAR_CONFIG.md
├─ INSTITUTE_QUICK_REFERENCE.md (this file)
└─ src/pages/admin/institutes/INSTITUTE_IMPLEMENTATION_GUIDE.md
```

---

## 🚀 Quick Start In 3 Steps

### Step 1: Add Routes
```javascript
// routes/index.jsx
import { CreateInstitute, InstituteList, InstitutePendingApproval, InstituteDetails } from "@pages/admin/institutes";

const routes = [
  { path: "institutes", element: <InstituteList /> },
  { path: "institutes/create", element: <CreateInstitute /> },
  { path: "institutes/pending-approval", element: <InstitutePendingApproval /> },
  { path: "institutes/:id", element: <InstituteDetails /> },
];
```

### Step 2: Add Sidebar Items
```javascript
{
  icon: "BuildingOfficeIcon",
  label: "Institutes",
  subItems: [
    { label: "List", route: "/institutes" },
    { label: "Create", route: "/institutes/create" },
    { label: "Approvals", route: "/institutes/pending-approval" }
  ]
}
```

### Step 3: Use Hooks
```javascript
import { useCreateInstituteMutation, useGetInstitutesByStatusQuery } from "@redux/features/institutes/instituteApi";
```

---

## 🔗 API Hooks Reference

| Hook | Method | Purpose |
|------|--------|---------|
| `useCreateInstituteMutation` | POST | Create institute |
| `useGetAllInstitutesQuery` | GET | Get all institutes |
| `useGetInstitutesByStatusQuery` | GET | Filter by status |
| `useGetPendingInstitutesQuery` | GET | MD approval list |
| `useGetInstituteByIdQuery` | GET | Get single institute |
| `useApproveInstituteMutation` | PUT | Approve (MD) |
| `useActivateInstituteMutation` | PUT | Activate |
| `useUpdateInstituteMutation` | PATCH | Update details |

---

## 📝 API Endpoints

```
POST   /institutes                      Create institute (admin/superadmin)
GET    /institutes                      Get all institutes
GET    /institutes/status/:status       Get by status (pending/approved/active)
GET    /institutes/pending/list         Get pending (MD only)
GET    /institutes/:id                  Get single institute
PUT    /institutes/approve/:id          Approve (MD only)
PUT    /institutes/activate/:id         Activate
PATCH  /institutes/:id                  Update institute
```

---

## 🎯 Component Features

### CreateInstitute.jsx
- ✅ Form with all fields
- ✅ Real-time validation
- ✅ Conditional credit/day limits
- ✅ JSON preview
- ✅ Toast notifications

**Usage:**
```javascript
<CreateInstitute />
```

### InstituteList.jsx
- ✅ Table with filters
- ✅ Status filters (Active/Approved/Pending)
- ✅ Search functionality
- ✅ Pagination
- ✅ Edit/View/Activate buttons

**Usage:**
```javascript
<InstituteList />
```

### InstitutePendingApproval.jsx
- ✅ MD approval interface
- ✅ Pending institutes only
- ✅ Quick approve action
- ✅ Created by info

**Usage:**
```javascript
<InstitutePendingApproval />  // MD only
```

### InstituteDetails.jsx
- ✅ View/Edit modes
- ✅ Color-coded sections
- ✅ Locked fields
- ✅ Status display

**Usage:**
```javascript
<InstituteDetails />  // Automatic based on route
```

---

## 🔐 Role Access Matrix

```
             Admin    SuperAdmin    MD    User
Create         ✅         ✅        ❌     ❌
List           ✅         ✅        ✅     ❌
View           ✅         ✅        ✅     ❌
Edit           ✅         ✅        ❌     ❌
Approve        ❌         ❌        ✅     ❌
Activate       ✅         ✅        ✅     ❌
```

---

## 📊 Status Flow

```
                    pending
                       ↓ (MD approves)
                   approved (instituteId: INS-1)
                       ↓ (Admin activates)
                     active
```

**Status Colors:**
- 🟡 pending: yellow
- 🔵 approved: blue
- 🟢 active: green

---

## ✅ Validation Rules

### Always Required:
- Institute Name
- Trade License
- Drug License
- Address
- Mobile
- Email
- Contact Person
- Pay Mode (≥1)

### Conditional:
- Credit Limit: if payMode has credit/stc/spic
- Day Limit: if payMode has credit/spic

### Pay Mode Logic:
| Mode | Credit Limit | Day Limit |
|------|:------------:|:---------:|
| Cash | ❌ | ❌ |
| Credit | ✅ | ✅ |
| STC | ✅ | ❌ |
| SPIC | ✅ | ✅ |

---

## 🔗 useGetInstitutesByStatusQuery Examples

```javascript
// Get active institutes
const { data } = useGetInstitutesByStatusQuery("active");

// Get approved institutes
const { data } = useGetInstitutesByStatusQuery("approved");

// Get pending institutes
const { data } = useGetInstitutesByStatusQuery("pending");

// Use response
const institutes = data?.data || [];
```

---

## 🔗 useCreateInstituteMutation Examples

```javascript
const [createInstitute, { isLoading }] = useCreateInstituteMutation();

const handleCreate = async () => {
  try {
    const result = await createInstitute({
      instituteName: "Hospital ABC",
      tradeLicense: "TL-001",
      drugLicense: "DL-001",
      address: "123 Main St",
      mobile: "+92-300-1234567",
      email: "info@hospital.com",
      contactPerson: "Dr. John",
      discount: 5,
      payMode: ["cash", "credit"],
      creditLimit: 50000,
      dayLimit: 10000
    }).unwrap();
    
    console.log("Created:", result.data._id);
  } catch (error) {
    console.error("Error:", error?.data?.message);
  }
};
```

---

## 🔗 useUpdateInstituteMutation Examples

```javascript
const [updateInstitute] = useUpdateInstituteMutation();

const handleUpdate = async (id) => {
  try {
    const result = await updateInstitute({
      id,
      payload: {
        instituteName: "New Name",
        address: "New Address",
        discount: 8,
        creditLimit: 75000
      }
    }).unwrap();
    
    console.log("Updated:", result.data);
  } catch (error) {
    console.error("Error:", error?.data?.message);
  }
};
```

---

## 🔗 useApproveInstituteMutation Examples

```javascript
const [approveInstitute] = useApproveInstituteMutation();

const handleApprove = async (instituteId) => {
  try {
    const result = await approveInstitute(instituteId).unwrap();
    console.log("Approved! New ID:", result.data.instituteId); // INS-1
  } catch (error) {
    console.error("Error:", error?.data?.message);
  }
};
```

---

## 🔗 useActivateInstituteMutation Examples

```javascript
const [activateInstitute] = useActivateInstituteMutation();

const handleActivate = async (instituteId) => {
  try {
    const result = await activateInstitute(instituteId).unwrap();
    console.log("Status:", result.data.status); // "active"
  } catch (error) {
    console.error("Error:", error?.data?.message);
  }
};
```

---

## ⚠️ Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Phone number already exists` | Mobile duplicate | Use new mobile |
| `Trade license already exists` | License duplicate | Use new license |
| `Unauthorized` | Invalid token | Login again |
| `Not authorized to approve` | Not MD | Switch to MD account |
| `Only approved institutes can be activated` | Wrong status | Approve first |
| `Institute not found` | Invalid ID | Check ID param |

---

## 🎨 Styling Classes

```css
/* Form Input */
.input-field = "w-full border rounded p-2 focus:ring-2 focus:ring-blue-300"

/* Button Primary */
.btn-primary = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"

/* Button Outline */
.btn-outline = "border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"

/* Status Badge - Active */
.badge-active = "bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"

/* Status Badge - Approved */
.badge-approved = "bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"

/* Status Badge - Pending */
.badge-pending = "bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"

/* Card */
.card = "bg-white rounded-lg shadow-md p-6 space-y-4"

/* Table Header */
.table-header = "bg-gray-50 border-b border-gray-200"

/* Table Row */
.table-row = "border-b border-gray-100 hover:bg-gray-50"
```

---

## 🧪 Test Scenarios

**Scenario 1: Create Flow**
```
1. Go to /institutes/create
2. Fill form (all fields)
3. Select payment mode
4. Auto-fill credit/day limits
5. Submit
6. ✅ Status: pending
```

**Scenario 2: MD Approve Flow**
```
1. Go to /institutes/pending-approval (as MD)
2. See pending institutes
3. Click "Approve"
4. ✅ Status: approved
5. ✅ instituteId assigned: INS-1
```

**Scenario 3: Activate Flow**
```
1. Go to /institutes
2. Filter: approved
3. Find approved institute
4. Click "Activate"
5. ✅ Status: active
```

**Scenario 4: Edit Flow**
```
1. Go to /institutes
2. Click "View"
3. Click "Edit"
4. Update fields
5. Click "Save"
6. ✅ Changes saved
```

---

## 📱 Mobile-First Features

- ✅ Responsive tables
- ✅ Stack forms on mobile
- ✅ Touch-friendly buttons
- ✅ Flexible pagination
- ✅ Readable text sizes

---

## 🎯 Performance Tips

1. **Cache data:** RTK Query auto-caches
2. **Pagination:** Use for large lists
3. **Search:** Client-side filter
4. **Lazy load:** Images in production
5. **Memoize:** Heavy computations

---

## 📞 Support Files

| File | Purpose |
|------|---------|
| INSTITUTE_IMPLEMENTATION_SUMMARY.md | Complete overview |
| INSTITUTE_ROUTES_INTEGRATION.md | Route setup |
| INSTITUTE_SIDEBAR_CONFIG.md | Menu integration |
| INSTITUTE_IMPLEMENTATION_GUIDE.md | Detailed guide |
| INSTITUTE_QUICK_REFERENCE.md | This file |

---

## ⏱️ Development Timeline

- ✅ Day 1: Backend API created
- ✅ Day 2-3: Frontend pages built
- ✅ Day 4: Documentation written
- 📋 Day 5: Integration & testing
- 🚀 Day 6: Production deployment

---

## 💡 Best Practices

1. ✅ Always use usePrivateRoute for protected pages
2. ✅ Check user role before rendering
3. ✅ Validate form on both client & server
4. ✅ Use try-catch with await unwrap()
5. ✅ Show loading states
6. ✅ Handle errors gracefully
7. ✅ Use toast for notifications
8. ✅ Cache invalidation on mutations

---

**Quick Links:**
- 📚 Full Implementation Guide: `INSTITUTE_IMPLEMENTATION_GUIDE.md`
- 🔗 Routes Setup: `INSTITUTE_ROUTES_INTEGRATION.md`
- 🎨 Sidebar Config: `INSTITUTE_SIDEBAR_CONFIG.md`
- 📊 Summary: `INSTITUTE_IMPLEMENTATION_SUMMARY.md`

---

**Version:** 1.0.0  
**Date:** April 6, 2026  
**Status:** ✅ Complete
