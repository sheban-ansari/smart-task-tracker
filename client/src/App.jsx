import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const API = "http://localhost:5000";

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    priority: "Medium",
    assignedTo: "",
    dueDate: "",
    description: "",
  });

  const getTasks = async () => {
    const res = await axios.get(`${API}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async () => {
    if (!form.title.trim()) return;

    await axios.post(`${API}/tasks`, {
      ...form,
      status: "Todo",
    });

    setForm({
      title: "",
      priority: "Medium",
      assignedTo: "",
      dueDate: "",
      description: "",
    });

    getTasks();
  };

  const updateStatus = async (task) => {
    const newStatus =
      task.status === "Todo"
        ? "In Progress"
        : task.status === "In Progress"
          ? "Done"
          : "Todo";

    await axios.put(`${API}/tasks/${task._id}`, {
      ...task,
      status: newStatus,
    });

    getTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/tasks/${id}`);
    getTasks();
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "No date";

  const isOverdue = (date) =>
    date && new Date(date) < new Date();

  const filteredTasks = tasks.filter((t) => {
    return (
      t.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || t.priority === filter)
    );
  });

  const columns = ["Todo", "In Progress", "Done"];

  const getPriorityColor = (p) => {
    if (p === "High") return "bg-red-500 shadow-red-500/50";
    if (p === "Medium") return "bg-yellow-500 shadow-yellow-500/50";
    return "bg-green-500 shadow-green-500/50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-white">🚀</span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Task Tracker
          </span>
        </h1>
        <p className="text-sm text-gray-400 text-right hidden sm:block">
          👋 Welcome back, Sheban Ansari
        </p>

        <p className="text-sm text-gray-400 text-right sm:hidden">
          👋 Sheban
        </p>
      </div>

      {/* STATS */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className="bg-blue-500/20 px-4 py-2 rounded-lg backdrop-blur">
          Total: {tasks.length}
        </div>
        <div className="bg-green-500/20 px-4 py-2 rounded-lg backdrop-blur">
          Done: {tasks.filter(t => t.status === "Done").length}
        </div>
        <div className="bg-yellow-500/20 px-4 py-2 rounded-lg backdrop-blur">
          Progress: {tasks.filter(t => t.status === "In Progress").length}
        </div>
        <div className="bg-red-500/20 px-4 py-2 rounded-lg backdrop-blur">
          Todo: {tasks.filter(t => t.status === "Todo").length}
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-6 justify-center">
        <input
          className="p-2 rounded text-black"
          placeholder="Search task..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 rounded text-black"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {/* FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
        className="grid md:grid-cols-5 gap-3 mb-6"
      >
        <input
          className="p-2 text-black rounded"
          placeholder="Task"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          className="p-2 text-black rounded"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          className="p-2 text-black rounded"
          placeholder="Assign"
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
        />

        <input
          type="date"
          className="p-2 text-black rounded"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        <input
          className="p-2 text-black rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded col-span-1 md:col-span-5 transition"
        >
          ➕ Add Task
        </button>
      </form>

      {/* COLUMNS */}
      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div
            key={col}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl"
          >
            <h2 className="text-xl mb-4">{col}</h2>

            {filteredTasks
              .filter((t) => t.status === col)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white/10 backdrop-blur p-4 mb-3 rounded-lg hover:scale-105 hover:shadow-2xl transition"
                >
                  <p className="font-bold text-lg">{task.title}</p>

                  <p className="text-sm text-gray-300">
                    {task.description}
                  </p>

                  <p className="text-sm mt-1">
                    👤 {task.assignedTo || "Unassigned"}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded shadow ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </span>

                  <p className="text-sm mt-1">
                    📅 {formatDate(task.dueDate)}
                  </p>

                  {isOverdue(task.dueDate) && (
                    <p className="text-red-400 text-xs">
                      ⚠️ Overdue
                    </p>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => updateStatus(task)}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
                    >
                      Move
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;