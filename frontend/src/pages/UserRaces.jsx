import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import authStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProgressBar from "../components/ProgressBar";
import { Calendar, Target } from "lucide-react";

const UserRaces = () => {
  const navigate = useNavigate();
  const { user, token } = authStore();
  const [races, setRaces] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchUserRaces = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/races");

        // Fetch progress for all races
        const progressPromises = data.map((race) =>
          api
            .get(`/races/${race.id}/progress`)
            .then((res) => ({ raceId: race.id, data: res.data }))
            .catch(() => null)
        );

        const progressResults = await Promise.all(progressPromises);
        const progress = {};
        progressResults.forEach((result) => {
          if (result) {
            progress[result.raceId] = result.data;
          }
        });

        // Filter only races the user has joined
        const userJoinedRaces = data.filter((race) => progress[race.id]);
        setRaces(userJoinedRaces);
        setProgressData(progress);
      } catch (err) {
        console.error("Failed to fetch races:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRaces();
  }, [user, token, navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">My Races</h1>

          {races.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-600 text-lg mb-4">
                You haven't joined any races yet
              </p>
              <button
                onClick={() => navigate("/races")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Explore Races
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {races.map((race) => {
                const progress = progressData[race.id];
                return (
                  <div
                    key={race.id}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {race.title}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {race.description || "No description"}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Target size={16} />
                          Target Distance
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {race.distance_target} km
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Calendar size={16} />
                          Duration
                        </div>
                        <p className="text-sm text-gray-900">
                          {new Date(race.start_date).toLocaleDateString()} to{" "}
                          {new Date(race.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {progress && (
                      <ProgressBar
                        current={parseFloat(progress.total_distance)}
                        target={progress.distance_target}
                      />
                    )}

                    <button
                      onClick={() => navigate(`/races/${race.id}`)}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      View Details →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default UserRaces;
