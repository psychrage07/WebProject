const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignee', 'name email').populate('creator', 'name email').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'name email').populate('creator', 'name email');
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee } = req.body;
    
    // Optional role check: if you only want admin to create tasks you could add validation here, 
    // but typically any team member can create a task in a MERN app depending on requirements.
    
    const task = new Task({
      title,
      description,
      status,
      priority,
      assignee: assignee || null,
      creator: req.user._id,
    });

    const createdTask = await task.save();
    // populate before returning
    const fullyPopulatedTask = await Task.findById(createdTask._id).populate('assignee', 'name email').populate('creator', 'name email');
    
    res.status(201).json(fullyPopulatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee } = req.body;

    const task = await Task.findById(req.params.id);

    if (task) {
      task.title = title !== undefined ? title : task.title;
      task.description = description !== undefined ? description : task.description;
      task.status = status !== undefined ? status : task.status;
      task.priority = priority !== undefined ? priority : task.priority;
      task.assignee = assignee !== undefined ? assignee : task.assignee;

      const updatedTask = await task.save();
      const fullyPopulatedTask = await Task.findById(updatedTask._id).populate('assignee', 'name email').populate('creator', 'name email');
      res.json(fullyPopulatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      // Check if user is admin or the creator of the task
      if (req.user.role !== 'admin' && task.creator.toString() !== req.user._id.toString()) {
         return res.status(403).json({ message: 'Not authorized to delete this task' });
      }

      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };