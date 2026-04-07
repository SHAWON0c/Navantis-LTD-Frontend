# Sidebar Configuration for Institute Management

Add this configuration to your sidebar menu system:

## Sample Sidebar Configuration

```javascript
// In your sidebar.config.json or sidebar configuration file

{
  "label": "Admin",
  "icon": "SettingsIcon",
  "items": [
    // ... other admin items ...
    
    {
      "label": "Institute Management",
      "icon": "BuildingOfficeIcon", // or use library-specific icon
      "requiredRoles": ["admin", "superadmin", "md"],
      "subItems": [
        {
          "label": "All Institutes",
          "icon": "ListIcon",
          "route": "/admin/institutes",
          "requiredRoles": ["admin", "superadmin", "md"],
          "description": "View and manage all institutes"
        },
        {
          "label": "Create Institute",
          "icon": "PlusIcon",
          "route": "/admin/institutes/create",
          "requiredRoles": ["admin", "superadmin"],
          "description": "Create a new institute"
        },
        {
          "label": "Pending Approvals",
          "icon": "CheckCircleIcon",
          "route": "/admin/institutes/pending-approval",
          "requiredRoles": ["md"],
          "description": "Review institutes pending approval",
          "badge": "NEW" // Optional: show badge for new approvals
        }
      ]
    }
  ]
}
```

## Sidebar Component Integration

### Using React Router Navigation

```javascript
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ item, userRole }) => {
  const navigate = useNavigate();
  
  // Check if user has permission
  if (item.requiredRoles && !item.requiredRoles.includes(userRole)) {
    return null;
  }

  return (
    <div className="sidebar-item">
      {item.subItems ? (
        // Parent item with children
        <div className="parent-item">
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
          <ChevronDown className="accordion-icon" />
        </div>
      ) : (
        // Single item
        <button
          onClick={() => navigate(item.route)}
          className="menu-item"
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && <Badge>{item.badge}</Badge>}
        </button>
      )}
      
      {/* Sub-items */}
      {item.subItems && (
        <div className="sub-menu">
          {item.subItems.map((subItem, idx) => {
            if (subItem.requiredRoles && !subItem.requiredRoles.includes(userRole)) {
              return null;
            }
            
            return (
              <button
                key={idx}
                onClick={() => navigate(subItem.route)}
                className="sub-menu-item"
              >
                <span className="icon">{subItem.icon}</span>
                <span>{subItem.label}</span>
                {subItem.badge && <Badge>{subItem.badge}</Badge>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
```

## Icon Options

Choose from these or your preferred icon library:

```javascript
// Using lucide-react
import {
  Building2,        // Institute/Building icon
  List,            // List view
  Plus,            // Create/Add
  CheckCircle,     // Approval/Check
  Users,           // Partners
  Settings,        // Configuration
  BarChart3,       // Analytics
} from "lucide-react";

// Using react-icons/md
import {
  MdBusiness,      // Building/Institute
  MdList,          // List
  MdAdd,           // Add/Create
  MdCheckCircle,   // Check/Approve
  MdPeople,        // Partners
  MdSettings,      // Settings
  MdBarChart,      // Analytics
} from "react-icons/md";

// Using react-icons/fa
import {
  FaBuilding,      // Building
  FaList,          // List
  FaPlus,          // Add
  FaCheckCircle,   // Check
  FaUsers,         // Users
  FaCog,           // Settings
  FaChartBar,      // Analytics
} from "react-icons/fa";
```

## Tailwind CSS Styling for Sidebar Items

```css
/* Parent menu item */
.menu-parent {
  @apply flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-blue-50 transition;
}

/* Sub-menu item */
.menu-sub-item {
  @apply flex items-center gap-3 px-6 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition ml-4 border-l-2 border-gray-200 hover:border-blue-500;
}

/* Active item */
.menu-item.active {
  @apply bg-blue-100 text-blue-600 font-semibold border-l-4 border-blue-500;
}

/* Badge for alerts */
.badge {
  @apply inline-block ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold;
}
```

## Component with Badge Counter (Optional)

```javascript
import { useGetPendingInstitutesQuery } from "@redux/features/institutes/instituteApi";

const InstituteSidebarItem = ({ item, userRole }) => {
  const navigate = useNavigate();
  const { data: response } = useGetPendingInstitutesQuery("pending");
  const pendingCount = response?.data?.length || 0;
  
  return (
    <div className="sidebar-item">
      <div className="parent-item">
        <span className="icon">
          <MdBusiness size={20} />
        </span>
        <span>Institute Management</span>
      </div>
      
      <div className="sub-menu">
        {/* All Institutes */}
        {["admin", "superadmin", "md"].includes(userRole) && (
          <button
            onClick={() => navigate("/admin/institutes")}
            className="sub-menu-item"
          >
            <MdList size={18} />
            <span>All Institutes</span>
          </button>
        )}
        
        {/* Create Institute */}
        {["admin", "superadmin"].includes(userRole) && (
          <button
            onClick={() => navigate("/admin/institutes/create")}
            className="sub-menu-item"
          >
            <MdAdd size={18} />
            <span>Create Institute</span>
          </button>
        )}
        
        {/* Pending Approvals with Badge */}
        {userRole === "md" && (
          <button
            onClick={() => navigate("/admin/institutes/pending-approval")}
            className="sub-menu-item flex justify-between"
          >
            <div className="flex items-center gap-3">
              <MdCheckCircle size={18} />
              <span>Pending Approvals</span>
            </div>
            {pendingCount > 0 && (
              <span className="badge bg-red-100 text-red-700">
                {pendingCount}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
```

## Alternative: JSON Configuration Format

```json
{
  "name": "Institute Management",
  "icon": "MdBusiness",
  "requiredRoles": ["admin", "superadmin", "md"],
  "badge": null,
  "badgeColor": "red",
  "children": [
    {
      "name": "All Institutes",
      "path": "/admin/institutes",
      "icon": "MdList",
      "requiredRoles": ["admin", "superadmin", "md"],
      "description": "View all institutes with filtering and search"
    },
    {
      "name": "Create Institute",
      "path": "/admin/institutes/create",
      "icon": "MdAdd",
      "requiredRoles": ["admin", "superadmin"],
      "description": "Create a new institute for approval workflow"
    },
    {
      "name": "Pending Approvals",
      "path": "/admin/institutes/pending-approval",
      "icon": "MdCheckCircle",
      "icon_color": "green",
      "requiredRoles": ["md"],
      "badge_count_api": "/api/institutes/pending/count",
      "description": "Review and approve pending institutes"
    }
  ]
}
```

## Dynamic Badge Counter Hook

```javascript
// useInstituteStats.js
import { useGetPendingInstitutesQuery, useGetInstitutesByStatusQuery } from "@redux/features/institutes/instituteApi";

export const useInstituteStats = () => {
  const { data: pendingResponse } = useGetPendingInstitutesQuery("pending");
  const { data: approvedResponse } = useGetInstitutesByStatusQuery("approved");
  const { data: activeResponse } = useGetInstitutesByStatusQuery("active");
  
  return {
    pendingCount: pendingResponse?.data?.length || 0,
    approvedCount: approvedResponse?.data?.length || 0,
    activeCount: activeResponse?.data?.length || 0,
    totalCount: (pendingResponse?.data?.length || 0) + 
                (approvedResponse?.data?.length || 0) + 
                (activeResponse?.data?.length || 0),
  };
};

// Usage in Sidebar
const InstituteMenu = () => {
  const { pendingCount, approvedCount, activeCount } = useInstituteStats();
  
  return (
    <div>
      <MenuItem label="All Institutes" route="/admin/institutes" />
      <MenuItem 
        label="Create Institute" 
        route="/admin/institutes/create" 
      />
      <MenuItem 
        label="Pending Approvals" 
        route="/admin/institutes/pending-approval"
        badge={pendingCount > 0 ? pendingCount : null}
        badgeColor="red"
      />
    </div>
  );
};
```

## Breadcrumb Integration

```javascript
// For breadcrumb navigation, use this path structure:
const breadcrumbs = {
  "/admin/institutes": ["EMS", "Admin", "Institute List"],
  "/admin/institutes/create": ["EMS", "Admin", "Create Institute"],
  "/admin/institutes/pending-approval": ["EMS", "MD Dashboard", "Pending Approvals"],
  "/admin/institutes/:id": ["EMS", "Admin", "Institute Details"],
};
```

## Complete Sidebar Example Component

```javascript
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@provider/AuthProvider";
import { useInstituteStats } from "@hooks/useInstituteStats";
import {
  MdBusiness,
  MdList,
  MdAdd,
  MdCheckCircle,
} from "react-icons/md";

const InstituteSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const { pendingCount } = useInstituteStats();
  
  const userRole = userInfo?.role?.toLowerCase();
  
  const isActive = (path) => location.pathname.includes(path);
  
  const items = [
    {
      label: "All Institutes",
      path: "/admin/institutes",
      icon: MdList,
      roles: ["admin", "superadmin", "md"],
    },
    {
      label: "Create Institute",
      path: "/admin/institutes/create",
      icon: MdAdd,
      roles: ["admin", "superadmin"],
    },
    {
      label: "Pending Approvals",
      path: "/admin/institutes/pending-approval",
      icon: MdCheckCircle,
      roles: ["md"],
      badge: pendingCount > 0 ? pendingCount : null,
    },
  ];
  
  return (
    <div className="space-y-1">
      <div className="px-4 py-2 font-semibold text-gray-700 flex items-center gap-2">
        <MdBusiness size={20} />
        <span>Institute Management</span>
      </div>
      
      {items.map((item) => {
        // Check role permission
        if (!item.roles.includes(userRole)) return null;
        
        const Icon = item.icon;
        const active = isActive(item.path);
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
              transition-colors duration-200
              ${active
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-auto px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default InstituteSidebar;
```

---

**Integration Tips:**
1. Place InstituteSidebar component in your main Sidebar
2. Update icon imports based on your icon library
3. Adjust colors to match your theme
4. Test with different user roles
5. Add to appropriate admin section

For complete implementation, refer to `INSTITUTE_ROUTES_INTEGRATION.md`
