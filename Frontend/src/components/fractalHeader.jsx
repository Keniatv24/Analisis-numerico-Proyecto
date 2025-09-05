const fractalHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="relative h-10 w-10 mr-3">
            <div className="absolute inset-0 bg-teal-800 rounded-lg transform rotate-45"></div>
            <div className="absolute inset-1 bg-teal-500 rounded-md transform rotate-12"></div>
            <div className="absolute inset-2 bg-teal-400 rounded-sm transform -rotate-12"></div>
            <div className="absolute inset-3 bg-white dark:bg-gray-800 rounded-sm"></div>
            <div className="absolute inset-4 bg-teal-600 rounded-sm transform -rotate-90"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
            FRACTAL
          </h1>
        </div>
      </div>
    )
  }

  export default fractalHeader