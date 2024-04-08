import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Validator from "validator";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";

const LoginForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [validErrors, setValidErrors] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSend = (e) => {
        const {errors, isValid} = validateFormInput(formData);
        setValidErrors(errors);
        if (!isValid)
            return;

        apiService.login(formData.username, formData.password).then(data => {
            const {status, user, msg} = data;
            if (status) {
                const tokenTime = new Date();
                
                localStorage.setItem("auth", "1");
                localStorage.setItem("tokenTime", tokenTime.toISOString());
                navigate("/form")
                toast.success("You have successfully logged in.");
            } else {
                toast.error(msg);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const isEmpty = (value) => {
        return value === undefined ||
            value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0);
    }

    const validateFormInput = (data) => {
        let errors = {};
    
        data.username = !isEmpty(data.username) ? data.username : "";
        data.password = !isEmpty(data.password) ? data.password : "";
    
        if (Validator.isEmpty(data.username)) {
            errors.username = "This value is required.";
        }
    
        if (Validator.isEmpty(data.password)) {
            errors.password = "This value is required.";
        }
    
        return {
            errors,
            isValid: isEmpty(errors)
        };
    };

    return <>
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${validErrors.username && `border-orange-600`} `} 
                                required  
                                onChange={handleChange}
                                value={formData.username}
                            />
                            {
                                validErrors.username &&
                                <p className="text-red-500 text-xs">{validErrors.username}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${validErrors.password && `border-orange-600`} `} 
                                required   
                                onChange={handleChange}
                                value={formData.password}
                            />
                            {
                                validErrors.password &&
                                <p className="text-red-500 text-xs">{validErrors.password}</p>
                            }
                        </div>
                        <button type="submit" className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-primary-800"
                            onClick={handleSend}
                        >Sign in</button>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}

export default LoginForm;