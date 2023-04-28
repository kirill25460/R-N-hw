import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { authReducer } from './auth/sliceAuth';
// import { contactsReducer } from './contacts/sliceContacts';
// import { filterReducer } from './contacts/sliceFilter';

// const rootReducer = combineReducers({ authReducer });

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
