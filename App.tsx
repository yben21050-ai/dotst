import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './views/Home';
import Editor from './views/Editor';
import About from './views/About';
import useProjectState from './hooks/useProjectState';

const App: React.FC = () => {
  const {
    projects,
    activeProject,
    loadProject,
    createNewProject,
    deleteProject,
    updateProject,
  } = useProjectState();
  
  const navigate = useNavigate();

  const handleCreateNew = () => {
    const newId = createNewProject();
    navigate(`/editor/${newId}`);
  };

  const handleLoadProject = (id: string) => {
    loadProject(id);
    navigate(`/editor/${id}`);
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
  };

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              projects={projects}
              onCreateNew={handleCreateNew}
              onLoadProject={handleLoadProject}
              onDeleteProject={handleDeleteProject}
            />
          }
        />
        <Route
          path="/editor/:projectId"
          element={
            <Editor
              project={activeProject}
              onUpdate={updateProject}
              onLoadProject={loadProject}
            />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
};

export default App;
