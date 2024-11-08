import React, { useState, useEffect, useRef } from "react";
import { Form, Modal, Button } from "react-bootstrap";
import Draggable from "react-draggable";
import Moveable from "react-moveable";
import { Resizable } from "react-resizable";
import RoundF from "../../Images/Pattern/RoundF.png";
import HighF from "../../Images/Pattern/HighF.png";
import CollarF from "../../Images/Pattern/CollarF.png";
import { Rnd } from "react-rnd";
import { saveAs } from "file-saver";
// Add other image imports as needed

function DesignYourOwn() {
  const [selectedImage, setSelectedImage] = useState(RoundF); // Initial image
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCollar, setSelectedCollar] = useState("");
  const [selectedSleeves, setSelectedSleeves] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [addedText, setAddedText] = useState("");
  const [textSize, setTextSize] = useState(18);
  const [isBold, setIsBold] = useState(false); // State for bold
  const [isItalic, setIsItalic] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  // --- drag & drop code ------
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const shouldShowStyle = isHovered || isDragging || isResizing;
  const [logo, setLogo] = useState(null);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
  const canvasRef = useRef(null);

  const mattyColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Navy Blue", hex: "#1E3A8A" },
    { name: "Royal Blue", hex: "#4169E1" },
    { name: "Sky Blue", hex: "#87CEEB" },
    { name: "Dark Firozi", hex: "#007BA7" },
    { name: "Maroon", hex: "#800000" },
    { name: "Red", hex: "#FF0000" },
    { name: "Carrot Pink", hex: "#FF6F61" },
    { name: "Rani", hex: "#FF0063" },
    { name: "Baby Pink", hex: "#F4C2C2" },
    { name: "Bottle Green", hex: "#006A4E" },
    { name: "Green", hex: "#008000" },
    { name: "Sea Green", hex: "#2E8B57" },
    { name: "Parrot Green", hex: "#00FF00" },
    { name: "Mustard Yellow", hex: "#FFDB58" },
    { name: "Lemon Yellow", hex: "#FFF44F" },
    { name: "Charcoal Grey", hex: "#36454F" },
    { name: "Light Grey", hex: "#D3D3D3" },
  ];

  const dryFitColors = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Navy Blue", hex: "#001f3f" },
    { name: "Royal Blue", hex: "#007bff" },
    { name: "Firozi", hex: "#00bcd4" },
    { name: "Maroon", hex: "#800000" },
    { name: "Red", hex: "#ff0000" },
    { name: "Rani Pink", hex: "#d5006d" },
    { name: "Florescent Pink", hex: "#ff00ff" },
    { name: "Florescent Orange", hex: "#ff5722" },
    { name: "Bottle Green", hex: "#005d33" },
    { name: "Green", hex: "#4caf50" },
    { name: "Mustard Yellow", hex: "#ffeb3b" },
    { name: "Lemon Yellow/Green", hex: "#cddc39" },
    { name: "Rust", hex: "#b65e2e" },
    { name: "Charcoal Grey", hex: "#333333" },
    { name: "Fawn", hex: "#e0ac84" },
  ];

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setSelectedCollar(""); // Reset collar type when product changes
    setSelectedSleeves(""); // Reset sleeves type when product changes
    updateSelectedImage(e.target.value, selectedCollar, selectedSleeves); // Update image based on product
  };

  const handleCollarChange = (e) => {
    setSelectedCollar(e.target.value);
    updateSelectedImage(selectedProduct, e.target.value, selectedSleeves); // Update image based on collar change
  };

  const handleColorChange = async (colorHex) => {
    try {
      const formData = new FormData();
      formData.append("email", "er.amishamotwani@email.com"); // Replace with actual email
      formData.append("password", "Amul@1343"); // Replace with actual password
      formData.append("image", selectedImage); // Use the RoundF image initially
      formData.append("clothing_text", "T Shirt"); // Example clothing type, change as needed
      formData.append("Hex_color", colorHex); // The selected color's hex code

      const response = await fetch(
        "https://thenewblack.ai/api/1.1/wf/color_change",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Assuming the response is JSON
      setSelectedImage(data); // Assuming 'data' contains the new image URL
    } catch (error) {
      console.error("Error changing color:", error);
    }
  };

  const handleSleevesChange = (e) => {
    setSelectedSleeves(e.target.value);
    updateSelectedImageForSleeves(
      selectedProduct,
      selectedCollar,
      e.target.value
    ); // Update image based on sleeve change
  };

  const handleFabricChange = (e) => {
    setSelectedFabric(e.target.value);
    setSelectedColor(""); // Reset selected color when changing fabric
  };

  // const updateSelectedImage = (product, collar, sleeves) => {
  //   let imageName = "RoundF"; // Default image
  //   if (collar === "HiNeck") {
  //     imageName = "HighF";
  //   } else if (collar === "KnittedCollar") {
  //     imageName = "CollarF";
  //   }
  //   if (sleeves === "HalfSleeve") {
  //     imageName += "H"; // Add suffix for half sleeve
  //   }
  //   // Construct the image path
  //   setSelectedImage(require(`../../Images/Pattern/${imageName}.png`));
  // };
  const updateSelectedImage = (product, collar, sleeves) => {
    let imageName = "RoundF"; // Default image

    // Set image based on collar type
    if (collar === "HiNeck") {
      imageName = "HighF";
    } else if (collar === "KnittedCollar") {
      imageName = "CollarF";
    }

    // Set suffix based on sleeve type
    if (sleeves === "HalfSleeve") {
      imageName += "H"; // Append 'H' for half sleeves
    } else if (sleeves === "FullSleeve") {
      imageName += "F"; // Append 'F' for full sleeves
    } else if (sleeves === "WithoutSleeves") {
      imageName += "W"; // Assuming 'W' for no sleeves, update if needed
    }

    // Construct and set the image path
    try {
      setSelectedImage(require(`../../Images/Pattern/${imageName}.png`));
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  const updateSelectedImageForSleeves = (product, collar, sleeves) => {
    let imageName = "RoundF"; // Default image

    // Set image based on collar type
    // Set image based on collar type
    if (collar === "HiNeck") {
      imageName = "High";
    } else if (collar === "KnittedCollar") {
      imageName = "Collar";
    } else if (collar === "RoundNeck") {
      imageName = "Round"; // Add this condition for Round Neck
    }

    // Set suffix based on sleeve type
    if (sleeves === "HalfSleeve") {
      imageName += "H"; // Append 'H' for half sleeves
    } else if (sleeves === "FullSleeve") {
      imageName += "F"; // Append 'F' for full sleeves
    } else if (sleeves === "WithoutSleeves") {
      imageName += "W"; // Assuming 'W' for no sleeves, update if needed
    }

    // Construct and set the image path
    try {
      setSelectedImage(require(`../../Images/Pattern/${imageName}.png`));
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  // Handle showing and closing the modal
  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => {
    setShowModal(false); // Close the modal
    setTextInput(""); // Reset the text input to empty
  };

  // Handle mouse down when starting to drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.target.getBoundingClientRect();
    setMouseOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTextSave = () => {
    // Log or save the text and its properties
    console.log("Saved Text:", textInput);
    console.log("Text Color:", textColor);
    console.log("Text Size:", textSize);
    console.log("Is Bold:", isBold);
    console.log("Is Italic:", isItalic);
    setShowModal(false);
    // You can add logic to send this data to an API or save it in a state
  };

  // ---- Code for Logo -----
  const handleAddLogo = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file)); // Create a URL for the selected image
    }
  };

  // Function to handle the download
const handleDownload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas size to match the displayed image
    canvas.width = 800; // Adjust to your image dimensions
    canvas.height = 800;

    // Draw the selected image onto the canvas
    const image = new Image();
    image.src = selectedImage;

    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Draw the logo, if uploaded
      if (logo) {
        const logoImage = new Image();
        logoImage.src = logo;

        logoImage.onload = () => {
          context.drawImage(
            logoImage,
            logoPosition.x,
            logoPosition.y,
            logoSize.width,
            logoSize.height
          );

          // Draw the text, if added
          context.font = `${isBold ? "bold" : ""} ${isItalic ? "italic" : ""} ${textSize}px Arial`;
          context.fillStyle = textColor;
          context.fillText(textInput, 50, 50); // Adjust positioning as needed

          // Trigger download of the final image
          canvas.toBlob((blob) => {
            saveAs(blob, "custom-design.png");
          });
        };
      } else {
        // If there's no logo, download just the image and text
        context.font = `${isBold ? "bold" : ""} ${isItalic ? "italic" : ""} ${textSize}px Arial`;
        context.fillStyle = textColor;
        context.fillText(textInput, 50, 50); // Adjust positioning as needed

        canvas.toBlob((blob) => {
          saveAs(blob, "custom-design.png");
        });
      }
    };
  };
  console.log("selected Image", selectedImage);
  return (
    <>
      <div className="flex w-full relative">
        <div className="w-[60%]  h-[fit-content]">
          <img
            //  style={{ position: "relative", zIndex: 1 }}
            src={selectedImage}
            className="w-[100%] h-[100%]"
            // className=" h-[400px] w-[700px]"
            alt="Customizable"
            style={{ position: "relative" }}
          />
          {logo && (
            <>
              <Rnd
                size={{ width: logoSize.width, height: logoSize.height }}
                position={{ x: logoPosition.x, y: logoPosition.y }}
                onDragStop={(e, d) => {
                  setLogoPosition({ x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref) => {
                  setLogoSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                  });
                }}
                bounds="parent"
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
              >
                <img
                  src={logo}
                  alt="Logo Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }} // Ensure the image fits within the container
                  draggable={false} // Prevent default drag behavior
                />
              </Rnd>
            </>
          )}
          <Rnd
            size={textSize}
            position={{ x: position.x, y: position.y }}
            onDragStart={() => setIsDragging(true)}
            onDragStop={(e, d) => {
              setIsDragging(false);
              setPosition({ x: d.x, y: d.y });
            }}
            onResizeStart={() => setIsResizing(true)}
            onResizeStop={(e, direction, ref, delta, position) => {
              setIsResizing(false);
              setTextSize({
                width: ref.style.width,
                height: ref.style.height,
              });
              setPosition(position);
            }}
            minWidth={50}
            minHeight={50}
            bounds="parent"
            style={{
              border: shouldShowStyle ? "1px solid #ccc" : "none",
              backgroundColor: shouldShowStyle ? "#f0f0f0" : "transparent",
              paddingLeft: "3px",
              paddingRight: "3px",
              paddingBottom: "0px",
              transition: "all 0.2s ease", // Smooth transition for hover effect
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h1
              style={{
                color: textColor, // Using inline style for dynamic color
                fontSize: `${textSize}px`, // Dynamic font size
                fontWeight: isBold ? "bold" : "normal", // Conditional bold
                fontStyle: isItalic ? "italic" : "normal", // Conditional italic
              }}
            >
              {textInput}
            </h1>
          </Rnd>
          <div className="absolute top-[85%] left-[26%] "></div>
        </div>
        <div className="w-[40%] px-2 h-[fit-content]">
          <Form.Select
            aria-label="Default select example"
            onChange={handleProductChange}
          >
            <option>Choose Product:</option>
            <option value="TShirt">T-Shirt</option>
            <option value="Lower">Lower</option>
            <option value="Upper">Upper</option>
            <option value="Shorts">Shorts</option>
            <option value="Sandoz">Sandoz</option>
            <option value="TrackSuit">Track Suit</option>
            <option value="KabaddiSet">Kabaddi Set</option>
            <option value="CricketSet">Cricket Set</option>
            <option value="FootballSet">Football Set</option>
            <option value="Cap">Cap</option>
            <option value="Sash">Sash</option>
          </Form.Select>

          {/* Conditional Collar Type Selection */}
          {selectedProduct === "TShirt" && (
            <Form.Select
              aria-label="Default select example"
              style={{ marginTop: "10px" }}
              onChange={handleCollarChange}
            >
              <option>Choose Collar Type:</option>
              <option value="RoundNeck">Round Neck</option>
              <option value="KnittedCollar">Knitted Collar</option>
              <option value="WilsonCollar">Wilson Collar</option>
              <option value="HiNeck">Hi Neck</option>
              <option value="RegularCollar">Regular Collar</option>
            </Form.Select>
          )}

          {/* Conditional Sleeves Type Selection */}
          {selectedCollar && (
            <Form.Select
              aria-label="Default select example"
              style={{ marginTop: "10px" }}
              onChange={handleSleevesChange}
            >
              <option>Choose Sleeves Type:</option>
              <option value="HalfSleeve">Half Sleeve</option>
              <option value="FullSleeve">Full Sleeve</option>
              <option value="WithoutSleeves">Without Sleeves</option>
            </Form.Select>
          )}

          {/* Conditional Fabric Type Selection */}
          {selectedSleeves && (
            <Form.Select
              aria-label="Default select example"
              style={{ marginTop: "10px" }}
              onChange={handleFabricChange}
            >
              <option>Choose Fabric Type:</option>
              <option value="Matty">Matty</option>
              <option value="DryFit">Dry Fit</option>
              <option value="HoneyComb">Honey Comb</option>
              <option value="SuperPolyester">Super Polyester</option>
              <option value="PlainPolyester">Plain Polyester (PP)</option>
              <option value="TwoWayLycra">2 Way Lycra</option>
              <option value="FourWayLycra">4 Way Lycra</option>
            </Form.Select>
          )}

          {selectedFabric === "Matty" && (
            <>
              <h3 className="text-lg">
                Colors available in Matty fabrics are:
              </h3>
              <div className="flex flex-wrap">
                {mattyColors.map((color) => (
                  <div
                    key={color.name}
                    onClick={() => handleColorChange(color.hex)}
                    className={`w-[40px] h-[40px] m-2 p-1 cursor-pointer rounded-md ${
                      selectedColor === color.hex
                        ? "border-4 border-black"
                        : "border-1 border-slate-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    <p className="text-white text-center text-[7px]">
                      {color.name}
                    </p>
                  </div>
                ))}
              </div>

              {/* Display Selected Color */}
              {/* {selectedColor && (
                <div className="mt-5">
                  <h4>Selected Color:</h4>
                  <div
                    className="w-[100px] h-[100px] cursor-pointer p-1 rounded-md border-1 border-slate-300"
                    style={{ backgroundColor: selectedColor }}
                  ></div>
                </div>
              )} */}
            </>
          )}

          {selectedFabric === "DryFit" && (
            <>
              <h3 className="text-lg">
                Colors available in Dry Fit fabrics are:
              </h3>
              <div className="flex flex-wrap">
                {dryFitColors.map((color) => (
                  <div
                    key={color.name}
                    onClick={() => handleColorChange(color.hex)}
                    className={`w-[40px] h-[40px] m-2 cursor-pointer rounded-md  ${
                      selectedColor === color.hex
                        ? "border-4 border-black"
                        : "border-1 border-slate-400"
                    }`}
                    style={{ backgroundColor: color.hex }}
                  >
                    <p className="text-white text-center text-[7px]">
                      {color.name}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* Modal for adding text */}
          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Text to Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="textInput">
                  <Form.Label>Enter your text:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Type text here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    style={{
                      color: textColor,
                      fontWeight: isBold ? "bold" : "normal",
                      fontStyle: isItalic ? "italic" : "normal",
                      fontSize: `${textSize}px`,
                    }}
                  />
                  <Form.Label className="mt-2">Color:</Form.Label>
                  <input
                    type="color"
                    value={textColor} // Set the value of color input to the selected text color
                    onChange={(e) => setTextColor(e.target.value)} // Update textColor on selection
                    className="border-1 w-[25px] h-[25px] rounded-md mx-2 my-2"
                  />

                  <Form.Check
                    type="checkbox"
                    label="Bold"
                    checked={isBold}
                    onChange={(e) => setIsBold(e.target.checked)}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Italic"
                    checked={isItalic}
                    onChange={(e) => setIsItalic(e.target.checked)}
                  />
                  <Form.Label className="mt-2">Size:</Form.Label>
                  <input
                    type="number"
                    value={textSize}
                    onChange={(e) => setTextSize(e.target.value)}
                    className="border-1 w-[50px] h-[30px] px-1 rounded-md mx-2 my-2"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleTextSave}>
                Save Text
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="flex w-full justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition duration-200 w-[fit-content] h-[fit-content] m-3"
              onClick={handleModalShow}
            >
              Add text
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-2 transition duration-200 w-[fit-content] h-[fit-content] m-3"
              onClick={handleAddLogo}
            >
              Add Logo
            </button>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }} // Hide the file input
              accept="image/*" // Accept only image files
              onChange={handleFileChange}
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              onClick={handleDownload}
              className="w-[90%] h-[fit-content] py-2 rounded-lg mx-auto text-lg bg-blue-500 hover:bg-blue-600 text-white"
            >
              Download Image
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesignYourOwn;
