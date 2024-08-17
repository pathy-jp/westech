import React, { useState, useMemo } from "react";
import "./Table.scss";

const Table = ({ data }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [sort, setSort] = useState({ key: null, direction: null });

  // Memoized function to pivot and process the data
  const pivotData = useMemo(() => {
    const pivot = {};
    const stores = new Set();

    // Iterate through the data to create the pivot structure
    data.forEach((item) => {
      if (!pivot[item.category]) {
        pivot[item.category] = { total: {}, products: {} };
      }
      if (!pivot[item.category].products[item.product]) {
        pivot[item.category].products[item.product] = {};
      }
      if (!pivot[item.category].products[item.product][item.store]) {
        pivot[item.category].products[item.product][item.store] = 0;
      }
      if (!pivot[item.category].total[item.store]) {
        pivot[item.category].total[item.store] = 0;
      }
      pivot[item.category].products[item.product][item.store] += item.pcs;
      pivot[item.category].total[item.store] += item.pcs;
      stores.add(item.store);
    });

    return { pivot, stores: Array.from(stores).sort() };
  }, [data]);

  // Memoized function to sort the data based on the current sort state
  const sortedData = useMemo(() => {
    const sortableData = Object.entries(pivotData.pivot);
    if (sort.key === null) {
      return sortableData;
    }

    return [...sortableData].sort((a, b) => {
      const aValue = a[1].total[sort.key] || 0;
      const bValue = b[1].total[sort.key] || 0;

      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [pivotData.pivot, sort]);

  // Function to toggle the expansion state of a category
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // Function to handle sorting when a column header is clicked
  const handleSort = (key) => {
    let direction = "asc";
    if (sort.key === key && sort.direction === "asc") {
      direction = "desc";
    } else if (sort.key === key && sort.direction === "desc") {
      direction = null;
    }
    setSort({ key, direction });
  };

  // Function to get the appropriate sort icon
  const getSortIcon = (store) => {
    if (sort.key === store) {
      if (sort.direction === "asc") {
        return "▲";
      } else if (sort.direction === "desc") {
        return "▼";
      }
    }

    return null;
  };

  return (
    <table className="pivot-table">
      <thead>
        <tr>
          <th>Kategória / Produkt</th>
          {pivotData.stores.map((store) => (
            <th
              key={store}
              onClick={() => handleSort(store)}
              className={`sortable ${sort.key === store ? "active" : ""}`}
            >
              {store}
              {getSortIcon(store)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map(([category, categoryData]) => (
          <React.Fragment key={category}>
            <tr className="category-row">
              <td>
                <button onClick={() => toggleCategory(category)}>
                  {expandedCategories[category] ? "−" : "+"}
                </button>
                {category}
              </td>
              {pivotData.stores.map((store) => (
                <td key={store}>{categoryData.total[store] || 0}</td>
              ))}
            </tr>
            {/* Product rows (visible when category is expanded) */}
            {expandedCategories[category] &&
              Object.entries(categoryData.products).map(
                ([product, productData]) => (
                  <tr key={product} className="product-row">
                    <td>{product}</td>
                    {pivotData.stores.map((store) => (
                      <td key={store}>{productData[store] || 0}</td>
                    ))}
                  </tr>
                )
              )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
