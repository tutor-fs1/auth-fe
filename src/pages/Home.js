import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { authHeader, fetchWrapper } from '../helpers/fetch-wrapper';
import { baseURL } from '../helpers';

function Home() {
  const authUser = useSelector(x => x.auth.user);
  // form validation rules 
  const validationSchema = Yup.object().shape({
    text: Yup.string().min(6).max(100).required('Text is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);

  const { errors, isSubmitting } = formState;
  const localData = JSON.parse(localStorage.getItem('user'));

  const onAdd = ({ text }) => {
    fetchWrapper.post(`${baseURL}/tasks`, { text, userId: authUser.id });
  }
  // get functions to build form with useForm() hook
  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card">
        <h4 className="card-header">Tasks</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onAdd)}>
            <div className="form-group">
              <label>Task text</label>
              <input name="text" type="text" {...register('text')} className={`form-control ${errors.text ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.text?.message}</div>
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Add task
            </button>
            {/* {authError &&
              <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
            } */}
          </form>
        </div>
      </div>
    </div>
  );
}

export { Home };
