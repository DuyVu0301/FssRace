import { Calendar, Zap } from "lucide-react";

const ActivityList = ({ activities, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading activities...</div>;
  }

  if (!activities.length) {
    return (
      <div className="text-center py-4 text-gray-500">No activities yet</div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {activity.activity_type}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                <span className="flex items-center gap-1">
                  <Zap size={16} />
                  {activity.distance} km
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(activity.start_date_local).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
