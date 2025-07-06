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
  const [loading, setLoading] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validatePassword = (value) => {
    const minLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    let errorMessage = "";
    
    if (!minLength) {
      errorMessage = "Password must be at least 8 characters";
    } else if (!hasUpperCase) {
      errorMessage = "Password must contain at least 1 uppercase letter";
    } else if (!hasNumber) {
      errorMessage = "Password must contain at least 1 number";
    } else if (!hasSpecialChar) {
      errorMessage = "Password must contain at least 1 special character";
    }

    setPasswordError(errorMessage);
    return errorMessage === "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      setAlert("error");
      setError("Please fix password requirements");
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
      authenticate(data, () => {
        navigate("/");
        window.location.reload();
      });
    } catch (error) {
      setAlert("error");
      setError(error.response.data.error || "Registration failed");
      setLoading(false);
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
      setAlert("error");
      setError(e.response.data.error || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-pink-400 to-yellow-500">
      <div className="flex w-full items-center justify-center">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Form Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8">
            {alert && (
              <Alert
                className="mb-4"
                color={alert === "error" ? "danger" : "success"}
                title={error}
              />
            )}
            <Form
              className="grid grid-cols-1 gap-4"
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
                onChange={handlePasswordChange}
                errorMessage={passwordError}
                isInvalid={!!passwordError}
                description="Password must contain: 8+ characters, 1 uppercase, 1 number, 1 special character"
              />
            </Form>
          </div>
          {/* Divider for desktop, hidden on mobile */}
          <Divider orientation="vertical" className="hidden md:block h-full" />
          {/* Welcome Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Welcome
              </h1>
              <p className="mt-4 text-base md:text-lg text-gray-600">
                Create an account to get started
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                startContent={
                  <Icon icon="flat-color-icons:google" width={24} />
                }
                variant="bordered"
                onPress={doSignInWithGoogle}
                className="w-full"
              >
                Continue with Google
              </Button>
              <Divider className="my-4" />
              <Button
                color="primary"
                variant="solid"
                className="w-full"
                onPress={handleSubmit}
                isLoading={loading}
                isDisabled={!!passwordError || !password}
              >
                Sign Up
              </Button>
              <Checkbox name="terms" size="sm" className="mt-4">
                I agree to the terms and conditions
              </Checkbox>
              <p className="text-center text-small mt-4">
                Already have an account?&nbsp;
                <Link href="login" size="sm">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}