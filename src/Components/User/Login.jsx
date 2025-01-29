// import React from "react";
// import { Button, Input, Checkbox, Link, Form } from "@heroui/react";
// import { Icon } from "@iconify/react";
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../../firebase/firebase";
// import { useNavigate } from "react-router-dom";
// import { authenticate } from "../../utils/helpers";
// import axios from "axios";

// import apiClient from "../../utils/apiClient";

// export default function Login() {
//   const navigate = useNavigate();

//   const doSignInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     await registerWithGoogle(
//       result.user.email,
//       result.user.displayName,
//       result.user.photoURL
//     );
//   };

//   const registerWithGoogle = async (email, displayName, photoURL) => {
//     try {
//       const { data } = await apiClient.post(`/auth/google`, {
//         email: email,
//         name: displayName,
//         avatar: photoURL,
//       });

//       authenticate(data, () => {
//         navigate("/");
//         window.location.reload();
//       });
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   const [isVisible, setIsVisible] = React.useState(false);

//   const toggleVisibility = () => setIsVisible(!isVisible);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log("handleSubmit");
//   };

//   return (
//     <div className="flex h-full w-full items-center justify-center">
//       <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6 mx-auto">
//         <p className="pb-4 text-center text-3xl font-semibold">
//           Log In
//           <span aria-label="emoji" className="ml-2" role="img">
//             👋
//           </span>
//         </p>
//         <Form
//           className="flex flex-col gap-4"
//           validationBehavior="native"
//           onSubmit={handleSubmit}
//         >
//           <Input
//             isRequired
//             label="Email"
//             labelPlacement="outside"
//             name="email"
//             placeholder="Enter your email"
//             type="email"
//             variant="bordered"
//           />

//           <Input
//             isRequired
//             endContent={
//               <button type="button" onClick={toggleVisibility}>
//                 {isVisible ? (
//                   <Icon
//                     className="pointer-events-none text-2xl text-default-400"
//                     icon="solar:eye-closed-linear"
//                   />
//                 ) : (
//                   <Icon
//                     className="pointer-events-none text-2xl text-default-400"
//                     icon="solar:eye-bold"
//                   />
//                 )}
//               </button>
//             }
//             label="Password"
//             labelPlacement="outside"
//             name="password"
//             placeholder="Enter your password"
//             type={isVisible ? "text" : "password"}
//             variant="bordered"
//           />

//           <div className="flex w-full items-center justify-between px-1 py-2">
//             <Checkbox defaultSelected name="remember" size="sm">
//               Remember me
//             </Checkbox>
//             <Link className="text-default-500" href="#" size="sm">
//               Forgot password?
//             </Link>
//           </div>
//           <Button className="w-full" color="primary" type="submit">
//             Log In
//           </Button>
//         </Form>

//         {/* Google Button */}
//         <Button
//           className="w-full flex items-center justify-center gap-2"
//           color="default"
//           onClick={doSignInWithGoogle}
//         >
//           <Icon icon="logos:google-icon" className="text-xl" />
//           Continue with Google
//         </Button>

//         <p className="text-center text-small">
//           <Link href="#" size="sm">
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

import React from "react";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Form,
  Divider,
  Alert,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../../utils/helpers";
import apiClient from "../../utils/apiClient";

export default function Login() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alert, setAlert] = React.useState("");
  const [error, setError] = React.useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await apiClient.post("/user/login", { email, password });
      if (data.message === "success") {
        setPassword("");
        setEmail("");
      } 
    } catch (error) {
      setAlert("error");
      setError(error.response.data.error);
    }
  };

  const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await registerWithGoogle(
      result.user.email,
      result.user.displayName,
      result.user.photoURL
    );
  };

  const registerWithGoogle = async (email, displayName, photoURL) => {
    try {
      const { data } = await apiClient.post(`/auth/google`, {
        email: email,
        name: displayName,
        avatar: photoURL,
      });

      authenticate(data, () => {
        navigate("/");
        window.location.reload();
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-tr from-green-400 to-blue-500">
      <div className="flex w-1/2 items-center justify-center">
        <div className="text-white text-center ml-16 animate-fade-in">
          <h1 className="text-4xl font-bold animate-bounce">Welcome Back</h1>
          <p className="mt-4 text-lg animate-pulse">Log in to your account to continue</p>
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6 mt-16 bg-white shadow-lg">
          {alert && alert === "error" && (
            <Alert color="danger" danger title={error} />
          )}
          <Form
            className="flex flex-col gap-3"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={email}
              onValueChange={setEmail}
            />

            <Input
              isRequired
              endContent={
                <button type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-closed-linear"
                    />
                  ) : (
                    <Icon
                      className="pointer-events-none text-2xl text-default-400"
                      icon="solar:eye-bold"
                    />
                  )}
                </button>
              }
              label="Password"
              name="password"
              placeholder="Enter your password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              value={password}
              onValueChange={setPassword}
            />

            <div className="flex w-full items-center justify-between px-1 py-2">
              <Checkbox name="remember" size="sm">
                Remember me
              </Checkbox>
              <Link className="text-default-500" href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" color="primary" type="submit">
              Sign In
            </Button>
          </Form>
          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-tiny text-default-500">OR</p>
            <Divider className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              startContent={<Icon icon="flat-color-icons:google" width={24} />}
              variant="bordered"
              onClick={doSignInWithGoogle}
            >
              Continue with Google
            </Button>
          </div>
          <p className="text-center text-small">
            Need to create an account?&nbsp;
            <Link href="register" size="sm">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}