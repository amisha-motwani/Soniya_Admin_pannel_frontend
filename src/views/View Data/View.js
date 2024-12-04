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
import Form from "react-bootstrap/Form";


function View() {
  const secretKey = sessionStorage.getItem("secreteKey");
  const key = localStorage.getItem("secretKey");
  console.log("leyy", secretKey);

  const [selectedValue, setSelectedValue] = useState("TShirt");
  const [searchedProductCode, setSearchedProductCode] = useState("");


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

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
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
        <Spinnery
          animation="border"
          role="status"
          className="my-auto mx-auto text-gray-400"
        >
          <span className="sr-only">Loading...</span>
        </Spinnery>
      </div>
    );
  }

  return (
    <>
      <div fluid className="md:flex block mb-2 justify-between w-[92%] mx-auto">
      <div className="md:w-[70%] w-[85%]">
          <Form.Select
            aria-label="Default select example"
            onChange={handleSelectChange}
            style={{ width: "100%" }}
          >
            <option value="TShirt">Add T-Shirt </option>
            <option value="WorkTShirt">Add Work T-Shirt </option>
            <option value="PoloTShirt">Add Polo T-Shirt </option>
            <option value="PromotionalTShirt">Add Promotional T-Shirt </option>
            <option value="RunningTShirt">Add Running T-Shirt </option>
            <option value="SandowsTShirt">Add Sandows T-Shirt </option>
            <option value="KabbadiShirt">Add Kabbadi T-Shirt </option>

            <option value="Hoodies">Add Hoodies</option>
            <option value="Tracksuits">Add Tracksuits</option>
            <option value="Sweatshirts">Add Sweatshirts</option>
            <option value="Jackets">Add Jackets</option>
            <option value="Bottoms">Add Bottoms</option>
            <option value="Uniform">Add School Uniform</option>
            <option value="Jersey">Add Jersey</option>
            <option value="CricketKit">Add Cricket Kit</option>
            <option value="Accessories">Add Accessories</option>
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
            <img
              src={data.image.split(", ")[0]}
              alt={`${data?.title} image`}
              className="h-[260px] w-[300px] mx-auto rounded-t-xl mb-2"
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
      </div>
    </>
  );
}

export default View;
