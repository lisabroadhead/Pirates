import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Form from '../components/Form';
import Banner from '../components/Banner'

const EditPriate = (props) => {
    const history = useHistory();
    const { id } = useParams();
    const [form,setForm] = useState({})
    const [mates,steMates] = useState([])

    const [dbError,setDBError] = useState({ })
    const [error,setError] = useState({
        name: true,
        crew: true
    })

    useEffect(() => {
        axios.get(`http://localhost:8000/api/pirate/${id}`).then(response=>{
            setForm(response.data.pirate);
            steMates([response.data.pirate.mates])
        })
        .catch(err => {
            history.push("/404");
        });
    }, [id]);


    const onSubmitHandler = (event) => {
        event.preventDefault();
        axios.patch(`http://localhost:8000/api/edit/pirate/${id}`, form)
            .then(res =>  { 
                history.push(`/pirate/${id}`); 
                
            })
            .catch(err => {
                setDBError(err.response.data.error.errors)
            });
    }

    return(
        <>
            <Banner title={form.name} page="editbanner" member={form.crew} subtitle="Edit" />
            <div>
                <Form  title={`Edit Pirate: ${form.name}`} form={form} setForm={setForm} onSubmitHandler={onSubmitHandler} dbError={dbError} error={error} setError={setError} mates={mates}/>
            </div>
        </>
    )
}

export default EditPriate;