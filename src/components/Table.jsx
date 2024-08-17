import React, { useState, useMemo } from "react";
import "./Table.scss";

const Table = ({ data }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const pivotData = useMemo(() => {
    const pivot = {};
    const stores = new Set();

    data.forEach((item) => {
      if (!pivot[item.category]) {
        pivot[item.category] = { total: {}, products: {} };
      }
      if (!pivot[item.category].products[item.product]) {
        pivot[item.category].products[item.product] = {};
      }
      if (!pivot[item.category].total[item.store]) {
        pivot[item.category].total[item.store] = 0;
      }
      pivot[item.category].products[item.product][item.store] = item.pcs;
      pivot[item.category].total[item.store] += item.pcs;
      stores.add(item.store);
    });
    return { pivot, stores: Array.from(stores).sort() };
  }, [data]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <table className="pivot-table">
      <thead>
        <tr>
          <th>Kategória / Produkt</th>
          {pivotData.stores.map((store) => (
            <th key={store}>{store}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(pivotData.pivot).map(([category, categoryData]) => (
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
