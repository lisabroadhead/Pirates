// import axios from 'axios';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const RegistrationForm = props => {
    const history = useHistory();

    const [dbError,setDBError] = useState({ id:0 })
    var errorSize = Object.keys(dbError).length;
    
    const [form,setForm] = useState({})

    const [error,setError] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false
    })

    const lengths = {
        firstName: 3,
        lastName: 3,
        password: 8
    }

    function ValidateEmail(event) {
        setForm({...form,[event.target.name]:event.target.value})
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)){
            setError({...error, email: true})
        }else{
            setError({...error, email: false})
        }
    }

    const onPasswordHandler = (event) => {
        setForm({...form,[event.target.name]: event.target.value})

        if(event.target.value.length < 8 ){
            setError({...error, password: false})
        }else{
            setError({...error, password: true})
        }
    }

    const onConfirmPasswordHandler = (event) => {
        setForm({...form,[event.target.name]: event.target.value})

        if(form.password === event.target.value){
            setError({...error, confirmPassword: true})
        }else{
            setError({...error, confirmPassword: false})
        }
    }

    const onChangeHandlerWelcome = (event) => {
        setForm({...form,[event.target.name]: event.target.value})
        
        if(event.target.name in error){
            if(event.target.value.length >= lengths[event.target.name]){
                setError({...error,[event.target.name]:true})
            }else{
                setError({...error,[event.target.name]:false})
            }
        }
    }

    const onSubmitHandlerWelcome = (event) =>{
        event.preventDefault();

        axios.post(`http://localhost:8000/api/create/user`,form).then(response=>{
            localStorage.setItem('name', form.firstName);
            history.push("/pirates"); 
        })
        .catch(err => {
            setDBError(err.response.data.error.errors)
        });
    }

    return(
        <>
            <form onSubmit={onSubmitHandlerWelcome} >
                <div className="errWrp">
                    {
                        errorSize > 1 ? <><h4>Entries Required: </h4> {Object.keys(dbError).join(', ')}</> : ""
                    }
                </div>

                <div>
                    <label htmlFor="firstName">First Name: </label>
                    <input type="text"  name="firstName" value={form.firstName} placeholder="First Name" onChange={onChangeHandlerWelcome} />
                    {
                        error.firstName ? "" : <span>Please enter a first name</span>
                    }
                </div>

                <div>
                    <label htmlFor="lastName">Last Name: </label>
                    <input type="text"  name="lastName" value={form.lastName} placeholder="Last Name" onChange={onChangeHandlerWelcome} />
                    {
                        error.lastName ? "" : <span>Please enter a last name</span>
                    }
                </div>

                <div>
                    <label htmlFor="email">Email: </label>
                    <input type="email"  name="email" value={form.email} placeholder="Email" onChange={ValidateEmail} />
                    {
                        error.email ? "" : <span>Please enter an email</span>
                    }
                </div>

                <div>
                    <label htmlFor="password">Password: </label>
                    <input type="password"  name="password" value={form.password} placeholder="Password" onChange={onPasswordHandler} />
                    {
                        error.password ? "" : <span>Please enter a password</span>
                    }
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password: </label>
                    <input type="password"  name="confirmPassword" value={form.confirmPassword} placeholder="Confirm Password" onChange={onConfirmPasswordHandler} />
                    {
                        error.confirmPassword ? "" : <span>Passwords must match</span>
                    }
                </div>

                
                {
                    Object.keys(error).every((item) => error[item]) ? <input type="submit" value="Create Account" className="submit" /> : <input type="submit" value="Create Account" disabled className="disabled" />
                }

            </form>
        </>
    )
}

export default RegistrationForm;