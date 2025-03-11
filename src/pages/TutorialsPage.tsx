import React from 'react';
import { Play, Camera, Image, Sun, Home } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  icon: React.ReactNode;
}

const TutorialsPage: React.FC = () => {
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Composition Basics for Real Estate',
      description: 'Learn the fundamentals of composition to make your property photos stand out.',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80',
      videoUrl: '#',
      duration: '2:45',
      icon: <Camera />,
    },
    {
      id: '2',
      title: 'Mastering Natural Light',
      description: 'Techniques for using natural light to enhance your property photos.',
      thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80',
      videoUrl: '#',
      duration: '3:12',
      icon: <Sun />,
    },
    {
      id: '3',
      title: 'Smartphone Camera Settings',
      description: 'Optimize your smartphone camera settings for professional-looking photos.',
      thumbnail: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      videoUrl: '#',
      duration: '4:30',
      icon: <Camera />,
    },
    {
      id: '4',
      title: 'Exterior Photography Tips',
      description: 'Capture stunning exterior shots that showcase the property.',
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1175&q=80',
      videoUrl: '#',
      duration: '3:45',
      icon: <Home />,
    },
    {
      id: '5',
      title: 'Interior Room Staging',
      description: 'Learn how to stage rooms for the best possible photos.',
      thumbnail: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
      videoUrl: '#',
      duration: '5:20',
      icon: <Image />,
    },
    {
      id: '6',
      title: 'Editing Basics for Realtors',
      description: 'Simple editing techniques you can do before professional editing.',
      thumbnail: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      videoUrl: '#',
      duration: '4:15',
      icon: <Image />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold neon-text">Photography Tutorials</h1>
        <p className="text-white/70 mt-2">
          Learn how to take better real estate photos with our short tutorial videos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <div key={tutorial.id} className="card overflow-hidden group">
            <div className="relative">
              <img 
                src={tutorial.thumbnail} 
                alt={tutorial.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="h-16 w-16 rounded-full bg-primary/80 flex items-center justify-center">
                  <Play className="h-8 w-8 text-white" fill="white" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-dark/80 text-white text-xs px-2 py-1 rounded">
                {tutorial.duration}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-1">
                  <div className="text-primary">{tutorial.icon}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-white/70 text-sm">{tutorial.description}</p>
                </div>
              </div>
              <button className="btn btn-outline w-full mt-4 flex items-center justify-center">
                <Play className="h-4 w-4 mr-2" />
                Watch Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-primary/20 to-secondary/20 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Want More Photography Tips?</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive weekly photography tips and tricks directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="input flex-grow"
            />
            <button className="btn btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialsPage;