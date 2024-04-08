import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Validator from "validator";

import apiService from "../../services/apiService";

const CheckForm = () => {
    const navigate = useNavigate();
    const initFormData = { page_url: '', position: '', org_content: '', key: '' };
    const [formData, setFormData] = useState(initFormData);
    const [validErrors, setValidErrors] = useState(initFormData);

    useEffect(() => {
        const authenticated = localStorage.getItem("auth");

        if (authenticated !== "1" || !isTokenExpire())
            navigate("/");
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSend = (e) => {
        if (!isTokenExpire())
            navigate("/");

        const {errors, isValid} = validateFormInput(formData);
        setValidErrors(errors);
        if (!isValid)
            return;

        console.log(formData);

        apiService.send(formData.page_url, formData.position, formData.org_content, formData.key).then(data => {
            const {status, msg} = data;
            if (status) {
                setFormData(initFormData);
                toast.success(msg);
            } else {
                toast.error(msg);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const isTokenExpire = () => {
        const tokenTime = localStorage.getItem("tokenTime");

        const givenTimestamp = new Date(tokenTime);

        // Add 1 hour to the given timestamp
        const oneHourLater = new Date(givenTimestamp.getTime() + 60 * 60 * 1000).getTime() / 1000;
        
        // Current time
        const currentTime = new Date().getTime() / 1000;

        console.log("currentTime", currentTime);
        console.log("oneHourLater", oneHourLater);

        if (currentTime >= oneHourLater)
            return false;
        return true;
    }

    const isEmpty = (value) => {
        return value === undefined ||
            value === null ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "string" && value.trim().length === 0);
    }

    const validateFormInput = (data) => {
        let errors = {};
    
        data.page_url = !isEmpty(data.page_url) ? data.page_url : "";
        data.position = !isEmpty(data.position) ? data.position : "";
        data.org_content = !isEmpty(data.org_content) ? data.org_content : "";
        data.key = !isEmpty(data.key) ? data.key : "";
    
        if (Validator.isEmpty(data.page_url)) {
            errors.page_url = "This value is required.";
        }
    
        if (Validator.isEmpty(data.position)) {
            errors.position = "This value is required.";
        }
    
        if (Validator.isEmpty(data.org_content)) {
            errors.org_content = "This value is required.";
        }
    
        if (Validator.isEmpty(data.key)) {
            errors.key = "This value is required.";
        }
    
        return {
            errors,
            isValid: isEmpty(errors)
        };
    };

    const handleLogout = (e) => {
        localStorage.setItem("auth", "0");
        navigate('/');
    }

    return <>
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">:)</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button 
                        type="button" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleLogout}
                    >Logout</button>
                    <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Form
                    </h1>
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label htmlFor="page_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Page URL</label>
                            <input 
                                type="text" 
                                name="page_url" 
                                id="page_url" 
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${validErrors.page_url && `border-orange-600`} `} 
                                required  
                                onChange={handleChange}
                                value={formData.page_url}
                            />
                            {
                                validErrors.page_url &&
                                <p className="text-red-500 text-xs">{validErrors.page_url}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="position" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Position</label>
                            <input 
                                type="text" 
                                name="position" 
                                id="position" 
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${validErrors.position && `border-orange-600`} `} 
                                required   
                                onChange={handleChange}
                                value={formData.position}
                            />
                            {
                                validErrors.position &&
                                <p className="text-red-500 text-xs">{validErrors.position}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="org_content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Original Content</label>
                            <textarea 
                                type="text" 
                                name="org_content" 
                                id="org_content" 
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${validErrors.org_content && `border-orange-600`} `} 
                                required   
                                onChange={handleChange}
                                value={formData.org_content}
                                rows={4}
                            />
                            {
                                validErrors.org_content &&
                                <p className="text-red-500 text-xs">{validErrors.org_content}</p>
                            }
                        </div>
                        <div>
                            <label htmlFor="key" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Key</label>
                            <input 
                                type="text" 
                                name="key" 
                                id="key" 
                                className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${validErrors.key && `border-orange-600`} `} 
                                required   
                                onChange={handleChange}
                                value={formData.key}
                            />
                            {
                                validErrors.key &&
                                <p className="text-red-500 text-xs">{validErrors.key}</p>
                            }
                        </div>
                        <button type="submit" className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-primary-800"
                            onClick={handleSend}
                        >Send</button>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}

export default CheckForm;