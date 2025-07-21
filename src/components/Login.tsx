import { FormEvent, useState } from "react";
import axios from "axios";
import { Typography, Input, Button } from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate=useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
const [formdata,setformdata]= useState({email:"",password:""})


function handlechange(e:React.ChangeEvent<HTMLInputElement>){

const {name,value}=e.target;

setformdata((prev)=>({...prev,[name]:value}))

}
  async function handlelogin(e: FormEvent<HTMLFormElement>){
console.log(formdata)
e.preventDefault();

 try {
  const res = await axios.post(
    "http://localhost:8080/api/login",
    {
      email: formdata.email,
      password: formdata.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = res.data;
  console.log(data)
  const {name,token,welcome}=data;
  localStorage.setItem("jwtToken",token);
  console.log(token)
  if (res.status === 200 || res.status === 201) {
    alert("login successful!");
    navigate("/");
  } else {
    alert(data.message || "login failed");
  }
} catch (err: any) {
  console.error(err);
  alert(err.response?.data?.message || "Something went wrong");
}
  }
  return (
    <section className="grid text-center h-screen items-center p-8">
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Sign In
        </Typography>
        <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
          Enter your email and password to sign in
        </Typography>
        <form action="POST" className="mx-auto max-w-[24rem] text-left" onSubmit={handlelogin}>
          <div className="mb-6">
            <label htmlFor="email">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Your Email
              </Typography>
            </label>
            <Input
              id="email"
              color="gray"
              size="lg"
              onChange={handlechange}
              value={formdata.email}
              type="email"
              name="email"
              placeholder="name@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "hidden",
              }} crossOrigin={undefined}            />
          </div>
          <div className="mb-6">
            <label htmlFor="password">
              <Typography
                variant="small"
                className="mb-2 block font-medium text-gray-900"
              >
                Password
              </Typography>
            </label>
            <Input
              size="lg"
              onChange={handlechange}
              name="password"
              value={formdata.password}
              placeholder="********"
              labelProps={{
                className: "hidden",
              }}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              type={passwordShown ? "text" : "password"}
              icon={<i onClick={togglePasswordVisiblity}>
                {passwordShown ? (
                  <EyeIcon className="h-5 w-5" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" />
                )}
              </i>} crossOrigin={undefined}            />
          </div>
          <Button color="gray" size="lg" className="mt-10" fullWidth type="submit">
            sign in
          </Button>
          <div className="!mt-4 flex justify-end">
            <Typography
              as="a"
              href="#"
              color="blue-gray"
              variant="small"
              className="font-medium"
            >
              Forgot password
            </Typography>
          </div>
          <Typography
            variant="small"
            color="gray"
            className="!mt-4 text-center font-normal"
          >
            Not registered?{" "}
      <button className="font-medium text-gray-900" onClick={()=>navigate('/register')}>
  Sign Up
</button>
          </Typography>
        </form>
      </div>
    </section>
  );
}

