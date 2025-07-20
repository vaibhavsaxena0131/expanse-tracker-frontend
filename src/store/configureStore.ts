import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import expensesReducer from '../features/expensesSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

/**
 * Persist config: use localStorage (default)
 */
const persistConfig = {
  key: 'root',
  storage,
};

/**
 * Root reducer
 */
const rootReducer = combineReducers({
  auth: authReducer,
  expenses: expensesReducer,
});

/**
 * Persisted reducer
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure store with persisted reducer & custom middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // disable check for non-serializable data from redux-persist
    }),
});

/**
 * Persistor for PersistGate
 */
export const persistor = persistStore(store);

/**
 * Types for usage in app
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
