import React, { useState, useMemo } from "react";

const Table = ({ data }) => {
  const [expandedCategory, setExpandedCategory] = useState({});
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

  // Function to sort products within a category based on the current sort state
  const getSortedProducts = (products) => {
    const sortableProducts = Object.entries(products);
    if (sort.key === null) {
      return sortableProducts;
    }

    return sortableProducts.sort((a, b) => {
      const aValue = a[1][sort.key] || 0;
      const bValue = b[1][sort.key] || 0;

      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }

      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Function to toggle the expansion state of a category
  const toggleCategory = (category) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  // Function to handle sorting when a column header is clicked
  const handleSort = (key) => {
    let direction = "asc";
    if (sort.key === key) {
      if (sort.direction === "asc") {
        direction = "desc";
      } else if (sort.direction === "desc") {
        direction = null;
        key = null;
      }
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
          <th className="category-span">Kategória / Produkt</th>
          {pivotData.stores.map((store) => (
            <th
              key={store}
              onClick={() => handleSort(store)}
              className={`sortable ${
                sort.key === store && sort.direction !== null ? "active" : ""
              }`}
            >
              {store}
              <span className="sort-icon">{getSortIcon(store)}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(pivotData.pivot).map(([category, categoryData]) => (
          <React.Fragment key={category}>
            <tr className="category-row">
              <td
                onClick={() => toggleCategory(category)}
                className="category-header-cell"
              >
                <div className="category-header">
                  <button>{expandedCategory === category ? "−" : "+"}</button>
                  {category}
                </div>
              </td>
              {pivotData.stores.map((store) => (
                <td key={store}>{categoryData.total[store] || 0}</td>
              ))}
            </tr>
            {expandedCategory === category &&
              getSortedProducts(categoryData.products).map(
                ([product, productData]) => (
                  <tr key={product} className="product-row">
                    <td>{product}</td>
                    {pivotData.stores.map((store) => (
                      <td
                        key={store}
                        style={{
                          backgroundColor:
                            sort.key === store ? "#c44536" : "inherit",
                          color: sort.key === store ? "#edddd4" : "inherit",
                          fontWeight: sort.key === store ? "500" : "inherit",
                        }}
                      >
                        {productData[store] || 0}
                      </td>
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
