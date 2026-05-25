import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
        </div>
        <p className="mt-4 text-xl text-accent font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;