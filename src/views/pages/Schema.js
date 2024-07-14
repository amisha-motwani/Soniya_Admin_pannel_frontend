import * as Yup from "yup";

export const Schema = Yup.object({
    username: Yup.string().min(2).max(30).required("Please enter your username"),
    password: Yup.string().min(3).required("Please enter your password"),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
    secreteKey: Yup.string().required("Please enter secrete key"),
})