import Task from "../models/Task.js";

// Create Task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !status) {
      return res.status(400).json({ message: "Title and status are required" });
    }

    const task = await Task.create({ title, description, status });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// Get All Tasks (filter, sort, search, pagination)
export const getTasks = async (req, res, next) => {
  try {
    const { status, search, sort, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: "i" };

    let tasksQuery = Task.find(query);

    if (sort === "latest") {
      tasksQuery = tasksQuery.sort({ createdAt: -1 });
    }

    const skip = (page - 1) * limit;
    const total = await Task.countDocuments(query);

    const tasks = await tasksQuery.skip(skip).limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Task
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Update Task
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// Delete Task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
