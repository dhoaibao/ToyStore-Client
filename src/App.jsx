import './App.css'
import LoadingPage from './pages/Loading';
import NotFoundPage from './pages/NotFound';
import routes from './routes';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';


const MainLayout = lazy(() => import('./layouts/MainLayout'));

function App() {

  return (
    <Suspense fallback={<LoadingPage />}>
      <BrowserRouter>
        <ToastContainer
          position='top-left'
          autoClose={1000}
          hideProgressBar={false}
          closeOnClick={true}
          pauseOnHover={true}
          draggable={true}
          theme='light'
        />
        <Routes>
          {routes.map(({ id, path, element }) => (
            <Route
              key={id}
              path={path}
              element={<MainLayout>{element}</MainLayout>}
            />
          ))}
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
