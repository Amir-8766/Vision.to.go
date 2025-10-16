import React from "react";

const TopProductsChart = ({ topProducts, colors }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">
      Top Selling Products
    </h3>
    <div className="space-y-4">
      {topProducts.map((product, index) => (
        <div
          key={product._id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: colors.brightPink }}
            >
              {index + 1}
            </div>
            <div>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-sm text-gray-500">€{product.price}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900">{product.sales} sold</p>
            <p className="text-sm text-gray-500">
              €{(product.sales * product.price).toFixed(2)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopProductsChart;
