import * as Yup from "yup";

export const formSchema = Yup.object({
  name: Yup.string().min(2).required("Please enter the name of the product"),
  // color:Yup.string().min(2).required("Please enter color of the product"),
  price: Yup.string().min(1).required("Please enter the price of the product"),
  description: Yup.string().min(1).required("Please enter description"),
  colors: Yup.array().min(1, "At least one color is required"),
  fabric: Yup.string().min(1, "At least one color is required"),
});
