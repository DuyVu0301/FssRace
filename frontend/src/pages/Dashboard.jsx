import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import authStore from "../store/authStore";
import activityStore from "../store/activityStore";
import ProgressBar from "../components/ProgressBar";
import ActivityList from "../components/ActivityList";
import { LogOut, Activity } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = authStore();
  const { activities, isSyncing, setActivities, setSyncing } = activityStore();
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [racesRes, activitiesRes] = await Promise.all([
          api.get("/races"),
          api.get("/strava/activities"),
        ]);

        setRaces(racesRes.data);
        setActivities(activitiesRes.data);

        if (racesRes.data.length > 0) {
          setSelectedRace(racesRes.data[0].id);
          const progressRes = await api.get(
            `/races/${racesRes.data[0].id}/progress`
          );
          setProgress(progressRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSyncStrava = async () => {
    try {
      setSyncing(true);
      const { data } = await api.post("/strava/sync");
      alert(`${data.count} activities synced!`);

      const activitiesRes = await api.get("/strava/activities");
      setActivities(activitiesRes.data);
    } catch (err) {
      alert("Failed to sync activities: " + err.response?.data?.error);
    } finally {
      setSyncing(false);
    }
  };

  const handleRaceChange = async (raceId) => {
    setSelectedRace(raceId);
    try {
      const { data } = await api.get(`/races/${raceId}/progress`);
      setProgress(data);
    } catch (err) {
      console.error("Failed to fetch race progress:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <h1 className="text-2xl font-bold text-gray-900">
            FSS Race Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Race Selection */}
            {races.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Select Race</h2>
                <select
                  value={selectedRace || ""}
                  onChange={(e) => handleRaceChange(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {races.map((race) => (
                    <option key={race.id} value={race.id}>
                      {race.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Progress Section */}
            {progress && (
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">{progress.title}</h2>
                <ProgressBar
                  current={parseFloat(progress.total_distance)}
                  target={progress.distance_target}
                />
              </div>
            )}

            {/* Activities Section */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Activity size={20} />
                  Recent Activities
                </h2>
                <button
                  onClick={handleSyncStrava}
                  disabled={isSyncing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSyncing ? "Syncing..." : "Sync Strava"}
                </button>
              </div>
              <ActivityList activities={activities} isLoading={false} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/races")}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Explore Races
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300"
                >
                  My Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
