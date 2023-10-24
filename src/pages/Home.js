import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import * as Yup from 'yup';
import { authHeader, fetchWrapper } from '../helpers/fetch-wrapper';
import { baseURL } from '../helpers';

function Home() {
  const [tasks, setTasks] = useState([]);
  const authUser = useSelector(x => x.auth.user);
  // form validation rules 
  const validationSchema = Yup.object().shape({
    text: Yup.string().min(6).max(100).required('Text is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);

  const { errors, isSubmitting } = formState;
  // const localData = JSON.parse(localStorage.getItem('user'));

  const onAdd = ({ text }) => {
    fetchWrapper.post(`${baseURL}/tasks`, { text, userId: authUser.id }).then((res) => {
      setTasks(oldTasks => {
        return [...oldTasks, res];
      })
    });
  }
  const handleDelete = (taskId) => {
    fetchWrapper.delete(`${baseURL}/tasks/${taskId}`).then(() => {
      setTasks((oldTasks) => {
        const newTasks = oldTasks.filter((t) => t._id !== taskId);
        return newTasks;
      });
    });
  }
  // get functions to build form with useForm() hook
  useEffect(() => {
    fetchWrapper.get(`${baseURL}/tasks`).then(res => setTasks(res));
  }, []);
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
            <button disabled={isSubmitting} className="btn btn-primary mb-1">
              {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
              Add task
            </button>
          </form>
          <div className='task-list'>
            {tasks.length > 0 &&
              tasks.map(t => {
                return <div className='task-item'>
                  <span className='task-text'>{t.text}</span>
                  <button onClick={() => handleDelete(t._id)} className='task-delete btn btn-danger'>Delete</button>
                </div>
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export { Home };
