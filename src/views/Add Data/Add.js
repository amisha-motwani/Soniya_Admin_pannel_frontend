import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { formSchema } from "../Schema/index.js";
import { CAlert, CButton, CContainer } from "@coreui/react";
import { SketchPicker } from "react-color";
import colorWheel from "../../colorWheel.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "src/API/Api.js";
import {CSpinner,} from "@coreui/react";


const initialValues = {
  name: "",
  color: "",
  price: "",
  description: "",
  file: "",
  fabric: "",
  colors: [],
  Polo_collar: false,
  Round_neck: false,
  Cloth_collar: false,
  Readymade_collar: false,
  checkedSizes: {
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
  },
  checkedCollarTypes: {
    Polo_collar: false,
    Round_neck: false,
    Cloth_collar: false,
    Readymade_collar: false,
  },
};

function PostData() {
  const [selectedValue, setSelectedValue] = useState("Teamwear");
  const [sleeveType, setSleeveType] = useState("");
  const [printingArea, setPrintingArea] = useState("");
  const [printingCharges, setPrintingCharges] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
  };

  // ----------------Add logic ---------------------------
  const secretKey = sessionStorage.getItem("secreteKey");
  const key = localStorage.getItem("secretKey");
  console.log("leyy", secretKey);

  const [image, setImage] = useState(null);
  const [apiResponse, setApiResponse] = useState();
  const [openColorCard, setOpenColorCard] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [confirmColor, setConfirmColor] = useState(false);
  const [deleteColorCard, setDeleteColorCard] = useState(false);

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,

    onSubmit: async (values) => {
      setLoading(true); 
      console.log("submit is clicked");
      console.log("value-->", values);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", values.name);
      formData.append("description", values.description);
      formData.append("fabric", values.fabric);
      formData.append("price", values.price);
      formData.append("sleeves_type", sleeveType);
      formData.append("printing_area", printingArea);
      formData.append("printing_charges", printingCharges);

      const selectedSizes = Object.keys(values.checkedSizes).filter(
        (size) => values.checkedSizes[size]
      );
      console.log("Selected Sizes:", selectedSizes);

      formData.append("size", selectedSizes.join(", "));

      Object.keys(values.checkedCollarTypes).forEach((collarType) => {
        formData.append(
          collarType,
          values.checkedCollarTypes[collarType] ? "true" : "false"
        );
      });

      formData.append("color", values.colors.join(","));

      try {
        const requestOptions = {
          method: "POST",
          headers: {
            "Secret-Key": secretKey,
            // "Content-Type": "application/json",
          },
          body: formData,
        };

        const Response = await fetch(
          `${BASE_URL}/api/notes/add/${selectedValue}`,
          requestOptions
        );

        if (Response.status === 400) {
          const resp = await Response.json();
          toast.error(resp.errors[0].msg);
        } else if (Response.status === 401) {
          const resp = await Response.json();
          console.log("error", resp.error);
          toast.error(resp.error);
        } else if (Response.status === 500) {
          const resp = await Response.text();
          toast.error(resp);
        } else if (Response.ok) {
          const data = await Response.json();
          setApiResponse(data);
          toast.success("Successfully Posted");
          resetForm();
          setFieldValue("colors", []);
          setImage(null);

          setFieldValue("sleeves_type", "");
          setFieldValue("checkedCollarTypes", {
            Polo_collar: false,
            Round_neck: false,
            Cloth_collar: false,
            Readymade_collar: false,
          });

          setFieldValue("checkedSizes", {
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
        } else if (Response.status === 404) {
          console.log("404 console", Response);
        } else if (Response.status === 500) {
          console.log("500 console");
        }
      } catch (error) {
        console.log("this is error", error);
      }finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCheckChange = (size) => {
    setFieldValue("checkedSizes", {
      ...values.checkedSizes,
      [size]: values.checkedSizes[size] === 1 ? 0 : 1,
    });
  };

  const handleColorChange = (newColor) => {
    setSelectedColor(newColor.hex);
    setConfirmColor(true);
  };

  const addColor = () => {
    const updatedColors = [...values.colors, selectedColor];
    setFieldValue("colors", updatedColors);
    setConfirmColor(false);
    setOpenColorCard(false);
  };

  const removeColor = () => {
    setConfirmColor(false);
    setOpenColorCard(false);
  };

  const handleCheckSizeChange = (size) => {
    setFieldValue("checkedSizes", {
      ...values.checkedSizes,
      [size]: !values.checkedSizes[size], // Toggle the checkbox value
    });
  };

  const handleCheckCollarChange = (collarType) => {
    setFieldValue("checkedCollarTypes", {
      ...values.checkedCollarTypes,
      [collarType]: !values.checkedCollarTypes[collarType], // Toggle the checkbox value
    });
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
    const updatedColors = values.colors.filter(
      (color) => color !== selectedColor
    );
    setFieldValue("colors", updatedColors);
    setDeleteColorCard(false);
  };

  const keepIt = () => {
    setDeleteColorCard(false);
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

  return (
    <>
      <div className="w-[100%] flex justify-center mx-auto mb-4 ">
        <Form.Select
          aria-label="Default select example"
          onChange={handleSelectChange}
          style={{ width: "27%" }}
        >
          {/* <option>Open this select menu</option> */}
          <option value="Teamwear">Add Teamwear</option>
          <option value="Fitnesswear">Add Fitnesswear</option>
          <option value="Sportswear">Add Sportswear</option>
          <option value="Corporatewear">Add Corporatewear</option>
        </Form.Select>
      </div>

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
              className="lg:w-[80%] md:w-[90%] w-[97%] mx-auto h-[fit-content] my-auto bg-[#deebf5] rounded-[13px] shadow-2xl text-black "
            >
              <h1 className="md:text-[20px] py-3 px-auto border-b-[1px] border-sky-200 text-center">
                <b>Add {selectedValue} data :</b>
              </h1>
              <div className="w-[100%] h-[fit-content] pt-4 text-black">
                <div className="w-[90%] mx-auto md:text-[17px] border-1 my-3">
                  <div className="w-[100%] flex justify-start">
                    <label className="md:my-auto text-start my-3">
                      Name of the product :
                    </label>
                  </div>
                  <div className="w-[100%] justify-start">
                    <input
                      type="name"
                      autoComplete="off"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] py-2 px-3 h-[auto]"
                      placeholder="Enter the name product"
                    />
                    {errors.name && touched.name ? (
                      <p className="text-red-700 ms-2">{errors.name}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-[90%] mx-auto md:text-[17px] my-3">
                  <div className="w-[100%] flex  justify-start">
                    <label className="md:my-auto text-start my-3">
                      Description :
                    </label>
                  </div>
                  <div className=" w-[100%] justify-start ">
                    <input
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the description"
                    />
                    {errors.description && touched.description ? (
                      <p className="text-red-700 ms-2">{errors.description}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-[90%] mx-auto md:text-[17px] my-3">
                  <div className="w-[100%] flex justify-start my-3">
                    <label className="my-auto md:text-end text-start">
                      Image of the product :
                    </label>
                  </div>
                  <div className="w-[100%] justify-start">
                    <input
                      className=""
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="w-[90%] mx-auto md:text-[17px] my-3">
                  <div className=" w-[100%] flex justify-start">
                    <label className="text-start my-3">Select colors :</label>
                  </div>
                  <div className="w-[100%] justify-start flex flex-wrap items-center gap-2 ps-2">
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
                        <CAlert>
                          <div className="absolute ms-[250px] md:mt-[-100px] mt-[-180px] z-30 w-[260px] px-2 py-3 bg-slate-400 text-white rounded-lg">
                            <div className="">
                              Do you want to add this color?
                            </div>
                            <div
                              className="h-[20px] w-[70%] m-auto my-1"
                              style={{ backgroundColor: selectedColor }}
                            ></div>
                            <div className="flex gap-3 justify-center mt-2">
                              <button
                                className="bg-green-500 px-2 rounded-lg"
                                onClick={addColor}
                              >
                                Yes
                              </button>
                              <button
                                className="bg-red-500 px-2 rounded-lg"
                                onClick={removeColor}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        </CAlert>
                      ) : null}

                      {openColorCard ? (
                        <div className="absolute ms-[3%] lg:mt-[-20%]  mt-[-22%] z-30 w-[260px]">
                          <SketchPicker
                            color={selectedColor}
                            onChange={handleColorChange}
                            onClose={handleCloseColor}
                          />
                        </div>
                      ) : null}
                      {deleteColorCard ? (
                        <CAlert>
                          <div className="absolute ms-[-60px] lg:mt-[-190px] mt-[-220px] z-30 w-[260px] px-2 py-3 bg-slate-400 text-white rounded-lg">
                            <div className="text-center my-2">
                              Do you want to delete this color?
                            </div>
                            <div
                              className="h-[20px] w-[70%] m-auto my-1"
                              style={{ backgroundColor: selectedColor }}
                            ></div>
                            <div className="flex gap-3 justify-center mt-2">
                              <button
                                className="bg-green-500 px-2 rounded-lg"
                                onClick={deleteColor}
                              >
                                Yes
                              </button>
                              <button
                                className="bg-red-500 px-2 rounded-lg"
                                onClick={keepIt}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        </CAlert>
                      ) : null}
                      {values.colors.map((color, index) => (
                        <div
                          key={index}
                          className="relative w-[30px] h-[30px]"
                          style={{ backgroundColor: color }}
                          onClick={() => handleDeleteCard(color)}
                        ></div>
                      ))}
                    </div>
                    {errors.colors && touched.colors ? (
                      <p className="text-red-700 ms-2">{errors.colors}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-[90%] mx-auto md:text-[17px]">
                  <div className=" w-[100%] flex justify-start">
                    <label className=" my-3">Fabric :</label>
                  </div>
                  <div className="w-[100%] justify-start">
                    <input
                      name="fabric"
                      value={values.fabric}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the fabric"
                    />
                    {errors.fabric && touched.fabric ? (
                      <p className="text-red-700 ms-2">{errors.fabric}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-[90%] mx-auto md:text-[17px] my-3">
                  <div className="w-[100%] flex justify-start">
                    <label className=" text-start my-3">Sizes :</label>
                  </div>
                  <div className="w-[100%] flex flex-wrap gap-3 justify-start md:ps-2">
                    {Object.keys(values.checkedSizes).map((size) => (
                      <div key={size} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`size-${size}`}
                          name={size}
                          checked={values.checkedSizes[size]}
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

                <div className="w-[90%] mx-auto md:text-[17px] my-3">
                  <div className="w-[100%] flex  justify-start">
                    <label className="text-start my-3">Collar Types :</label>
                  </div>
                  <div className="w-[100%] flex flex-wrap gap-3 justify-start md:ps-2">
                    {Object.keys(values.checkedCollarTypes).map((collar) => (
                      <div key={collar} className="flex items-center">
                        <input
                          type="checkbox"
                          id={collar}
                          name={collar}
                          checked={values.checkedCollarTypes[collar]}
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
                <div className="w-[90%] mx-auto md:text-[17px]">
                  <div className="w-[100%] flex justify-start">
                    <label className=" my-3  text-end">
                      Price of the product :
                    </label>
                  </div>
                  <div className="w-[100%] justify-start">
                    <input
                      name="price"
                      value={values.price}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the price"
                    />
                    {errors.price && touched.price ? (
                      <p className="text-red-700 ms-2">{errors.price}</p>
                    ) : null}
                  </div>
                </div>
                <div className="w-[95%] mx-auto md:text-[17px] my-3">
                  <div className="sleeve-selection w-[95%] mx-auto my-3">
                    <Form.Label>Choose Sleeve type</Form.Label>
                  </div>
                  <div className="sleeve-options w-[95%] mx-auto flex flex-wrap gap-4">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={handleSleeveChange}
                      onBlur={handleBlur}
                    >
                      <option>Select Sleeves</option>
                      <option value="Full Sleeves">Full Sleeves</option>
                      <option value="Half Sleeves">Half Sleeves</option>
                    </Form.Select>
                  </div>
                </div>

                <div className="w-[95%] mx-auto md:text-[17px] my-3">
                  <div className="sleeve-selection w-[95%] mx-auto my-3">
                    <Form.Label>Choose printing area</Form.Label>
                  </div>
                  <div className="sleeve-options w-[95%] mx-auto flex flex-wrap gap-4">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={handlePrintingArea}
                      onBlur={handleBlur}
                    >
                      <option>Select area</option>
                      <option value="Front">Front</option>
                      <option value="Back">Back</option>
                    </Form.Select>
                  </div>
                </div>

                <div className="w-[95%] mx-auto md:text-[17px] my-3">
                  <div className="sleeve-selection w-[95%] mx-auto my-3">
                    <Form.Label>Printing Charges?</Form.Label>
                  </div>
                  <div className="sleeve-options w-[95%] mx-auto flex flex-wrap gap-4">
                    <Form.Select
                      aria-label="Default select example"
                      onChange={handlePrintingCharges}
                      onBlur={handleBlur}
                    >
                      <option>Select charges</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Form.Select>
                  </div>
                </div>
              </div>
              <div className="flex w-[90%] justify-center py-4">
                <div className="w-[90%] mx-auto md:text-[17px] mt-4 pb-4">
                  <div className="w-[100%] flex justify-center">
                    <CButton type="submit" color="primary">
                      Submit
                    </CButton>
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

export default PostData;
