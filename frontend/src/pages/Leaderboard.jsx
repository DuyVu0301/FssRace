import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Trophy, Medal } from "lucide-react";

const Leaderboard = () => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedRaceId, setSelectedRaceId] = useState(null);
  const [raceLeaderboard, setRaceLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("global");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [globalRes, racesRes] = await Promise.all([
          api.get("/leaderboard/global"),
          api.get("/races"),
        ]);

        setGlobalLeaderboard(globalRes.data);
        setRaces(racesRes.data);

        if (racesRes.data.length > 0) {
          setSelectedRaceId(racesRes.data[0].id);
          const raceRes = await api.get(
            `/leaderboard/race/${racesRes.data[0].id}`
          );
          setRaceLeaderboard(raceRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRaceChange = async (raceId) => {
    setSelectedRaceId(raceId);
    try {
      const { data } = await api.get(`/leaderboard/race/${raceId}`);
      setRaceLeaderboard(data);
    } catch (err) {
      console.error("Failed to fetch race leaderboard:", err);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={20} />;
    if (rank === 2) return <Medal className="text-gray-400" size={20} />;
    if (rank === 3) return <Medal className="text-orange-600" size={20} />;
    return null;
  };

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
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Leaderboard</h1>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("global")}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === "global"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setActiveTab("race")}
              className={`pb-4 px-4 font-semibold transition ${
                activeTab === "race"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              By Race
            </button>
          </div>

          {activeTab === "global" ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Distance (km)
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">
                      Activities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {globalLeaderboard.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-2">
                        {getMedalIcon(entry.rank)}
                        <span className="font-bold text-gray-900">
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">
                        {entry.username}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {parseFloat(entry.total_distance).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {entry.total_activities}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              {races.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Race
                  </label>
                  <select
                    value={selectedRaceId || ""}
                    onChange={(e) => handleRaceChange(parseInt(e.target.value))}
                    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {races.map((race) => (
                      <option key={race.id} value={race.id}>
                        {race.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">
                        Username
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">
                        Distance (km)
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">
                        Activities
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {raceLeaderboard.length > 0 ? (
                      raceLeaderboard.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 flex items-center gap-2">
                            {getMedalIcon(entry.rank)}
                            <span className="font-bold text-gray-900">
                              #{entry.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-semibold">
                            {entry.username}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {parseFloat(entry.total_distance).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {entry.total_activities}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No participants yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Leaderboard;
