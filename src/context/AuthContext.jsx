import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);

const initialState = () => {
  try {
    const stored = localStorage.getItem('ss_user');
    return stored ? JSON.parse(stored) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { user: null, token: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, initialState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('ss_user', JSON.stringify(state));
    } else {
      localStorage.removeItem('ss_user');
    }
  }, [state]);

  const login = (token, user) => {
    dispatch({ type: 'LOGIN', payload: { token, user } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
