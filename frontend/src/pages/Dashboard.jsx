import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, LogOut, CheckCircle2, Clock, CircleDot } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import gsap from 'gsap';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [users, setUsers] = useState([]);
  const containerRef = useRef(null);

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://webproject-1906.onrender.com/api/tasks', config);
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('https://webproject-1906.onrender.com/api/auth/users', config);
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [user]);

  // GSAP Animation Effect
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header and column containers
      gsap.fromTo('header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
      
      gsap.fromTo('.dashboard-column',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.2, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Animate tasks when they load
  useEffect(() => {
    if (tasks.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo('.task-card',
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [tasks.length]);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Done': return <CheckCircle2 size={16} color="var(--status-done)" />;
      case 'In Progress': return <Clock size={16} color="var(--status-progress)" />;
      default: return <CircleDot size={16} color="var(--status-todo)" />;
    }
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div ref={containerRef} style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700' }} className="gradient-text">TaskFlow</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={20} />
            New Task
          </button>
          <button onClick={logout} className="btn btn-secondary">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {columns.map(status => (
          <div key={status} className="glass-panel dashboard-column" style={{ padding: '1.5rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
               {getStatusIcon(status)}
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{status}</h3>
              <span style={{ marginLeft: 'auto', background: 'var(--bg-secondary)', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === status).map(task => (
                <div 
                  key={task._id} 
                  className="glass-panel task-card" 
                  style={{ padding: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s', borderLeft: `3px solid var(--status-${status.replace(' ', '').toLowerCase()})` }}
                  onClick={() => openEditModal(task)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {task.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      background: task.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : task.priority === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                    }}>
                      {task.priority}
                    </span>
                    <span>{task.assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal 
          task={currentTask} 
          onClose={() => setIsModalOpen(false)} 
          refreshTasks={fetchTasks}
          users={users}
        />
      )}
    </div>
  );
};

export default Dashboard;
