import React, { useState, useContext } from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import "./Auth.css";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError}=useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (isLoginMode) {
       try {
        const responseData = await sendRequest("http://localhost:5000/api/users/login","POST",JSON.stringify({
             email: formState.inputs.email.value,
             password: formState.inputs.password.value,
           }),
           {"Content-Type": "application/json"}
         );
         auth.login(responseData.userId, responseData.token);
       } catch (error) {}
    } else {
      try {
        const formData = new FormData(); // FormData is a built-in class in JavaScript that allows you to send file data to a server using HTTP requests.
        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password",formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest("http://localhost:5000/api/users/signup","POST",formData,
        );
        auth.login(responseData.userId, responseData.token);
      } catch (error) {}
    }
  };
  return (<>
  {<ErrorModal error={error} onClear={clearError} />}
    <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
      <h2>Login Required!</h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Username"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid username, at least 5 characters."
            onInput={inputHandler}
          />
        )}
        {!isLoginMode && (
          <ImageUpload 
            center
            id="image"
            onInput={inputHandler}
            errorText="Please provide an image."
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 6 characters."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "Login" : "Signup"}
        </Button>
      </form>
      <Button onClick={switchModeHandler} inverse>
        Switch to {isLoginMode ? "Signup" : "Login"}{" "}
      </Button>
    </Card>
    </>);
};

export default Auth;
