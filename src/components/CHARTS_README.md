# Chart Components Documentation

## 📊 Overview

This project uses **Recharts** library for all chart components. Recharts is a composable charting library built on React components.

## 🎯 Chart Components

### 1. **RevenueChart** (Bar Chart)

- **Type**: Bar Chart
- **Purpose**: Display monthly revenue data
- **Features**:
  - Responsive design
  - Custom tooltips with formatted currency
  - Hover effects
  - Date range filtering
  - Custom styling with brand colors

### 2. **OrderStatusChart** (Pie Chart)

- **Type**: Pie Chart
- **Purpose**: Show order status distribution
- **Features**:
  - Donut chart with inner radius
  - Custom legend
  - Percentage calculations
  - Color-coded segments
  - Interactive tooltips

### 3. **RevenueTrendChart** (Area Chart)

- **Type**: Area Chart
- **Purpose**: Display revenue trends over time
- **Features**:
  - Smooth area fill
  - Gradient opacity
  - Trend visualization
  - Responsive container

## 🚀 Benefits of Using Recharts

### **Performance**

- Optimized rendering
- Smooth animations
- Efficient data updates
- Memory management

### **Features**

- **Responsive**: Automatically adapts to container size
- **Interactive**: Hover effects, tooltips, zoom
- **Customizable**: Full control over styling and behavior
- **Accessible**: Built-in accessibility features

### **Developer Experience**

- **Declarative**: Easy to understand and maintain
- **Composable**: Mix and match chart components
- **TypeScript**: Full TypeScript support
- **Documentation**: Excellent documentation and examples

## 📈 Chart Features

### **Common Features**

```javascript
// Responsive container
<ResponsiveContainer width="100%" height="100%">
  <ChartComponent data={data}>{/* Chart elements */}</ChartComponent>
</ResponsiveContainer>
```

### **Custom Tooltips**

```javascript
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-pink-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};
```

### **Styling**

```javascript
// Custom colors and styling
<Bar
  dataKey="revenue"
  fill={colors.brightPink}
  radius={[4, 4, 0, 0]}
  className="hover:opacity-80 transition-opacity"
/>
```

## 🔧 Installation

```bash
npm install recharts
```

## 📝 Usage Examples

### **Bar Chart**

```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="revenue" fill="#DE5499" />
</BarChart>;
```

### **Pie Chart**

```jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

<PieChart>
  <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={80}>
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={entry.color} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>;
```

### **Area Chart**

```jsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

<AreaChart data={data}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Area
    type="monotone"
    dataKey="revenue"
    stroke="#DE5499"
    fill="#DE5499"
    fillOpacity={0.3}
  />
</AreaChart>;
```

## 🎨 Customization

### **Color Palette**

```javascript
const colors = {
  brightPink: "#DE5499",
  orange: "#E9944C",
  darkTeal: "#264143",
  lightPink: "#EDDCD9",
};
```

### **Responsive Design**

```javascript
// Charts automatically adapt to container size
<div className="h-64">
  <ResponsiveContainer width="100%" height="100%">
    <ChartComponent />
  </ResponsiveContainer>
</div>
```

## 🔍 Best Practices

1. **Data Formatting**: Always format data before passing to charts
2. **Responsive Design**: Use ResponsiveContainer for mobile compatibility
3. **Custom Tooltips**: Provide meaningful information in tooltips
4. **Color Consistency**: Use brand colors throughout
5. **Performance**: Avoid unnecessary re-renders with proper memoization

## 🚀 Future Enhancements

- **Real-time Updates**: Live data streaming
- **Advanced Interactions**: Zoom, pan, brush
- **Export Features**: PNG, SVG export
- **Animations**: Smooth transitions and loading states
- **Accessibility**: Enhanced screen reader support
