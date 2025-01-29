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

export default function Register() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [alert, setAlert] = React.useState("");
  const [error, setError] = React.useState("");
  

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await apiClient.post("/user/register", {
        firstName,
        lastName,
        phoneNumber,
        address,
        email,
        password,
      });
      if (data.message === "success") {
        setPassword("");
        setEmail("");
        setFirstName("");
        setLastName("");
        setPhoneNumber("");
        setAddress("");
        setAlert("success");
        setError("");
      } else {
        setAlert("error");
        setError(data.error || "Registration failed");
      }
      authenticate(data, () => {
        navigate("/");
        window.location.reload();
      });
    } catch (error) {
      setAlert("error");
      setError(error.response.data.error || "Registration failed");
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
    <div className="flex h-screen bg-gradient-to-tr from-pink-400 to-yellow-500">
      <div className="flex w-1/2 items-center justify-center">
        <div className="text-white text-center ml-16 animate-fade-in">
          <h1 className="text-4xl font-bold animate-bounce">Welcome</h1>
          <p className="mt-4 text-lg animate-pulse">
            Create an account to get started
          </p>
        </div>
      </div>
      <div className="flex w-1/2 items-center justify-center overflow-auto">
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6 bg-white shadow-lg mt-40 mb-2">
          {alert && (
            <Alert
              color={alert === "error" ? "danger" : "success"}
              title={error}
            />
          )}
          <Form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              isRequired
              label="First Name"
              name="firstName"
              placeholder="Enter your first name"
              type="text"
              variant="bordered"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <Input
              isRequired
              label="Last Name"
              name="lastName"
              placeholder="Enter your last name"
              type="text"
              variant="bordered"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              placeholder="Enter your phone number"
              type="text"
              variant="bordered"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <Input
              label="Address"
              name="address"
              placeholder="Enter your address"
              type="text"
              variant="bordered"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Input
              isRequired
              label="Email Address"
              name="email"
              placeholder="Enter your email"
              type="email"
              variant="bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-1 md:col-span-2"
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
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-1 md:col-span-2"
            />

            <div className="flex w-full items-center justify-between px-1 py-2 col-span-1 md:col-span-2">
              <Checkbox name="terms" size="sm">
                I agree to the terms and conditions
              </Checkbox>
            </div>
            <Button
              className="w-full col-span-1 md:col-span-2"
              color="primary"
              type="submit"
            >
              Sign Up
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
            Already have an account?&nbsp;
            <Link href="login" size="sm">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
