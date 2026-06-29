import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaFilter,
  FaDownload,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { generate } from "short-uuid";
import { useDataApi } from "../Contexts/DataAPI";
import { Spinner } from "react-bootstrap";

const Dashboard = () => {
  const { todos, loadingTodos, addTodo, editTodo, deleteTodo } = useDataApi();
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setIsModalOpen(false), 300);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const [filters, setFilters] = useState({
    status: "All",
    category: "All",
    priority: "All",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "due_at",
    direction: "asc",
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [openBulkDropdown, setOpenBulkDropdown] = useState(null); // Track bulk actions dropdown
  const [openModalDropdown, setOpenModalDropdown] = useState(null); // Track modal dropdowns
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores todo ID for single, 'bulk' for bulk deletes

  // Delete modal helpers
  const openSingleDeleteModal = (todoId) => {
    setDeleteTarget(todoId);
    setShowDeleteModal(true);
    setTimeout(() => setIsDeleteModalVisible(true), 10);
  };

  const openBulkDeleteModal = () => {
    setDeleteTarget("bulk");
    setShowDeleteModal(true);
    setTimeout(() => setIsDeleteModalVisible(true), 10);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setTimeout(() => {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }, 300);
  };

  // Close bulk dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenBulkDropdown(null);
    if (openBulkDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openBulkDropdown]);
  const [formData, setFormData] = useState({
    todo: "",
    category: "",
    priority: "Medium",
    due_at: "",
  });

  // Close modal dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenModalDropdown(null);
    if (openModalDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openModalDropdown]);

  const categories = ["Work", "Personal", "Business", "Health", "Other"];
  const priorities = ["Low", "Medium", "High"];
  const statuses = ["Pending", "In Progress", "Completed"];
  useEffect(() => console.log(todos), [todos]);
  useEffect(() => {
    let result = [...todos];

    if (searchTerm) {
      result = result.filter((todo) =>
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase()),
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

    const priorityWeights = {
      Low: 1,
      Medium: 2,
      High: 3,
    };

    result.sort((a, b) => {
      let valueA, valueB;

      if (sortConfig.key === "priority") {
        valueA = priorityWeights[a.priority];
        valueB = priorityWeights[b.priority];
      } else {
        valueA = a[sortConfig.key];
        valueB = b[sortConfig.key];
      }

      if (valueA < valueB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredTodos(result);
  }, [todos, searchTerm, filters, sortConfig]);

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
      selectedTodos.forEach((todoId) => {
        editTodo(todoId, { status: bulkStatus });
      });
      setSelectedTodos([]);
      setBulkStatus("");
    }
  };

  const handleBulkDelete = () => {
    if (selectedTodos.length > 0) {
      openBulkDeleteModal();
    }
  };

  const confirmBulkDelete = () => {
    selectedTodos.forEach((todoId) => deleteTodo(todoId));
    setSelectedTodos([]);
    closeDeleteModal();
  };

  const handleDelete = (todoId) => {
    openSingleDeleteModal(todoId);
  };

  const confirmSingleDelete = () => {
    if (deleteTarget && typeof deleteTarget === "string") {
      deleteTodo(deleteTarget);
    }
    closeDeleteModal();
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      todo: todo.todo,
      category: todo.category,
      priority: todo.priority,
      due_at: todo.due_at,
    });
    setEditingTodo(todo.id);
    openModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTodo) {
      editTodo(editingTodo, formData);
    } else {
      addTodo(formData);
    }
    closeModal();
    setEditingTodo(null);
    setFormData({ todo: "", category: "", priority: "Medium", due_at: "" });
  };

  const handleStatusChange = (todoId, newStatus) => {
    setTodos(
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo,
      ),
    );
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
      (t) => t.status !== "Completed" && new Date(t.due_at) < new Date(),
    ).length,
    upcoming: todos.filter(
      (t) => t.status !== "Completed" && new Date(t.due_at) >= new Date(),
    ).length,
  };
  // if (loadingTodos)
  //   return (
  //     <div className="custom-center-content">
  //       <Spinner variant="warning" animation="border" />
  //     </div>
  //   );
  return (
    <div className="custom-dashboard-page">
      <div className="custom-dashboard-container">
        <div className="custom-dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your todos and track your progress</p>
          </div>
          <div className="custom-header-actions">
            <button
              onClick={handleExport}
              className="custom-btn custom-btn-secondary"
            >
              <FaDownload /> Export
            </button>
            <button
              onClick={openModal}
              className="custom-btn custom-btn-primary"
            >
              <FaPlus /> Add Todo
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

        {selectedTodos.length > 0 && (
          <div className="custom-bulk-actions-bar">
            <span>{selectedTodos.length} todos selected</span>
            <div className="custom-bulk-actions">
              <div
                className="custom-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="custom-dropdown-trigger"
                  onClick={() =>
                    setOpenBulkDropdown(
                      openBulkDropdown === "bulk-status" ? null : "bulk-status",
                    )
                  }
                  style={{
                    minWidth: "160px",
                    padding: "0.5rem 1rem",
                    background: "white",
                    color: "var(--bg-primary)",
                    fontSize: "0.9rem",
                  }}
                >
                  {bulkStatus || "Change Status..."}
                  <span>{openBulkDropdown === "bulk-status" ? "▲" : "▼"}</span>
                </div>
                <div
                  className={`custom-dropdown-menu ${openBulkDropdown === "bulk-status" ? "open" : ""}`}
                  style={{ background: "white", color: "var(--bg-primary)" }}
                >
                  <div
                    className={`custom-dropdown-item ${!bulkStatus ? "selected" : ""}`}
                    onClick={() => {
                      setBulkStatus("");
                      setOpenBulkDropdown(null);
                    }}
                    style={{ color: "var(--bg-primary)" }}
                  >
                    Change Status...
                  </div>
                  {statuses.map((status) => (
                    <div
                      key={status}
                      className={`custom-dropdown-item ${bulkStatus === status ? "selected" : ""}`}
                      onClick={() => {
                        setBulkStatus(status);
                        setOpenBulkDropdown(null);
                      }}
                      style={{
                        color: "var(--bg-primary)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f0f0f0")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      {status}
                    </div>
                  ))}
                </div>
              </div>
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
            <div
              className="custom-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="custom-dropdown-trigger"
                onClick={() =>
                  setOpenDropdown(openDropdown === "status" ? null : "status")
                }
              >
                {filters.status === "All" ? "All Status" : filters.status}
                <span>{openDropdown === "status" ? "▲" : "▼"}</span>
              </div>
              <div
                className={`custom-dropdown-menu ${openDropdown === "status" ? "open" : ""}`}
              >
                <div
                  className={`custom-dropdown-item ${filters.status === "All" ? "selected" : ""}`}
                  onClick={() => {
                    setFilters({ ...filters, status: "All" });
                    setOpenDropdown(null);
                  }}
                >
                  All Status
                </div>
                {statuses.map((status) => (
                  <div
                    key={status}
                    className={`custom-dropdown-item ${filters.status === status ? "selected" : ""}`}
                    onClick={() => {
                      setFilters({ ...filters, status: status });
                      setOpenDropdown(null);
                    }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="custom-filter-group">
            <FaFilter className="custom-filter-icon" />
            <div
              className="custom-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="custom-dropdown-trigger"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "category" ? null : "category",
                  )
                }
              >
                {filters.category === "All"
                  ? "All Categories"
                  : filters.category}
                <span>{openDropdown === "category" ? "▲" : "▼"}</span>
              </div>
              <div
                className={`custom-dropdown-menu ${openDropdown === "category" ? "open" : ""}`}
              >
                <div
                  className={`custom-dropdown-item ${filters.category === "All" ? "selected" : ""}`}
                  onClick={() => {
                    setFilters({ ...filters, category: "All" });
                    setOpenDropdown(null);
                  }}
                >
                  All Categories
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`custom-dropdown-item ${filters.category === cat ? "selected" : ""}`}
                    onClick={() => {
                      setFilters({ ...filters, category: cat });
                      setOpenDropdown(null);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="custom-filter-group">
            <FaFilter className="custom-filter-icon" />
            <div
              className="custom-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="custom-dropdown-trigger"
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "priority" ? null : "priority",
                  )
                }
              >
                {filters.priority === "All"
                  ? "All Priorities"
                  : filters.priority}
                <span>{openDropdown === "priority" ? "▲" : "▼"}</span>
              </div>
              <div
                className={`custom-dropdown-menu ${openDropdown === "priority" ? "open" : ""}`}
              >
                <div
                  className={`custom-dropdown-item ${filters.priority === "All" ? "selected" : ""}`}
                  onClick={() => {
                    setFilters({ ...filters, priority: "All" });
                    setOpenDropdown(null);
                  }}
                >
                  All Priorities
                </div>
                {priorities.map((pri) => (
                  <div
                    key={pri}
                    className={`custom-dropdown-item ${filters.priority === pri ? "selected" : ""}`}
                    onClick={() => {
                      setFilters({ ...filters, priority: pri });
                      setOpenDropdown(null);
                    }}
                  >
                    {pri}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="custom-table-container">
          <table className="custom-todos-table">
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
                  onClick={() => handleSort("todo")}
                  className="custom-sortable-header"
                >
                  Todo <SortIcon column="todo" />
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
                  onClick={() => handleSort("due_at")}
                  className="custom-sortable-header"
                >
                  Due Date <SortIcon column="due_at" />
                </th>
                <th
                  onClick={() => handleSort("created_at")}
                  className="custom-sortable-header"
                >
                  Created <SortIcon column="created_at" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <>
                {loadingTodos && (
                  <>
                    <tr className="loading-todos">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="loading-todos">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>
                )}
                {filteredTodos.map((todo) => (
                  <tr
                    key={todo.id}
                    className={
                      selectedTodos.includes(todo.id)
                        ? "custom-selected-row"
                        : ""
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
                      <div
                        className={`custom-todo-title-cell ${todo.status === "Completed" ? "completed-todo" : ""}`}
                      >
                        <strong>{todo.todo}</strong>
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
                          new Date(todo.due_at) < new Date() &&
                          todo.status !== "Completed"
                            ? "custom-overdue-date"
                            : ""
                        }
                      >
                        {Intl.DateTimeFormat("en-us", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).format(new Date(todo.due_at))}
                      </span>
                    </td>
                    <td>
                      {" "}
                      {Intl.DateTimeFormat("en-us", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }).format(new Date(todo.created_at))}
                    </td>
                    <td>
                      <div className="custom-action-buttons">
                        {todo.status !== "Completed" && (
                          <button
                            onClick={() =>
                              editTodo(todo.id, { status: "Completed" })
                            }
                            className="custom-btn custom-btn-success custom-btn-sm"
                            title="Mark as Completed"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(todo)}
                          className="custom-btn custom-btn-secondary custom-btn-sm"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="custom-btn custom-btn-danger custom-btn-sm"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>

              {filteredTodos.length === 0 && !loadingTodos && (
                <tr>
                  <td colSpan="9" className="custom-empty-state">
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

        {isModalOpen && (
          <div
            className={`custom-modal-overlay ${isModalVisible ? "active" : ""}`}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="custom-modal">
              <div className="custom-modal-header">
                <h2>{editingTodo ? "Edit Todo" : "Add New Todo"}</h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="custom-close-btn"
                >
                  &times;
                </button>
              </div>
              <form className="custom-modal-form" onSubmit={handleSubmit}>
                <div className="custom-form-group">
                  <label>Todo</label>
                  <input
                    type="text"
                    value={formData.todo}
                    onChange={(e) =>
                      setFormData({ ...formData, todo: e.target.value })
                    }
                    placeholder="What's on the agenda..."
                    required
                  />
                </div>
                <div className="custom-form-row">
                  <div className="custom-form-group">
                    <label>Category</label>
                    <div
                      className="custom-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="custom-dropdown-trigger"
                        onClick={() =>
                          setOpenModalDropdown(
                            openModalDropdown === "category"
                              ? null
                              : "category",
                          )
                        }
                        style={{ minWidth: "100%" }}
                      >
                        {formData.category || "Select category"}
                        <span>
                          {openModalDropdown === "category" ? "▲" : "▼"}
                        </span>
                      </div>
                      <div
                        className={`custom-dropdown-menu ${openModalDropdown === "category" ? "open" : ""}`}
                      >
                        <div
                          className={`custom-dropdown-item ${!formData.category ? "selected" : ""}`}
                          onClick={() => {
                            setFormData({ ...formData, category: "" });
                            setOpenModalDropdown(null);
                          }}
                        >
                          Select category
                        </div>
                        {categories.map((cat) => (
                          <div
                            key={cat}
                            className={`custom-dropdown-item ${formData.category === cat ? "selected" : ""}`}
                            onClick={() => {
                              setFormData({ ...formData, category: cat });
                              setOpenModalDropdown(null);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="custom-form-group">
                    <label>Priority</label>
                    <div
                      className="custom-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="custom-dropdown-trigger"
                        onClick={() =>
                          setOpenModalDropdown(
                            openModalDropdown === "priority"
                              ? null
                              : "priority",
                          )
                        }
                        style={{ minWidth: "100%" }}
                      >
                        {formData.priority}
                        <span>
                          {openModalDropdown === "priority" ? "▲" : "▼"}
                        </span>
                      </div>
                      <div
                        className={`custom-dropdown-menu ${openModalDropdown === "priority" ? "open" : ""}`}
                      >
                        {priorities.map((pri) => (
                          <div
                            key={pri}
                            className={`custom-dropdown-item ${formData.priority === pri ? "selected" : ""}`}
                            onClick={() => {
                              setFormData({ ...formData, priority: pri });
                              setOpenModalDropdown(null);
                            }}
                          >
                            {pri}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="custom-form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={
                      formData?.due_at
                        ? new Date(formData.due_at).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({ ...formData, due_at: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="custom-modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="custom-btn custom-btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="custom-btn custom-btn-primary"
                  >
                    <FaCheck /> {editingTodo ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className={`custom-modal-overlay ${isDeleteModalVisible ? "active" : ""}`}
            onClick={() => closeDeleteModal()}
          >
            <div
              className="custom-modal delete-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="custom-modal-header">
                <h2>Confirm Delete</h2>
                <button onClick={closeDeleteModal} className="custom-close-btn">
                  &times;
                </button>
              </div>
              <div className="custom-modal-body">
                <p style={{ margin: 0, color: "var(--text-primary)" }}>
                  {deleteTarget === "bulk"
                    ? `Are you sure you want to delete ${selectedTodos.length} todos? This action cannot be undone.`
                    : "Are you sure you want to delete this todo? This action cannot be undone."}
                </p>
              </div>
              <div className="custom-modal-actions">
                <button
                  onClick={closeDeleteModal}
                  className="custom-btn custom-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    deleteTarget === "bulk"
                      ? confirmBulkDelete
                      : confirmSingleDelete
                  }
                  className="custom-btn custom-btn-danger"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
