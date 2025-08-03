import { FormEvent, useState } from "react";
import axios from "axios";
import { Typography, Input, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

export default function MailResetPassword() {
    const navigate=useNavigate();
    const [formdata,setformdata]= useState("")
    const[loading ,setLoading] = useState(false);

    function handlechange(e:React.ChangeEvent<HTMLInputElement>){

     setformdata(e.target.value);




    }
    async function handlereset(e: FormEvent<HTMLFormElement>){
setLoading(true);
        e.preventDefault();

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/forgotpass`,
                {
                    email:formdata,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
setLoading(false);
            const data = res.data;
            if (res.status === 200 || res.status === 201) {
                alert("Mail send to registerd email");
                 navigate("/login");
            } else {
                alert(data.message || "Email not found");
            }
        } catch (err: any) {
            setLoading(false);
            console.error(err);
            alert(err.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <section className="grid text-center h-screen items-center p-8">
            <div>
                <Typography variant="h3" color="blue-gray" className="mb-2">
                  Enter your Register Email
                </Typography>
                <form action="POST" className="mx-auto max-w-[24rem] text-left" onSubmit={handlereset}>
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
                            value={formdata}
                            type="email"
                            name="email"
                            placeholder="name@mail.com"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "hidden",
                            }} crossOrigin={undefined}            />
                    </div>

                    <Button
                        color="gray"
                        size="lg"
                        className="mt-10 flex items-center justify-center gap-2"
                        fullWidth
                        type="submit"
                        disabled={loading}
                    >
                        {loading && (
                            <ReactLoading type="spin" color="#fff" height={20} width={20} />
                        )}
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
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

