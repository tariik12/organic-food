import React, { useContext, useState, useEffect } from "react";
import PDFDownload from "../../../Shared/PDFDownload/PDFDownload";
import { ProductContext } from "../../../../provider/ItemProvider/ProductProvider";

const ListProduct = () => {
  const { Products } = useContext(ProductContext);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filteredData = [...Products];

    if (searchQuery) {
      filteredData = filteredData.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.parentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.madeIn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setData(filteredData);
  }, [Products, searchQuery]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex items-end justify-between">
        <h1>Product List</h1>
        <div className="text-end">
          <p>Search</p>
          <input
            type="text"
            className="w-[120px]"
            name="searchInput"
            id="searchInput"
            onChange={handleSearch}
          />
        </div>
        <PDFDownload
          Products={data}
          selectedProperties={[
            "productName",
            "parentTitle",
            "type",
            "madeIn"
          ]}
          propertyDisplayNames={{
            productName: "Name",
            parentTitle: "Category",
            type: "Type",
            madeIn: "Made In"
          }}
          fileName="Stock Balance"
        />
      </div>
      <div className="overflow-x-auto mt-5">
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Type</th>
              <th>Made In</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.parentTitle}</td>
                <td>{product.type}</td>
                <td>{product.madeIn}</td>
                <td className="flex items-center justify-center">
                  <img 
                    className=" rounded-full h-[40px] w-[40px] " 
                    src={`${import.meta.env.VITE_URL}/images/${product.productImage}`} 
                    alt={`Image for ${product.productName}`} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
