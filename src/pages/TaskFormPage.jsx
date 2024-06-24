import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { createTask, deleteTask, updateTask, getTask} from '../api/tasks.api.js'
import { useNavigate,useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'

//averiguar librerias o bibliotecas que se unen a react hook form, yup y zod

export function TaskFormPage() {
  
  const {register, handleSubmit, formState : { errors}, setValue} = useForm();
  const navigate = useNavigate()
  const params = useParams()


  const onSubmit = handleSubmit(async data => {
      if (params.id) {
        await updateTask(params.id, data)
        toast.success('task updated', {
          position: "bottom-right",
          style: {
            background: "#101010",
            color: "#fff",
          }
      })
      } else {
        await createTask(data);
        toast.success('task created', {
          position: "bottom-right",
          style: {
            background: "#101010",
            color: "#fff",
          }
      })
      }
    navigate('/tasks');
  })

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const {data: {title, description}} = await getTask(params.id)
        setValue('title', title)
        setValue('description', description)
      }
    }
    loadTask();  
  }, [])

  

  return (
    <div className='max-w-xl mx-auto'>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Title" 
          {...register("title", { required : true})}
          className='bg-zinc-700 p-r rounded-lg blck w-full mb-3 p-2'
        />
        {errors.title && <span>THIS FIELD IS REQUIRED</span>}
        <textarea rows="3" placeholder="Description"
          {...register("description", { required : true})}
          className='bg-zinc-700 p-r rounded-lg blck w-full mb-3 p-2'
        ></textarea>
        {errors.description && <span>THIS FIELD IS REQUIRED</span>}
        <button className='bg-indigo-500 p-3 rounded-lg bock w-full mt-3'>Save</button>
      </form>

      {params.id && (
        <div className='flex justify-end'>
        <button className="bg-red-500 p-3 rounded-lg w-48 mt-3" onClick={async ()=> {
        const accept = window.confirm('Are you sure you want to delete?')
        if (accept) {
          await deleteTask(params.id)
          toast.success('TASK DONE', {
            position: "bottom-right",
            style: {
              background: "#101010",
              color: "#fff",
            }
        })
          navigate('/tasks')
        }
      }}>Mark as Done</button>
      </div>)
      
      }

    </div>
  )
}

