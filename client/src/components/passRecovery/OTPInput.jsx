import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function OTPVerification(props) {
    const [timerCount, setTimer] = useState(60);
    const [OTPinput, setOTPinput] = useState(["", "", "", ""]);
    const [disable, setDisable] = useState(true);
    const inputRefs = [useRef(), useRef(), useRef(), useRef()];

    useEffect(() => {
        const timer = setInterval(() => {
            if (timerCount > 0 && disable) {
                setTimer((prev) => prev - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timerCount, disable]);

    function resendOTP() {
        if (disable) return;
        axios
            .post("http://localhost:4000/recoverPassword", {
                email: props.userEmail,
            })
            .then(() => {
                setDisable(true);
                setTimer(60);
            })
            .then(() => alert("A new OTP has successfully been sent to your email."))
            .catch(console.log);
    }

    function verifyOTP(e) {
        e.preventDefault();
        const enteredOTP = parseInt(OTPinput.join(""));
        console.log("opt user" + enteredOTP);
        console.log("opt server" + props.OTP);

        if (!isNaN(enteredOTP) && enteredOTP === props.OTP) {
            console.log("otp is correct");
            props.setValidOTP(true);
            props.navigateToPasswordReset();
        } else {
            alert("The code you have entered is not correct, try again or re-send the link");
        }
    }

    const handleInputChange = (index, value) => {
        if (!isNaN(value)) {
            setOTPinput((prev) => {
                const newInputs = Array.from(prev);
                newInputs[index] = value;
                return newInputs;
            });
    
            if (index < inputRefs.length - 1 && value !== "") {
                inputRefs[index + 1].current.focus();
            } else if(index <= inputRefs.length - 1 && value === "" && index !== 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };
    
    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
            <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-3xl">
                            <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-400">
                            <p>We have sent a code to your email {props.userEmail}</p>
                        </div>
                    </div>
                    <div>
                        <form onSubmit={(e) => verifyOTP(e)}>
                            <div className="flex flex-col space-y-16">
                                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                                    {inputRefs.map((ref, index) => (
                                        <div className="w-16 h-16" key={index}>
                                            <input
                                                maxLength="1"
                                                className="w-full h-full flex flex-col items-center justify-center text-center outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="text"
                                                value={OTPinput[index]}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                ref={ref}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                                        >
                                            Verify Account
                                        </button>
                                    </div>

                                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                                        <p>Didn't receive code?</p>{" "}
                                        <button
                                            className="flex flex-row items-center"
                                            style={{
                                                color: disable ? "gray" : "blue",
                                                cursor: disable ? "none" : "pointer",
                                                textDecorationLine: disable ? "none" : "underline",
                                            }}
                                            onClick={() => resendOTP()}
                                        >
                                            {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
