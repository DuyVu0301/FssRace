import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import authStore from "../store/authStore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Mail, Calendar, Link as LinkIcon } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, token } = authStore();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [stravaUrl, setStravaUrl] = useState("");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, statsRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/users/stats"),
        ]);

        setProfile(profileRes.data);
        setStats(statsRes.data);
        setFormData({
          username: profileRes.data.username,
          email: profileRes.data.email,
        });

        // Build Strava OAuth URL
        const clientId = "your_strava_client_id";
        const redirectUri = encodeURIComponent(
          "http://localhost:5000/api/auth/strava/callback"
        );
        const stravaOAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=activity:read_all`;
        setStravaUrl(stravaOAuthUrl);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.put("/users/profile", formData);
      setUser({ ...user, ...formData }, token);
      setProfile((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile: " + err.response?.data?.error);
    }
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
        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Profile Header */}
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile?.username}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Member since{" "}
                  {new Date(profile?.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Strava Connection */}
            {!profile?.stravaConnected && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6">
                <p className="text-orange-800 mb-3">
                  Connect your Strava account to sync activities automatically
                </p>
                <a
                  href={stravaUrl}
                  className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 font-semibold"
                >
                  <LinkIcon className="inline mr-2" size={18} />
                  Connect Strava
                </a>
              </div>
            )}

            {profile?.stravaConnected && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-green-800 font-semibold">
                  ✓ Strava Connected
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.total_activities}
                </p>
                <p className="text-gray-600 text-sm mt-2">Total Activities</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {parseFloat(stats.total_distance).toFixed(2)}
                </p>
                <p className="text-gray-600 text-sm mt-2">km</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {(stats.total_moving_time / 3600).toFixed(1)}
                </p>
                <p className="text-gray-600 text-sm mt-2">Hours</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {stats.races_joined}
                </p>
                <p className="text-gray-600 text-sm mt-2">Races Joined</p>
              </div>
            </div>
          )}

          {/* Edit Profile */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="font-semibold">{profile?.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold">
                      {new Date(profile?.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
