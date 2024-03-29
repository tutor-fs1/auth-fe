import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';

import { history } from '../helpers/history';
import { authActions } from '../redux';
import { NavLink } from 'react-router-dom';

export { Login };

function Login() {
  const dispatch = useDispatch();
  const authUser = useSelector(x => x.auth.user);
  const authError = useSelector(x => x.auth.error);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate('/');

  }, []);

  // form validation rules 
  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required'),
    pass: Yup.string().required('Password is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ email, pass }) {
    return dispatch(authActions.login({ email, pass }));
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card">
        <h4 className="card-header">Login</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.email?.message}</div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" {...register('pass')} className={`form-control ${errors.pass ? 'is-invalid' : ''}`} />
              <div className="invalid-feedback">{errors.pass?.message}</div>
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Login
            </button>
            {authError &&
              <div className="alert alert-danger mt-3 mb-0">{authError.message}</div>
            }
            <p>No account? <NavLink to="/register">Register</NavLink></p>
          </form>
        </div>
      </div>
    </div>
  )
}
