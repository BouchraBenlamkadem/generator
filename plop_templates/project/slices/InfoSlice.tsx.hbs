import { createSlice } from "@reduxjs/toolkit";

/**
 * Slice used for displaying information to user across app:
 * loading : shows/hides loader component
 * messages : array of messages to show user
 * alerts : array of alerts to show user
 * testToken : test variable used to cancel token test condition on actions if refresh token middleware failed
 */

const slice = createSlice({
  name: "info",
  initialState: {
    loading: [], // Array instead of Boolean in order to keep app loading until all loaders are removed
    alerts: [], 
    messages: [],
    testToken: true 
  },
  reducers: {
    setLoading: (state:any, action:any) => {
      action.payload ? state.loading.push(1) : state.loading.pop();
    },
    addAlert: (state:any, action:any) => {
      state.alerts = state.alerts.map((alert:any) => ({ ...alert, hidden: true }));
      state.alerts.push(action.payload);
    },
    removeAlert: (state:any, action:any) => {
      //removed only by alert visibility, keep in state as otherwise the following alerts won't show up
    },
    addMessage: (state:any, action:any) => {
      const length = state.messages.length;
      // avoid occurences ---->
      if (length == 0 || state.messages[length - 1].message != action.payload.message)
        state.messages.push(action.payload);
    },
    deleteMessage: (state:any, action:any) => {
      const messages = state.messages.filter((_:any, index:number) => index !== action.payload);
      state.messages = messages;
    },
    clearMessages: (state:any, action:any) => {
      state.messages = [];
    },
    setTestToken: (state:any, action:any) => {
      state.testToken = action.payload;
    }
  }
});

export default slice;
