import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { conceptService } from '../_services/concept.service';
import { alertService } from '../_services/alert.service';

function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    
    // form validation rules 
    const validationSchema = Yup.object().shape({
        displayName: Yup.string()
            .required('Name is required')
            .max(50, 'Name can not exceed 50 characters'),
        description: Yup.string()
            .max(200, 'Description can not exceed 200 characters'),
        alternateNames: Yup.string()
            .max(200, 'Alternate names can not exceed 200 characters')
    });

    // functions to build form returned by useForm() hook
    const { register, handleSubmit, reset, setValue, errors, formState } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(validationSchema)
    });

    function onSubmit(data) {
        return isAddMode
            ? createConcept(data)
            : updateConcept(id, data);
    }

    function createConcept(data) {
        return conceptService.create(data)
            .then(() => {
                alertService.success('Concept added', { keepAfterRouteChange: true });
                //history.push('.');
            })
            .catch(alertService.error);
    }

    function updateConcept(id, data) {
        return conceptService.update(id, data)
            .then(() => {
                alertService.success('Concept updated', { keepAfterRouteChange: true });
                //history.push('..');
            })
            .catch(alertService.error);
    }

    const [concept, setConcept] = useState({});

    useEffect(() => {
        if (!isAddMode) {
            // get concept and set form fields
            conceptService.getById(id).then(concept => {
                const fields = ['displayName', 'description', 'parents', 'children', 'alternateNames'];
                fields.forEach(field => {
                    setValue(field, concept[field])
                    //dispatch({field: field, value: concept[field]})
                });
                setConcept(concept);
            });
        }
    }, [id, isAddMode, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} onReset={reset}>
            <h1>{isAddMode ? 'Add Concept' : 'Edit Concept'}</h1>
            <div className="form-row">
                <div className="form-group col-3">
                    <label>Name</label>
                    <input name="displayName" type="text" ref={register} className={`form-control ${errors.displayName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.displayName?.message}</div>
                </div>
                <div className="form-group col-7">
                    <label>Alternate Names</label>
                    <input name="alternateNames" type="text" ref={register} className={`form-control ${errors.alternateNames ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.alternateNames?.message}</div>
                </div>
            </div>
            <div className="form-row">
            <div className="form-group col-10">
                    <label>Description</label>
                    <input name="description" type="text" ref={register} className={`form-control ${errors.description ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-5">
                    <label>Parent Concepts</label>
                    <input name="parents" type="text" ref={register} className="form-control" />
                </div>
                <div className="form-group col-5">
                    <label>Children Concepts</label>
                    <input name="children" type="text" ref={register} className="form-control" />
                </div>
            </div>
            <div className="form-group">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                    Save
                </button>
                <Link to="/concepts" className="btn btn-link">Close</Link>
            </div>
        </form>
    );
}

export { AddEdit };