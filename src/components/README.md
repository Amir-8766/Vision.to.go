# Admin Dashboard Components

This directory contains the refactored components from the AdminDashboard page. The components have been separated to improve maintainability, testability, and reusability.

## Components

### StatCard

- **File**: `StatCard.jsx`
- **Purpose**: Displays statistics with icons, values, and optional trend indicators
- **Props**: `title`, `value`, `icon`, `trend`, `color`, `bgColor`
- **Test**: `__tests__/StatCard.test.jsx`

### RevenueChart

- **File**: `RevenueChart.jsx`
- **Purpose**: Displays revenue trends with configurable date ranges
- **Props**: `monthlyRevenue`, `dateRange`, `setDateRange`, `colors`

### OrderStatusChart

- **File**: `OrderStatusChart.jsx`
- **Purpose**: Shows distribution of order statuses with progress bars
- **Props**: `orderStatuses`, `colors`

### TopProductsChart

- **File**: `TopProductsChart.jsx`
- **Purpose**: Displays top-selling products with sales data
- **Props**: `topProducts`, `colors`

### OrdersView

- **File**: `OrdersView.jsx`
- **Purpose**: Complete order management interface with filtering and status updates
- **Features**: Order filtering, status updates, export functionality

### UsersView

- **File**: `UsersView.jsx`
- **Purpose**: User management interface with search and role management
- **Features**: User search, role display, export functionality

## Benefits of This Refactoring

### 1. **Maintainability**

- Each component has a single responsibility
- Easier to locate and fix bugs
- Simpler to add new features

### 2. **Testability**

- Components can be tested in isolation
- Mock data can be easily provided
- Unit tests are more focused and reliable

### 3. **Reusability**

- Components can be reused in other parts of the application
- Props interface makes components flexible
- Consistent styling and behavior

### 4. **Code Organization**

- Reduced file size in AdminDashboard.jsx (from 854 lines to ~413 lines)
- Clear separation of concerns
- Better developer experience

### 5. **Performance**

- Components can be optimized individually
- Easier to implement React.memo() where needed
- Better code splitting opportunities

## Usage Example

```jsx
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';

// In your component
<StatCard
  title="Total Users"
  value="1,234"
  icon={<FaUsers />}
  trend={12}
  color="border-blue-500"
  bgColor="bg-white"
/>

<RevenueChart
  monthlyRevenue={monthlyData}
  dateRange={dateRange}
  setDateRange={setDateRange}
  colors={colors}
/>
```

## Testing

Each component can be tested independently:

```bash
npm test src/components/__tests__/StatCard.test.jsx
```

## Future Improvements

1. Add PropTypes or TypeScript for better type safety
2. Create more comprehensive test suites
3. Add Storybook stories for component documentation
4. Implement error boundaries for each component
5. Add loading states and error handling
