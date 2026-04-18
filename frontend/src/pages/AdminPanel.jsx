import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import authStore from "../store/authStore";
import { Trash2, Edit } from "lucide-react";

const AdminPanel = () => {
  const { user, logout } = authStore();
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    distance_target: "",
    start_date: "",
    end_date: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchRaces = async () => {
      try {
        const { data } = await api.get("/races");
        setRaces(data);
      } catch (err) {
        console.error("Failed to fetch races:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRaces();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/races/${editingId}`, formData);
        alert("Race updated successfully");
        setEditingId(null);
      } else {
        await api.post("/races", formData);
        alert("Race created successfully");
      }

      setFormData({
        title: "",
        distance_target: "",
        start_date: "",
        end_date: "",
        description: "",
      });

      const { data } = await api.get("/races");
      setRaces(data);
    } catch (err) {
      alert("Error: " + err.response?.data?.error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/races/${id}`);
      setRaces((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Error: " + err.response?.data?.error);
    }
  };

  const handleEdit = (race) => {
    setFormData(race);
    setEditingId(race.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Create/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Race" : "Create New Race"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Race Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="number"
              name="distance_target"
              placeholder="Distance Target (km)"
              value={formData.distance_target}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                {editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: "",
                      distance_target: "",
                      start_date: "",
                      end_date: "",
                      description: "",
                    });
                  }}
                  className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Races List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">All Races</h2>

          {races.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No races yet</p>
          ) : (
            <div className="space-y-4">
              {races.map((race) => (
                <div
                  key={race.id}
                  className="border border-gray-200 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {race.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {race.distance_target} km target
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(race)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(race.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
