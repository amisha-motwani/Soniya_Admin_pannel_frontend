import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { CAlert, CButton, CContainer } from "@coreui/react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import BASE_URL from "../../API/Api";

function View() {
  const secretKey = sessionStorage.getItem("secreteKey");
  const key = localStorage.getItem("secretKey");
  console.log("leyy", secretKey);

  const [selectedValue, setSelectedValue] = useState("TShirt");
  const [searchedProductCode, setSearchedProductCode] = useState("");

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  //-----------------View data logic-----------------

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const headers = {
        "Secret-Key": secretKey,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${BASE_URL}/api/notes/fetchallSearched/Product?category=${selectedValue}&Product_code=${searchedProductCode}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("data==>", data);

  const handleEdit = (data) => {
    console.log("data of edit", data);
    navigate(`/Edit/${selectedValue}`, { replace: true, state: { data } });
  };

  const handleDelete = async (_id) => {
    try {
      const headers = {
        "Secret-Key": secretKey,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${BASE_URL}/api/notes/delete/Product/${_id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      await response.json();
      toast.success("Successfully Deleted");

      // Update data state after deletion
      const updatedData = data.filter((item) => item._id !== _id);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedValue, searchedProductCode]);

  if (loading) {
    return (
      <div
        className="flex justify-center items-center w-[100%] h-[100vh]"
        style={{ overflowY: "hidden !important" }}
      >
        <Spinner
          animation="border"
          role="status"
          className="my-auto mx-auto text-gray-400"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
      <div fluid className="md:flex block mb-2 justify-between w-[92%] mx-auto">
        <div className="md:w-[50%] w-[85%] md:my-1 my-2">
          <Form.Select
            aria-label="Default select example"
            onChange={handleSelectChange}
            style={{ width: "100%" }}
          >
            <option value="TShirt">View T-Shirt data</option>
            <option value="Sportswear">View Sportswear data</option>
            <option value="Promotional">View Promotional Clothing data</option>
            <option value="Corporatewear">View Corporatewear data</option>
            <option value="Uniform">View School Uniform data</option>
            <option value="Accessories">View Accessories data</option>
            <option value="Eventwear">View Eventwear data</option>

          </Form.Select>
        </div>
        <div className="md:w-[35%] w-[85%] md:my-1 my-2">
          <input
            type="text"
            placeholder="Search product code"
            className="w-full border-2 rounded-full px-3 py-[7px]"
            value={searchedProductCode}
            onChange={(e) => setSearchedProductCode(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-evenly h-[500px]">
        {data.map((data, index) => (
          <div
            key={index}
            className="w-[270px] h-[fit-content] pb-2 border-1 border-gray-400 mb-3 rounded-xl"
          >
            {/* <img
              src={data.image.split(", ")[0]}
              alt={`${data?.title} image`}
              className="h-[260px] w-[300px] mx-auto rounded-t-xl mb-2"
            /> */}
            <img
              // src={`${BASE_URL}/${data?.image}`}
              src={`${BASE_URL}/${data.image.split(", ")[0]}`}
              alt={data?.title}
              className="h-[260px] w-[300px] mx-auto rounded-t-xl"
            />

            <h5 className="text-center text-gray-600 text-[16px] my-3 h-[41px] overflow-hidden line-clamp-2">
              {data?.title}
            </h5>

            <div className="flex justify-end pe-3 gap-3">
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={() => handleEdit(data)}
                className="text-red-600 text-[19px] cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(data?._id)}
                className="text-red-600 text-[19px] cursor-pointer"
              />
            </div>
          </div>
        ))}

        {/* {data.map((data, index) => (
          <div
            key={index}
            className="w-[270px] h-[fit-content] pb-2 border-1 border-gray-400 mb-3 rounded-xl"
          >
            <img
              // src={`${BASE_URL}/${data?.image}`}
              src={`${BASE_URL}/${data.image.split(", ")[0]}`}
              alt={data?.title}
              className="h-[260px] w-[300px] mx-auto rounded-t-xl"
            />
            <h5 className="text-center text-gray-600 text-[16px] my-3 h-[41px] overflow-hidden line-clamp-2">
              {data?.title}
            </h5>
            <div className="flex justify-end pe-3 gap-3">
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={() => handleEdit(data)}
                className="text-red-600 text-[19px] cursor-pointer"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => handleDelete(data?._id)}
                className="text-red-600 text-[19px] cursor-pointer"
              />
            </div>
          </div>
        ))} */}
      </div>
    </>
  );
}

export default View;
