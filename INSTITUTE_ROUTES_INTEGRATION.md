# Institute Routes Integration Guide

Add these routes to your main `routes/index.jsx` file:

## Import Statements

```javascript
import { 
  CreateInstitute,
  InstituteList,
  InstitutePendingApproval,
  InstituteDetails
} from "../pages/admin/institutes";
import PrivateRoute from "../provider/PrivateRoute";
```

## Routes Configuration

```javascript
// Add to your admin routes array or main routes
const instituteRoutes = [
  // List all institutes
  {
    path: "institutes",
    element: (
      <PrivateRoute requiredRoles={["admin", "superadmin", "md"]}>
        <InstituteList />
      </PrivateRoute>
    ),
  },
  // Create new institute
  {
    path: "institutes/create",
    element: (
      <PrivateRoute requiredRoles={["admin", "superadmin"]}>
        <CreateInstitute />
      </PrivateRoute>
    ),
  },
  // MD Pending Approvals
  {
    path: "institutes/pending-approval",
    element: (
      <PrivateRoute requiredRoles={["md"]}>
        <InstitutePendingApproval />
      </PrivateRoute>
    ),
  },
  // View & Edit institute details
  {
    path: "institutes/:id",
    element: (
      <PrivateRoute requiredRoles={["admin", "superadmin", "md"]}>
        <InstituteDetails />
      </PrivateRoute>
    ),
  },
  // Edit specific institute
  {
    path: "institutes/edit/:id",
    element: (
      <PrivateRoute requiredRoles={["admin", "superadmin"]}>
        <InstituteDetails />
      </PrivateRoute>
    ),
  },
];
```

## Navigation Links (Example)

```javascript
// Navigate to institute list
navigate("/institutes");

// Navigate to create institute
navigate("/institutes/create");

// Navigate to view details
navigate(`/institutes/${instituteId}`);

// Navigate to edit
navigate(`/institutes/edit/${instituteId}`);

// Navigate to pending approvals (MD)
navigate("/institutes/pending-approval");
```

## Sidebar/Menu Integration

Add these menu items to your sidebar:

```javascript
{
  title: "Institutes",
  icon: "BuildingOfficeIcon",
  subItems: [
    {
      title: "All Institutes",
      route: "/institutes",
      requiredRoles: ["admin", "superadmin", "md"]
    },
    {
      title: "Create Institute",
      route: "/institutes/create",
      requiredRoles: ["admin", "superadmin"]
    },
    {
      title: "Pending Approvals",
      route: "/institutes/pending-approval",
      requiredRoles: ["md"]
    }
  ]
}
```

## RTK Query Setup (if not already configured)

The RTK Query endpoints are automatically registered in `redux/features/institutes/instituteApi.js`.

Make sure your base API is properly configured with the correct backend URL:

```javascript
// redux/services/baseApi.js
export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://your-backend-url/api", // or process.env.REACT_APP_API_URL
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Institutes", "Customers", "Users", ...],
  endpoints: (builder) => ({}),
});
```

## Complete Example Routes File

```javascript
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "../provider/PrivateRoute";

// Admin Pages
import { 
  CreateInstitute,
  InstituteList,
  InstitutePendingApproval,
  InstituteDetails
} from "../pages/admin/institutes";

const routes = [
  // ... other routes ...
  
  // Institute Management
  {
    path: "dashboard",
    children: [
      {
        path: "institutes",
        element: (
          <PrivateRoute requiredRoles={["admin", "superadmin", "md"]}>
            <InstituteList />
          </PrivateRoute>
        ),
      },
      {
        path: "institutes/create",
        element: (
          <PrivateRoute requiredRoles={["admin", "superadmin"]}>
            <CreateInstitute />
          </PrivateRoute>
        ),
      },
      {
        path: "institutes/pending-approval",
        element: (
          <PrivateRoute requiredRoles={["md"]}>
            <InstitutePendingApproval />
          </PrivateRoute>
        ),
      },
      {
        path: "institutes/:id",
        element: (
          <PrivateRoute requiredRoles={["admin", "superadmin", "md"]}>
            <InstituteDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "institutes/edit/:id",
        element: (
          <PrivateRoute requiredRoles={["admin", "superadmin"]}>
            <InstituteDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  // ... other routes ...
];

export const router = createBrowserRouter(routes);
```

## Environment Variables (Optional)

Add to your `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_INSTITUTE_LIST_PAGE_SIZE=10
```

Then use in the component:

```javascript
const pageSize = parseInt(process.env.REACT_APP_INSTITUTE_LIST_PAGE_SIZE || "10");
```

---

## Common Issues & Solutions

### Institute list not showing?
- Check PrivateRoute component properly validates roles
- Verify Redux is configured correctly
- Check browser devtools network tab for API errors

### Cannot see Pending Approvals?
- Ensure user role is "md" (case-sensitive)
- Check that user is assigned as MD in the approvalFlow

### Edit button not appearing?
- Verify user has admin or superadmin role
- Check that user role matches PrivateRoute requirements

---

**Created:** April 6, 2026
