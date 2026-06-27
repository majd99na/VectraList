import { useState, useEffect } from "react";
import {
  FaFilter,
  FaDownload,
  FaUpload,
  FaTrash,
  FaCheck,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { generate } from "short-uuid";

const ManageTodos = () => {
  const initialTodos = [
    {
      id: generate(),
      title: "Complete project proposal",
      category: "Work",
      priority: "High",
      status: "In Progress",
      dueDate: "2026-07-01",
      createdAt: "2026-06-20",
    },
    {
      id: generate(),
      title: "Review team submissions",
      category: "Work",
      priority: "Medium",
      status: "Pending",
      dueDate: "2026-07-05",
      createdAt: "2026-06-22",
    },
    {
      id: generate(),
      title: "Schedule client call",
      category: "Business",
      priority: "High",
      status: "Pending",
      dueDate: "2026-06-28",
      createdAt: "2026-06-23",
    },
    {
      id: generate(),
      title: "Buy groceries for weekend",
      category: "Personal",
      priority: "Low",
      status: "Completed",
      dueDate: "2026-06-26",
      createdAt: "2026-06-24",
    },
    {
      id: generate(),
      title: "Gym workout session",
      category: "Health",
      priority: "Medium",
      status: "In Progress",
      dueDate: "2026-06-27",
      createdAt: "2026-06-25",
    },
    {
      id: generate(),
      title: "Write blog post",
      category: "Personal",
      priority: "Medium",
      status: "In Progress",
      dueDate: "2026-07-10",
      createdAt: "2026-06-20",
    },
    {
      id: generate(),
      title: "Team meeting preparation",
      category: "Work",
      priority: "High",
      status: "Completed",
      dueDate: "2026-06-24",
      createdAt: "2026-06-18",
    },
    {
      id: generate(),
      title: "Dentist appointment",
      category: "Health",
      priority: "High",
      status: "Pending",
      dueDate: "2026-07-15",
      createdAt: "2026-06-21",
    },
  ];

  const [todos, setTodos] = useState(initialTodos);
  const [filteredTodos, setFilteredTodos] = useState(initialTodos);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    category: "All",
    priority: "All",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc",
  });
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");

  const categories = ["Work", "Personal", "Business", "Health", "Other"];
  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Pending", "In Progress", "Completed"];

  useEffect(() => {
    let result = [...todos];

    if (searchTerm) {
      result = result.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.status !== "All") {
      result = result.filter((todo) => todo.status === filters.status);
    }
    if (filters.category !== "All") {
      result = result.filter((todo) => todo.category === filters.category);
    }
    if (filters.priority !== "All") {
      result = result.filter((todo) => todo.priority === filters.priority);
    }

    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredTodos(result);
  }, [todos, searchTerm, filters, sortConfig]);

  useEffect(() => {
    setShowBulkActions(selectedTodos.length > 0);
  }, [selectedTodos]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTodos(filteredTodos.map((todo) => todo.id));
    } else {
      setSelectedTodos([]);
    }
  };

  const handleSelectTodo = (todoId) => {
    setSelectedTodos((prev) =>
      prev.includes(todoId)
        ? prev.filter((id) => id !== todoId)
        : [...prev, todoId],
    );
  };

  const handleBulkStatusUpdate = () => {
    if (bulkStatus) {
      setTodos(
        todos.map((todo) =>
          selectedTodos.includes(todo.id)
            ? { ...todo, status: bulkStatus }
            : todo,
        ),
      );
      setSelectedTodos([]);
      setBulkStatus("");
    }
  };

  const handleBulkDelete = () => {
    if (
      selectedTodos.length > 0 &&
      window.confirm(`Delete ${selectedTodos.length} todos?`)
    ) {
      setTodos(todos.filter((todo) => !selectedTodos.includes(todo.id)));
      setSelectedTodos([]);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "priority-high";
      case "Medium":
        return "priority-medium";
      case "Low":
        return "priority-low";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "In Progress":
        return "status-inprogress";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <FaSortAmountUp />
    ) : (
      <FaSortAmountDown />
    );
  };

  const analytics = {
    total: todos.length,
    completionRate:
      todos.length > 0
        ? Math.round(
            (todos.filter((t) => t.status === "Completed").length /
              todos.length) *
              100,
          )
        : 0,
    overdue: todos.filter(
      (t) => t.status !== "Completed" && new Date(t.dueDate) < new Date(),
    ).length,
    upcoming: todos.filter(
      (t) => t.status !== "Completed" && new Date(t.dueDate) >= new Date(),
    ).length,
  };

  return (
    <div className="custom-manage-page">
      <div className="custom-manage-container">
        <div className="custom-manage-header">
          <div>
            <h1>Manage Todos</h1>
            <p>Advanced management and analytics for all your tasks</p>
          </div>
          <div className="custom-header-actions">
            <button
              onClick={handleExport}
              className="custom-btn custom-btn-secondary"
            >
              <FaDownload /> Export
            </button>
            <button className="custom-btn custom-btn-secondary">
              <FaUpload /> Import
            </button>
          </div>
        </div>

        <div className="custom-analytics-grid">
          <div className="custom-analytics-card">
            <h3>Total Todos</h3>
            <p className="custom-analytics-number">{analytics.total}</p>
          </div>
          <div className="custom-analytics-card custom-analytics-success">
            <h3>Completion Rate</h3>
            <p className="custom-analytics-number">
              {analytics.completionRate}%
            </p>
          </div>
          <div className="custom-analytics-card custom-analytics-warning">
            <h3>Overdue</h3>
            <p className="custom-analytics-number">{analytics.overdue}</p>
          </div>
          <div className="custom-analytics-card custom-analytics-info">
            <h3>Upcoming</h3>
            <p className="custom-analytics-number">{analytics.upcoming}</p>
          </div>
        </div>

        {showBulkActions && (
          <div className="custom-bulk-actions-bar">
            <span>{selectedTodos.length} todos selected</span>
            <div className="custom-bulk-actions">
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="custom-bulk-select"
              >
                <option value="">Change Status...</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {bulkStatus && (
                <button
                  onClick={handleBulkStatusUpdate}
                  className="custom-btn custom-btn-primary custom-btn-sm"
                >
                  <FaCheck /> Apply
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                className="custom-btn custom-btn-danger custom-btn-sm"
              >
                <FaTrash /> Delete All
              </button>
            </div>
          </div>
        )}

        <div className="custom-advanced-filters">
          <div className="custom-search-wrapper">
            <FaSearch className="custom-search-icon" />
            <input
              type="text"
              placeholder="Search all todos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-search-input"
            />
          </div>

          <div className="custom-filter-group">
            <FaFilter className="custom-filter-icon" />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="custom-filter-select"
            >
              <option value="All">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="custom-filter-group">
            <FaFilter className="custom-filter-icon" />
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="custom-filter-select"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="custom-filter-group">
            <FaFilter className="custom-filter-icon" />
            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters({ ...filters, priority: e.target.value })
              }
              className="custom-filter-select"
            >
              <option value="All">All Priorities</option>
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {pri}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-manage-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedTodos.length === filteredTodos.length &&
                      filteredTodos.length > 0
                    }
                  />
                </th>
                <th
                  onClick={() => handleSort("title")}
                  className="custom-sortable-header"
                >
                  Title <SortIcon column="title" />
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="custom-sortable-header"
                >
                  Category <SortIcon column="category" />
                </th>
                <th
                  onClick={() => handleSort("priority")}
                  className="custom-sortable-header"
                >
                  Priority <SortIcon column="priority" />
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="custom-sortable-header"
                >
                  Status <SortIcon column="status" />
                </th>
                <th
                  onClick={() => handleSort("dueDate")}
                  className="custom-sortable-header"
                >
                  Due Date <SortIcon column="dueDate" />
                </th>
                <th
                  onClick={() => handleSort("createdAt")}
                  className="custom-sortable-header"
                >
                  Created <SortIcon column="createdAt" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.map((todo) => (
                <tr
                  key={todo.id}
                  className={
                    selectedTodos.includes(todo.id) ? "custom-selected-row" : ""
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedTodos.includes(todo.id)}
                      onChange={() => handleSelectTodo(todo.id)}
                    />
                  </td>
                  <td>
                    <div className="custom-todo-title-cell">
                      <strong>{todo.title}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="custom-category-badge">
                      {todo.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`custom-priority-badge ${getPriorityColor(todo.priority)}`}
                    >
                      {todo.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`custom-status-badge ${getStatusColor(todo.status)}`}
                    >
                      {todo.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        new Date(todo.dueDate) < new Date() &&
                        todo.status !== "Completed"
                          ? "custom-overdue-date"
                          : ""
                      }
                    >
                      {todo.dueDate}
                    </span>
                  </td>
                  <td>{todo.createdAt}</td>
                </tr>
              ))}
              {filteredTodos.length === 0 && (
                <tr>
                  <td colSpan="7" className="custom-empty-state">
                    No todos match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="custom-category-breakdown">
          <h2>Category Distribution</h2>
          <div className="custom-breakdown-grid">
            {categories.map((category) => {
              const categoryTodos = todos.filter(
                (t) => t.category === category,
              );
              const percentage =
                todos.length > 0
                  ? Math.round((categoryTodos.length / todos.length) * 100)
                  : 0;
              return (
                <div key={category} className="custom-category-stat">
                  <div className="custom-category-info">
                    <span className="custom-category-name">{category}</span>
                    <span className="custom-category-count">
                      {categoryTodos.length} ({percentage}%)
                    </span>
                  </div>
                  <div className="custom-progress-bar">
                    <div
                      className="custom-progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTodos;
