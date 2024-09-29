import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import { formSchema } from "../Schema/index.js";
import { CAlert, CButton, CContainer } from "@coreui/react";
import { SketchPicker } from "react-color";
import colorWheel from "../../colorWheel.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "src/API/Api.js";
import { CTooltip } from "@coreui/react";
import { CSpinner } from "@coreui/react";
// import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";

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
    24: false,
    26: false,
    28: false,
    30: false,
    32: false,
    34: false,
    36: false,
    38: false,
    40: false,
    42: false,
    44: false,
    46: false,
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
  const [images, setImages] = useState([]);
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

      // Prepare an array to store image names
      const imageNames = [];

      // Iterate over images array
      images.forEach((image, index) => {
        // Construct image name in the format: lastModified + name
        const imageName = `${image.lastModified}${image.name}`;
        // Append image to formData with consistent key "image"
        formData.append(`image`, image, imageName); // Use "image" as the key
        // Push the constructed imageName to imageNames array
        imageNames.push(imageName);
      });

      // Join image names with comma "," to form a single string
      const joinedImageNames = imageNames.join(" , ");

      // Append the joined image names as a single string to formData
      formData.append("image", joinedImageNames);
      formData.append("category", selectedValue);
      formData.append("title", values.name);
      formData.append("description", values.description);
      formData.append("fabric", values.fabric);
      formData.append("price", values.price);
      formData.append("sleeves_type", sleeveType);
      formData.append("printing_area", printingArea);
      formData.append("printing_charges", printingCharges);
      formData.append("Product_code", ProductCode);

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
          `${BASE_URL}/api/notes/add/Product`,
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
            24: false,
            26: false,
            28: false,
            30: false,
            32: false,
            34: false,
            36: false,
            38: false,
            40: false,
            42: false,
            44: false,
            46: false,
            48: false,
          });
        } else if (Response.status === 404) {
          console.log("404 console", Response);
        } else if (Response.status === 500) {
          console.log("500 console");
        }
      } catch (error) {
        console.log("this is error", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Append new files to the existing images array
    setImages([...images, ...files]);
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

  // const deleteColor = () => {
  //   const updatedColors = values.colors.filter(
  //     (color) => color !== selectedColor
  //   );
  //   setFieldValue("colors", updatedColors);
  //   setDeleteColorCard(false);
  // };


  const handleDeleteColor = (index) => {
   // Log the index and current colors for debugging
  console.log("Deleting color at index:", index);
  console.log("Current colors:", values.colors);

  // Filter out the color at the clicked index
  const updatedColors = values.colors.filter((_, i) => i !== index);

  // Log the updated colors array for debugging
  console.log("Updated colors after deletion:", updatedColors);

  // Update the Formik field value with the new colors array
  setFieldValue("colors", updatedColors);
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

  // const handleDeleteImage = (index) => {
  //   // Filter out the image at the clicked index
  //   const newImages = images.filter((_, i) => i !== index);
  //   setImages(newImages);
  // };
  const handleDeleteImage = (index) => {
    // Log the index and current images for debugging
    console.log("Deleting image at index:", index);
    console.log("Current images:", images);

    // Filter out the image at the clicked index
    const newImages = images.filter((_, i) => i !== index);

    // Log the new images array for debugging
    console.log("New images after deletion:", newImages);

    // Update the state with the new images array
    setImages(newImages);
  };
  console.log("Images-->", images);

  return (
    <>
      <CContainer fluid className="flex justify-center mx-auto mb-4 ">
        <div className="md:w-[80%] w-[85%]">
          <Form.Select
            aria-label="Default select example"
            onChange={handleSelectChange}
            style={{ width: "100%" }}
          >
           
            <option value="Shirt">Add Shirt</option>
            <option value="Sportswear">Add Sportswear</option>
            <option value="Promotional">Add Promotional Clothing</option>
            <option value="Corporatewear">Add Corporatewear</option>
            <option value="Uniform">Add School Uniform</option>
            <option value="Accessories">Add Accessories</option>
          </Form.Select>
        </div>
      </CContainer>
      
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
              <h1 className="sm:text-[22px] text-[17px] py-3 px-auto border-b-[1px] border-sky-200 text-center">
                <b>Add {selectedValue} data</b>
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
                    {/* <input
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] border py-2 px-3 description_input"
                      placeholder="Enter the description"
                    /> */}
                    <textarea
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] border py-2 px-3"
                      placeholder="Enter the description"
                      rows="3"
                    />

                    {errors.description && touched.description ? (
                      <p className="text-red-700 ms-2">{errors.description}</p>
                    ) : null}
                  </div>
                </div>

                <div className="w-[90%] mx-auto md:text-[17px] mb-3 mt-4 pt-3">
                  <div className="mb-2 ">

                    <Form.Label className="mx-2">Upload Images</Form.Label>
                    <input
                      type="file"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      required
                    />
                    {errors.file && touched.file ? (
                      <p className="text-red-700 ms-2">{errors.file}</p>
                    ) : null}
                  </div>
                </div>
                <div>
                  {images.length > 0 && (
                    <div>
                      {/* <h5>Added Images:</h5> */}
                      <div className="d-flex flex-wrap w-[90%] mx-auto">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="relative group m-2 border-1 border-dark"
                          >
                          <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="text-[20px] absolute ms-[90%] mt-[-9%] z-[10] text-red-500 cursor-pointer hover:text-red-600"
                              onClick={() => handleDeleteImage(index)}
                            />
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Image ${index}`}
                              className="max-w-[100px] max-h-[100px] relative mr-2 rounded-md mx-auto my-auto"

                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                      {openColorCard ? (
                        <div className="absolute ms-[3%] lg:mt-[-20%] mt-[-22%] z-30 w-[260px]">
                          <SketchPicker
                            color={selectedColor}
                            onChange={handleColorChange}
                            onClose={handleCloseColor}
                          />
                          <button
                            className="bg-green-500 px-2  w-[85%] text-white"
                            onClick={addColor}
                          >
                            ADD
                          </button>
                        </div>
                      ) : null}

                      {values.colors.map((color, index) => (
                        <>
                          <div className="block">
                            <div className="relative group">
                              <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="text-[20px] absolute ms-[38px] z-1 mt-[-10px] text-red-500 cursor-pointer hover:text-red-600 "
                                onClick={() => handleDeleteColor(index)}
                              />

                              <div
                                key={index}
                                className="relative w-[30px] h-[30px] ms-[15px] my-1 rounded-md"
                                style={{ backgroundColor: color }}
                                // onClick={() => handleDeleteCard(color)}

                              ></div>
                            </div>
                          </div>
                        </>
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
                <div className="w-[90%] mx-auto md:text-[17px] border-1 my-3">
                  <div className="w-[100%] flex justify-start">
                    <label className="md:my-auto text-start my-3">
                      Procode code :
                    </label>
                  </div>
                  <div className="w-[100%] justify-start">
                    <input
                      type="name"
                      autoComplete="off"
                      name="name"
                      value={values.ProductCode}
                      onChange={handleChange}
                      className="w-[100%] rounded-[10px] py-2 px-3 h-[auto]"
                      placeholder="Enter the name product"
                    />
                    {errors.ProductCode && touched.ProductCode ? (
                      <p className="text-red-700 ms-2">{errors.ProductCode}</p>
                    ) : null}
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
