import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { CAlert, CContainer } from "@coreui/react";
import { SketchPicker } from "react-color";
import colorWheel from "../../colorWheel.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import BASE_URL from "src/API/Api";
import Form from "react-bootstrap/Form";
import {CSpinner,} from "@coreui/react";

const initialValues = {
  name: "",
  color: "",
  price: "₹",
  description: "",
  file: "",
};
const sizeMapping = {
  22: "twenty_two",
  23: "twenty_three",
  24: "twenty_four",
  25: "twenty_five",
  26: "twenty_six",
  27: "twenty_seven",
  28: "twenty_eight",
  29: "twenty_nine",
  30: "thirty",
  31: "thirty_one",
  32: "thirty_two",
  33: "thirty_three",
  34: "thirty_four",
  35: "thirty_five",
  36: "thirty_six",
  37: "thirty_seven",
  38: "thirty_eight",
  39: "thirty_nine",
  40: "forty",
  41: "forty_one",
  42: "forty_two",
  43: "forty_three",
  44: "forty_four",
  45: "forty_five",
  46: "forty_six",
  47: "forty_seven",
  48: "forty_eight",
};

function EditPost() {
  const [loading, setLoading] = useState(false);
  const secretKey = sessionStorage.getItem("secreteKey");
  const location = useLocation();
  const { data } = location.state;
  console.log("teamData:==>", data);
  console.log("colorData:==>", data.color);
  const colorData = data.color;
  const colorArray = colorData.split(",");
  const { value } = useParams();
  console.log("value==>", value);

  console.log(colorArray, "<==Done"); // Output: ['#e90c0c', '#8b572a']

  // Function to filter fields with value true
  const filterFieldsWithValueTrue = (data) => {
    const filteredFields = {};

    // List of fields to check
    const fieldsToCheck = [
      "Polo_collar",
      "Round_neck",
      "Cloth_collar",
      "Readymade_collar",
      "printing_charges",
    ];

    // Iterate through each field
    fieldsToCheck.forEach((field) => {
      if (data.hasOwnProperty(field) && data[field] === true) {
        filteredFields[field] = true;
      }
    });

    return filteredFields;
  };
  // Get filtered fields with value true
  const filteredFields = filterFieldsWithValueTrue(data);

  // Extract keys, join by comma, replace "_" with " ", and convert to string
  const selectedCollars = Object.keys(filteredFields)
    .join(", ")
    .replace(/_/g, " ");
  console.log("Selected collars:", selectedCollars);

  const [name, setName] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const [fabric, setFabric] = useState(data.fabric);
  const [price, setPrice] = useState(data.price);
  const [file, setFile] = useState(null);
  const [colors, setColors] = useState(colorArray);
  const [sleeveType, setSleeveType] = useState(data.sleeves_type);
  const [printingArea, setPrintingArea] = useState(data.printing_area);
  const [printingCharges, setPrintingCharges] = useState(data.printing_charges);

  const [checkedSizes, setCheckedSizes] = useState({
    22: false,
    23: false,
    24: false,
    25: false,
    26: false,
    27: false,
    28: false,
    29: false,
    30: false,
    31: false,
    32: false,
    33: false,
    34: false,
    35: false,
    36: false,
    37: false,
    38: false,
    39: false,
    40: false,
    41: false,
    42: false,
    43: false,
    44: false,
    45: false,
    46: false,
    47: false,
    48: false,
  });
  const [image, setImage] = useState(null);
  const [apiResponse, setApiResponse] = useState();
  const [editSizes, setEditSizes] = useState(false);
  const [editColors, setEditColors] = useState(false);
  const [openColorCard, setOpenColorCard] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [confirmColor, setConfirmColor] = useState(false);
  const [deleteColorCard, setDeleteColorCard] = useState(false);
  const [editPrintingCharges, setEditPrintingCharges] = useState(false);
  const [editSleeves, setEditSleeves] = useState(false);
  const [editPrintingArea, setEditPrintingArea] = useState(false);
  const [editCollar, setEditCollar] = useState(false);

  // States for collar
  const [collarTypes, setCollarTypes] = useState({
    Polo_collar: false,
    Round_neck: false,
    Cloth_collar: false,
    Readymade_collar: false,
  });

  const handleSubmit = async (e) => {
    setLoading(true);
    console.log("login is clicked");
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", name);
    formData.append("fabric", fabric);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("color", colors.join(","));
    formData.append("sleeves_type", sleeveType);
    formData.append("printing_area", printingArea);
    formData.append("printing_charges", printingCharges);

    const selectedSizes = Object.keys(checkedSizes).filter(
      (size) => checkedSizes[size]
    );
    console.log("Selected Sizes:", selectedSizes);
    formData.append("size", selectedSizes.join(", "));

    Object.keys(collarTypes).forEach((collarType) => {
      formData.append(collarType, collarTypes[collarType] ? "true" : "false");
    });

    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Secret-Key": secretKey,
        },
        body: formData,
      };

      const response = await fetch(
        `${BASE_URL}/api/notes/update/${value}/${data._id}`,
        requestOptions
      );

      if (response.ok) {
        const responseData = await response.json();
        setApiResponse(responseData);
        toast.success("Successfully Updated");
        // Reset all states to initial values
        setName("");
        setDescription("");
        setPrice("");
        setFile("");
        setFabric("");
        setColors([]);
      } else if (response.status === 404) {
        console.log("404 console", response);
      } else if (response.status === 500) {
        console.log("500 console");
      }
    } catch (error) {
      console.log("this is error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  console.log("selected Image", image);

  const handleCheckSizeChange = (size) => {
    setCheckedSizes({
      ...checkedSizes,
      [size]: !checkedSizes[size],
    });
  };
  const handleCheckCollarChange = (collarType) => {
    setCollarTypes((prevState) => ({
      ...prevState,
      [collarType]: !prevState[collarType],
    }));
  };

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor.hex);
    setConfirmColor(true);
  };

  const addColor = () => {
    const addedColors = [...colors, selectedColor];
    setColors(addedColors);
    setConfirmColor(false);
    setOpenColorCard(false);
  };

  const removeColor = () => {
    setConfirmColor(false);
    setOpenColorCard(false);
  };

  const handleOpenColor = () => {
    setOpenColorCard(!openColorCard);
  };

  const handleCloseColor = () => {
    setOpenColorCard(false);
  };

  const handleDeleteCard = (color) => {
    setSelectedColor(color);
    setDeleteColorCard(true);
  };

  const deleteColor = () => {
    console.log("Current colors:", colors);
    console.log("Selected color to delete:", selectedColor);

    const updatedColors = colors.filter((color) => color !== selectedColor);

    setColors(updatedColors);

    console.log("Updated colors after deletion:", updatedColors);

    setDeleteColorCard(false);
  };

  const keepIt = () => {
    setDeleteColorCard(false);
  };

  const handleEditSizeClick = () => {
    setEditSizes(true);
  };

  const handleEditCollarType = () => {
    setEditCollar(true);
  };
  const handleEditSleevesType = () => {
    setEditSleeves(true);
  };
  const handleEditPrintingArea = () => {
    setEditPrintingArea(true);
  };
  const handleEditPrintingCharges = () => {
    setEditPrintingCharges(true);
  };
  const handleSleeveChange = (e) => {
    setSleeveType(e.target.value);
  };
  const handlePrintingArea = (e) => {
    setPrintingArea(e.target.value);
  };
  const handlePrintingCharges = (e) => {
    setPrintingCharges(e.target.value);
  };

  console.log("colors", colors);

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center items-center h-[100vh] w-[100%]">
            <CSpinner size="lg" className="my-auto mx-auto text-gray-400" />
          </div>
        </>
      ) : (
        <>
          <CContainer
            fluid
            className="flex justify-center items-center h-[80vh] w-[100%]"
          >
            <form
              onSubmit={handleSubmit}
              className="lg:w-[90%] md:w-[90%] w-[97%] mx-auto h-[fit-content] my-auto bg-[#deebf5] rounded-[13px] shadow-2xl text-black"
            >
              <h1 className="md:text-[20px] py-3 px-auto border-b-[1px] border-sky-200 text-center">
                <b>Edit Product</b>
              </h1>
              <div className="w-[100%] h-[fit-content] pt-4">
                <div className=" w-[90%] mx-auto md:text-[17px] mb-3">
                  <div className="w-[100%] flex  justify-start">
                    <label className="md:my-auto md:text-end text-start my-3">
                      Name of the product :
                    </label>
                  </div>
                  <div className=" w-[100%] justify-start md:ps-2">
                    <input
                      type="text"
                      autoComplete="off"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className=" w-[100%] rounded-[10px] py-2 px-3 h-[auto]"
                      placeholder="Enter the name product"
                    />
                  </div>
                </div>

                <div className=" w-[90%]  md:text-[17px] my-3 mx-auto">
                  <div className="  w-[100%] flex  justify-start">
                    <label className="md:my-auto my-3">Description :</label>
                  </div>
                  <div className=" w-[100%] justify-start md:ps-2">
                    <input
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className=" w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the description"
                    />
                  </div>
                </div>

                <div className=" w-[90%]  mx-auto md:text-[17px] my-3">
                  <div className=" w-[100%] flex  justify-start">
                    <label className="md:my-auto my-3">
                      Image of the product :
                    </label>
                  </div>
                  <div className="w-[100%] justify-start md:ps-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                {editSizes ? (
                  <>
                    <div className="w-[90%] mx-auto  md:text-[17px] my-3">
                      <div className=" w-[100%] flex  justify-start">
                        <label className="md:my-auto my-3">
                          Choose sizes :
                        </label>
                      </div>

                      <div className=" w-[100%] justify-start ps-2 gap-3 flex flex-wrap items-center ">
                        {Object.keys(checkedSizes).map((size) => (
                          <div
                            key={size}
                            className="form-check form-check-inline"
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`size-${size}`}
                              name={size}
                              checked={checkedSizes[size]}
                              onChange={() => handleCheckSizeChange(size)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`size-${size}`}
                            >
                              {size}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[90%] mx-auto  md:text-[17px] my-3">
                      <div className=" w-[100%] flex  justify-start">
                        <label className="md:my-auto">Available Sizes :</label>
                      </div>
                      <div className="w-[100%] justify-start ps-2 gap-3 flex items-center ">
                        {data.size}
                        <h1
                          className="text-blue-900 text-[17px] underline mt-2 ms-2 cursor-pointer"
                          onClick={handleEditSizeClick}
                        >
                          Edit?
                        </h1>
                      </div>
                    </div>
                  </>
                )}

                <div className=" w-[90%] mx-auto  md:text-[17px] my-3">
                  <div className="  w-[100%] flex  justify-start">
                    <label className="md:my-auto my-3">
                      Available colors :
                    </label>
                  </div>
                  <div className=" w-[100%] justify-start flex flex-wrap items-center gap-2 ps-2">
                    <div className="w-[30px]">
                      <img
                        className="w-[30px] cursor-pointer"
                        src={colorWheel}
                        alt="Color Wheel"
                        onClick={handleOpenColor}
                      />
                    </div>
                    <div className="flex gap-3 flex-wrap w-[90%]">
                      {confirmColor ? (
                        <>
                          <CAlert>
                            <div className="absolute ms-[250px] lg:mt-[-190px] mt-[-220px] z-30 w-[260px] px-2 py-3 bg-slate-400 text-white rounded-lg">
                              <div className="">
                                Do you want to add this color?
                              </div>
                              <div
                                className="w-[90%] h-[40px] mx-auto my-3"
                                style={{ background: selectedColor }}
                              ></div>
                              <div className="flex justify-between px-2 my-2">
                                <button
                                  onClick={addColor}
                                  className="w-[fit-content] h-[fit-content] rounded-full bg-green-500 px-2 py-1"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={removeColor}
                                  className="w-[fit-content] h-[fit-content] rounded-full bg-red-500 px-2 py-1"
                                >
                                  close
                                </button>
                              </div>
                            </div>
                          </CAlert>
                        </>
                      ) : (
                        <></>
                      )}
                      {deleteColorCard ? (
                        <>
                          <CAlert>
                            <div className="absolute ms-[-10px] mt-[-250px] z-30 w-[260px] px-2 py-3 bg-slate-400 text-white rounded-lg">
                              <div className="">
                                Do you want to remove this color?
                              </div>
                              <div className="flex justify-between px-2 my-2">
                                <button
                                  onClick={keepIt}
                                  className="w-[fit-content] h-[fit-content] rounded-full bg-green-500 px-2 py-1"
                                >
                                  Keep it
                                </button>
                                <button
                                  onClick={deleteColor}
                                  className="w-[fit-content] h-[fit-content] rounded-full bg-red-500 px-2 py-1"
                                >
                                  Delete it
                                </button>
                              </div>
                            </div>
                          </CAlert>
                        </>
                      ) : (
                        <></>
                      )}
                      {colors?.map((currentColor, index) => (
                        <div
                          key={index}
                          className="w-[30px] h-[30px] rounded-md"
                          style={{ backgroundColor: currentColor }}
                          onClick={() => handleDeleteCard(currentColor)}
                        ></div>
                      ))}
                      {openColorCard ? (
                        <>
                          <div className="absolute ms-[3%] lg:mt-[-20%] mt-[-22%] z-30 w-[260px]">
                            <div
                              className="w-5 h-5 rounded-full border-1 border-black flex justify-center items-center text-white bg-red-600 text-[12px] absolute  z-20"
                              onClick={handleCloseColor}
                            >
                              X
                            </div>
                            <SketchPicker
                              color={selectedColor}
                              onChangeComplete={handleColorChange}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>

                <div className=" w-[90%] mx-auto  md:text-[17px] my-3">
                  <div className="  w-[100%] flex  justify-start">
                    <label className="md:my-auto my-3">Fabric :</label>
                  </div>
                  <div className=" w-[100%] justify-start md:ps-2">
                    <input
                      name="fabric"
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className=" w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the fabric"
                    />
                  </div>
                </div>

                <div className=" w-[90%] mx-auto  md:text-[17px] my-3">
                  <div className="  w-[100%] flex  justify-start ">
                    <label className="md:my-auto my-3">Price :</label>
                  </div>
                  <div className=" w-[100%] justify-start md:ps-2">
                    <input
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className=" w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the price"
                    />
                  </div>
                </div>

                {editCollar ? (
                  <>
                    <div className="w-[90%] mx-auto md:text-[17px] my-3">
                      <div className="w-[100%] flex  justify-start">
                        <label className="text-start my-3">
                          Collar Types :
                        </label>
                      </div>
                      <div className="w-[100%] flex flex-wrap gap-3 justify-start md:ps-2">
                        {Object.keys(collarTypes).map((collar) => (
                          <div key={collar} className="flex items-center">
                            <input
                              type="checkbox"
                              id={collar}
                              name={collar}
                              checked={collarTypes[collar]}
                              onChange={() => handleCheckCollarChange(collar)}
                              className="rounded-[10px] border py-2 px-3"
                            />
                            <label htmlFor={collar} className="ms-2">
                              {collar.replace("_", " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[90%] mx-auto  md:text-[17px] my-3">
                      <div className=" w-[100%] flex  justify-start">
                        <label className="md:my-auto">Collar type :</label>
                      </div>
                      <div className="w-[100%] justify-start ps-2 gap-3 flex items-center ">
                        {selectedCollars}
                        <h1
                          className="text-blue-900 text-[17px] underline mt-2 ms-2 cursor-pointer"
                          onClick={handleEditCollarType}
                        >
                          Edit?
                        </h1>
                      </div>
                    </div>
                  </>
                )}

                {editSleeves ? (
                  <>
                    <div className="w-[90%] mx-auto md:text-[17px] my-3">
                      <div className="sleeve-selection w-[100%] mx-auto my-3">
                        <Form.Label>Choose Sleeve type</Form.Label>
                      </div>
                      <div className="sleeve-options w-[100%] mx-auto flex flex-wrap gap-2">
                        <Form.Select
                          aria-label="Default select example"
                          onChange={handleSleeveChange}
                        >
                          <option>Select Sleeves</option>
                          <option value="Full Sleeves">Full Sleeves</option>
                          <option value="Half Sleeves">Half Sleeves</option>
                        </Form.Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[90%] mx-auto md:text-[17px] my-3">
                      <div className=" w-[100%] flex  justify-start">
                        <label className="md:my-auto">Sleeves type :</label>
                      </div>
                      <div className="w-[100%] justify-start ps-2 gap-3 flex items-center ">
                        {data.sleeves_type}
                        <h1
                          className="text-blue-900 text-[17px] underline mt-2 ms-2 cursor-pointer"
                          onClick={handleEditSleevesType}
                        >
                          Edit?
                        </h1>
                      </div>
                    </div>
                  </>
                )}
                {editPrintingCharges ? (
                  <>
                    <div className="w-[90%] mx-auto md:text-[17px] my-3">
                      <div className="sleeve-selection w-[100%] mx-auto my-3">
                        <Form.Label>Printing Charges?</Form.Label>
                      </div>
                      <div className="sleeve-options w-[100%] mx-auto flex flex-wrap gap-2">
                        <Form.Select
                          aria-label="Default select example"
                          onChange={handlePrintingCharges}
                        >
                          <option>Select charges</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Form.Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[90%] mx-auto  md:text-[17px] my-3">
                      <div className=" w-[100%] flex  justify-start">
                        <label className="md:my-auto">Printing charges :</label>
                      </div>
                      <div className="w-[100%] justify-start ps-2 gap-3 flex items-center ">
                        {data.printing_charges}
                        <h1
                          className="text-blue-900 text-[17px] underline mt-2 ms-2 cursor-pointer"
                          onClick={handleEditPrintingCharges}
                        >
                          Edit?
                        </h1>
                      </div>
                    </div>
                  </>
                )}
                {editPrintingArea ? (
                  <>
                    <div className="w-[90%] mx-auto md:text-[17px] my-3">
                      <div className="sleeve-selection w-[100%] mx-auto my-3">
                        <Form.Label>Choose printing area</Form.Label>
                      </div>
                      <div className="sleeve-options w-[100%] mx-auto flex flex-wrap gap-2">
                        <Form.Select
                          aria-label="Default select example"
                          onChange={handlePrintingArea}
                        >
                          <option>Select area</option>
                          <option value="Front">Front</option>
                          <option value="Back">Back</option>
                        </Form.Select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[90%] mx-auto  md:text-[17px] my-3">
                      <div className=" w-[100%] flex  justify-start">
                        <label className="md:my-auto">Printing area :</label>
                      </div>
                      <div className="w-[100%] justify-start ps-2 gap-3 flex items-center ">
                        {data.printing_area}
                        <h1
                          className="text-blue-900 text-[17px] underline mt-2 ms-2 cursor-pointer"
                          onClick={handleEditPrintingArea}
                        >
                          Edit?
                        </h1>
                      </div>
                    </div>
                  </>
                )}
                <div className="w-[100%] flex my-5">
                  <div className="w-[30%]"></div>
                  <div className="w-[70%] justify-start ps-2">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="md:text-[18px] mx-[15%] text-[12px] py-2 px-4 rounded bg-sky-600 hover:bg-sky-900 text-white shadow-lg w-[fit-content] "
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CContainer>
        </>
      )}
    </>
  );
}

export default EditPost;
