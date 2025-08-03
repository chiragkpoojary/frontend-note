import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import axios from "axios";
export default function Register() {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username:"",
    password:"",
    email: "",
    passwordMatch: "",
  });

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({ ...prev, [name]: value }));

  setErrors((prev) => ({ ...prev, [name]: "", passwordMatch: "" }));

 



  if (
    (name === "password" || name === "confirmPassword") &&
    formData.password &&
    formData.confirmPassword &&
    (name === "password" ? value !== formData.confirmPassword : value !== formData.password)
  ) {
    setErrors((prev) => ({ ...prev, passwordMatch: "Passwords do not match" }));
  }
};



  const handleSubmit = async (e:React.ChangeEvent<HTMLFormElement>) => {
  e.preventDefault();
  const { username, email, password, confirmPassword } = formData;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  
  if (username.trim().length < 4) {
    setErrors((prev) => ({ ...prev, username: "Username must be at least 4 characters" }));
    alert("username atleat 4 character")
    return;
  }

  if (!emailRegex.test(email)) {
    setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
    return;
  }

  if (password.length < 6) {
    setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
     alert("password atleat 6 character")
    return;
  }

  if (password !== confirmPassword) {
    setErrors((prev) => ({ ...prev, passwordMatch: "Passwords do not match" }));
    return;
  }
   try {
  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/register`,
    {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = res.data;

  if (res.status === 200 || res.status === 201) {
    alert("Registration successful!");
    navigate("/login");
  } else {
    alert(data.message || "Registration failed");
  }
} catch (err: any) {
  console.error(err);
  alert(err.response?.data?.message || "Something went wrong");
}


  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card color="transparent" shadow={false}>
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Nice to meet you! Enter your details to register.
        </Typography>

        <form onSubmit={handleSubmit} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
        
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Name
            </Typography>
            <Input
              size="lg"
              name="username"
              placeholder="Your name"
              value={formData.username}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
 <p  className="-mt-6 ml-2">
               name should be atleast 4 character
            </p>
            
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              size="lg"
              name="email"
              placeholder="name@mail.com"
              value={formData.email}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

            
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              size="lg"
              name="password"
              placeholder="********"
              type={passwordShown ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
              icon={
                <i onClick={togglePasswordVisiblity} className="cursor-pointer">
                  {passwordShown ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </i>
              }
            />
  <p  className="-mt-6 ml-2">
               password should be atleast 6 character
            </p>
        
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Confirm Password
            </Typography>
            <Input
              size="lg"
              name="confirmPassword"
              placeholder="********"
              type={passwordShown ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
            {errors.passwordMatch && <p className="text-red-500 text-sm">{errors.passwordMatch}</p>}
          </div>

          <Button type="submit" className="mt-10" fullWidth>
            Sign Up
          </Button>

          <Typography color="gray" className="mt-4 text-center font-normal">
            Already have an account?{" "}
            <button
              type="button"
              className="font-medium text-gray-900"
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </Typography>
        </form>
      </Card>


    </div>
  );
}
