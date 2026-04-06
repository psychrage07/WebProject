import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Trash2, Save } from 'lucide-react';
import gsap from 'gsap';

const TaskModal = ({ task, onClose, refreshTasks, users }) => {
  const { user } = useContext(AuthContext);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignee: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee?._id || ''
      });
    }
  }, [task]);

  // GSAP Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (task) {
        await axios.put(`https://webproject-1906.onrender.com/api/tasks/${task._id}`, formData, config);
      } else {
        await axios.post('https://webproject-1906.onrender.com/api/tasks', formData, config);
      }
      refreshTasks();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`https://webproject-1906.onrender.com/api/tasks/${task._id}`, config);
      refreshTasks();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div ref={overlayRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div ref={modalRef} className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input 
              type="text" 
              className="input-field" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>
          
          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea 
              className="input-field" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="4"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label className="input-label">Status</label>
              <select 
                className="input-field select-field"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option className="option-dark" value="Todo">Todo</option>
                <option className="option-dark" value="In Progress">In Progress</option>
                <option className="option-dark" value="Done">Done</option>
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label className="input-label">Priority</label>
              <select 
                className="input-field select-field"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option className="option-dark" value="Low">Low</option>
                <option className="option-dark" value="Medium">Medium</option>
                <option className="option-dark" value="High">High</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Assignee</label>
            <select 
              className="input-field select-field"
              value={formData.assignee}
              onChange={(e) => setFormData({...formData, assignee: e.target.value})}
            >
              <option className="option-dark" value="">Unassigned</option>
              {users.map(u => (
                <option key={u._id} className="option-dark" value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            {task && (
              <button type="button" onClick={handleDelete} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                <Trash2 size={20} />
                Delete
              </button>
            )}
            <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
              <button type="submit" className="btn btn-primary">
                <Save size={20} />
                {task ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
