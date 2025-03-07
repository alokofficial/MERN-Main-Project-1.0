import React,{useState,useContext} from "react";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import './Auth.css';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    },false)

    const switchModeHandler = () => {
        if (isLoginMode) {
            setFormData( {
                ...formState.inputs,
                name: undefined
            },
            formState.inputs.email.isValid && formState.inputs.password.isValid)
        }else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            },
            false
            )
        }
        setIsLoginMode(prevMode => !prevMode);
    }
    const authSubmitHandler = (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        auth.login();
    }
    return (
        <Card className="authentication">
            <h2>Login Required!</h2><hr/>
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode && <Input
                    element="input"
                    id="name"
                    type="text"
                    label="Username"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid username, at least 5 characters."
                    onInput={inputHandler}
                />}
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
                <Button type="submit" disabled={!formState.isValid }>{isLoginMode ? 'Login' : 'Signup'}</Button>
            </form>
            <Button onClick={switchModeHandler} inverse >Switch to {isLoginMode ? 'Signup' : 'Login'} </Button>
        </Card>
    );
};

export default Auth;
