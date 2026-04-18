import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import authStore from "../store/authStore";
import { Calendar, Target } from "lucide-react";

const Races = () => {
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const handleJoinRace = async (raceId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/races/join", { raceId });
      alert("Successfully joined the race!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to join race: " + err.response?.data?.error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading races...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">FSS Race</h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-600 hover:underline"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-8">Active Races</h2>

        {races.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            No races available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {races.map((race) => (
              <div
                key={race.id}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {race.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {race.description || "No description"}
                </p>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Target size={16} />
                    {race.distance_target} km target
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(race.start_date).toLocaleDateString()} to{" "}
                    {new Date(race.end_date).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => handleJoinRace(race.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Join Race
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Races;
