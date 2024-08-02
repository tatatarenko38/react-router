import React, { createContext, useContext } from "react";

import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Link } from "react-router-dom";

//  <BrowserRouter> <Routes>

const Home: React.FC = () => {
  return (
    <div className="App-header">
      Home page
      {/* додамо посилання на наші наявні сторінки */}
      <div>
        <Link className="App-link" to="/dashboard">
          Dashboard
        </Link>
      </div>
      <div>
        <Link className="App-link" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const auth = useContext(AuthContext);

  //navigate
  const navigate = useNavigate();

  const handleClick = () => {
    //якщо є kонтекст, то виконуємо його(true)
    if (auth) auth.login(true);
    //navigate - при натисканні на логін переводе на сторінку dashboard
    navigate("/dashboard");
  };
  return (
    <div onClick={handleClick} className="App-header">
      Login
    </div>
  );
};

const Dashboard: React.FC = () => {
  return <div className="App-header">Dashboard page</div>;
};

const Error: React.FC = () => {
  return <div className="App-header">Error page</div>;
};

//PrivateRoute
type ContextType = {
  isLogged: boolean;
  login: (status: boolean) => void;
};

//
const AuthContext = createContext<ContextType | null>(null);

//компонент
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //витягуємо данні AuthContext
  const auth = useContext(AuthContext);

  // якщо контексту немає
  if (!auth) return <Error />;

  //перевіряю чи увійшов користувач - так - повертаю {children}
  //у фрагменті, щоб можна було додавати код
  // ні - компонент <Login /> - щоб увійшов в аккаунт
  //replace - заміняє історію, щоб ми змогли повернутися назад
  return auth.isLogged ? <>{children}</> : <Navigate to="/login" replace />;
};

// useParams();

const Profile: React.FC = () => {
  // через useParams() витягуємо profileId
  const { profileId } = useParams();

  React.useEffect(() => {
    //замість alert можемо робити запит на сервер для отримання данних
    //конкретного профілю по ID, який ми ввели в URL
    alert(`Завантаження данних для ID: ${profileId}`);
  }, [profileId]);

  return <div className="App-hrader">Profile Page ID: {profileId}</div>;
};

function App() {
  //false - відкривається Login, a dashboard не доступнаЄ
  //поки користувач не увійшов в аккаунт
  const [isLogged, login] = React.useState(false);
  return (
    <AuthContext.Provider value={{ isLogged, login }}>
      <BrowserRouter>
        <Routes>
          <Route index Component={Home} />
          <Route path="/login" Component={Login} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            // profileId - параметр
            path="/profile/:profileId"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" Component={Error} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
